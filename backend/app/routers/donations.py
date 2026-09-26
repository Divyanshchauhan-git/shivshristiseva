"""
Donation flow.

  1. POST /api/donations/create-order   → server validates, fixes the amount, creates the gateway order.
  2. Browser opens the gateway's hosted checkout with the order id + PUBLIC key.
  3. POST /api/donations/{id}/verify    → server checks the checkout signature (fast UX confirmation).
  4. POST /api/donations/webhook        → gateway-signed event; the AUTHORITATIVE status source. Idempotent.
  5. GET  /api/donations/{id}/status    → the success / pending / failed page polls this.
"""
import json
import secrets
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Request
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from ..config import get_settings
from ..database import get_db
from ..models import Campaign, CampaignStatus, Donation, Donor, PaymentEvent, PaymentStatus
from ..schemas import CreateOrderIn, CreateOrderOut, DonationStatusOut, VerifyIn
from ..services import payment_gateway as gw
from ..services.notifications import donation_confirmation
from ..utils.audit import audit
from ..utils.security import limiter

router = APIRouter(prefix="/api/donations", tags=["donations"])


def _reference() -> str:
    now = datetime.now(timezone.utc)
    return f"SSS-{now:%Y%m}-{secrets.randbelow(90000) + 10000}{secrets.token_hex(1).upper()}"


def _status_out(d: Donation) -> DonationStatusOut:
    return DonationStatusOut(
        donation_id=d.id, reference=d.reference, status=d.status.value, amount=d.amount, frequency=d.frequency, cause=d.cause,
        created_at=d.created_at, receipt_number=d.receipt_number, donor_name="Anonymous donor" if d.is_anonymous else d.donor.name,
        donor_email=d.donor.email, method=d.method,
    )


@router.post("/create-order", response_model=CreateOrderOut, response_model_by_alias=True)
@limiter.limit("10/minute")
def create_order(request: Request, body: CreateOrderIn, db: Session = Depends(get_db)):
    campaign = None
    if body.campaign_slug:
        campaign = db.scalar(select(Campaign).where(Campaign.slug == body.campaign_slug, Campaign.status == CampaignStatus.active))
        if not campaign:
            raise HTTPException(400, "This campaign is not accepting donations right now")

    d_in = body.donor
    donor = Donor(email=d_in.email, name=d_in.name, phone=d_in.phone, pan=d_in.pan if d_in.wants80_g else None,
                  address=d_in.address if d_in.wants80_g else None, city=d_in.city, state=d_in.state, pincode=d_in.pincode)
    db.add(donor); db.flush()

    donation = Donation(reference=_reference(), donor_id=donor.id, campaign_id=campaign.id if campaign else None, cause=body.cause,
                        amount=body.amount, frequency=body.frequency, method=body.method, gateway=get_settings().payment_gateway,
                        is_anonymous=d_in.anonymous, wants_tax_receipt=d_in.wants80_g, client_ip=request.client.host if request.client else None)
    db.add(donation); db.flush()

    try:
        order = gw.create_order(body.amount, donation.reference, {"donation_id": str(donation.id), "cause": body.cause})
    except gw.PaymentGatewayError:
        db.rollback()
        raise HTTPException(503, "Payments are temporarily unavailable. Please try again shortly.")
    donation.gateway_order_id = order.id
    db.commit()
    return CreateOrderOut(donation_id=donation.id, reference=donation.reference, gateway_order_id=order.id, amount=body.amount, public_key=get_settings().payment_key_id)


@router.post("/{donation_id}/verify", response_model=DonationStatusOut, response_model_by_alias=True)
@limiter.limit("20/minute")
def verify(request: Request, donation_id: uuid.UUID, body: VerifyIn, db: Session = Depends(get_db)):
    d = db.get(Donation, donation_id)
    if not d:
        raise HTTPException(404, "Donation not found")
    order_id = body.razorpay_order_id or body.gateway_order_id
    payment_id = body.razorpay_payment_id or body.gateway_payment_id
    signature = body.razorpay_signature or body.signature
    if d.status == PaymentStatus.created and order_id == d.gateway_order_id and payment_id and signature:
        if gw.verify_checkout_signature(order_id, payment_id, signature):
            # Signature proves the checkout completed; the webhook will confirm capture. Show "processing" until then.
            d.status, d.gateway_payment_id = PaymentStatus.pending, payment_id
            db.commit()
        else:
            audit(db, request, None, "Invalid checkout signature", "donation", str(d.id))
            db.commit()
    return _status_out(d)


def _recompute_campaign(db: Session, campaign_id: uuid.UUID | None) -> None:
    if not campaign_id:
        return
    total, count = db.execute(select(func.coalesce(func.sum(Donation.amount), 0), func.count(func.distinct(Donation.donor_id)))
                              .where(Donation.campaign_id == campaign_id, Donation.status == PaymentStatus.success)).one()
    c = db.get(Campaign, campaign_id)
    c.raised_amount, c.supporters_count = int(total), int(count)


@router.post("/webhook", include_in_schema=False)
async def webhook(request: Request, background: BackgroundTasks, db: Session = Depends(get_db)):
    raw = await request.body()
    if not gw.verify_webhook_signature(raw, request.headers.get("X-Razorpay-Signature")):
        raise HTTPException(400, "Invalid signature")
    event = json.loads(raw)
    event_id = request.headers.get("X-Razorpay-Event-Id") or f"{event.get('event')}:{event.get('created_at')}"
    if db.get(PaymentEvent, event_id):
        return {"status": "duplicate"}  # idempotent: gateways retry deliveries

    etype = event.get("event", "")
    entity = (event.get("payload", {}).get("payment") or {}).get("entity") or {}
    d = db.scalar(select(Donation).where(Donation.gateway_order_id == entity.get("order_id"))) if entity.get("order_id") else None
    db.add(PaymentEvent(id=event_id, event_type=etype, donation_id=d.id if d else None, payload=event))

    if d:
        # Amount check: never trust a capture for a different amount than we created.
        if entity.get("amount") is not None and int(entity["amount"]) != d.amount * 100:
            audit(db, request, None, "Amount mismatch on webhook", "donation", str(d.id), {"expected": d.amount * 100, "got": entity.get("amount")})
        elif etype == "payment.captured" and d.status != PaymentStatus.success:
            d.status, d.gateway_payment_id, d.method = PaymentStatus.success, entity.get("id"), entity.get("method") or d.method
            d.paid_at = datetime.now(timezone.utc)
            d.receipt_number = f"RCPT-{d.paid_at:%Y}-{d.reference.split('-')[-1]}"
            _recompute_campaign(db, d.campaign_id)
            background.add_task(donation_confirmation, d.donor.email, d.donor.name, d.reference, d.amount, d.cause, d.receipt_number)
        elif etype == "payment.failed" and d.status != PaymentStatus.success:
            d.status, d.failure_reason = PaymentStatus.failed, (entity.get("error_description") or "")[:255]
        elif etype == "refund.processed":
            d.status = PaymentStatus.refunded
            _recompute_campaign(db, d.campaign_id)
    db.commit()
    return {"status": "ok"}


@router.post("/{donation_id}/cancel", response_model=DonationStatusOut, response_model_by_alias=True)
def cancel(donation_id: uuid.UUID, db: Session = Depends(get_db)):
    """Called when the donor closes the checkout. Only affects orders with no payment yet."""
    d = db.get(Donation, donation_id)
    if not d:
        raise HTTPException(404, "Donation not found")
    if d.status == PaymentStatus.created:
        d.status = PaymentStatus.cancelled
        db.commit()
    return _status_out(d)


@router.get("/{donation_id}/status", response_model=DonationStatusOut, response_model_by_alias=True)
@limiter.limit("60/minute")
def status(request: Request, donation_id: uuid.UUID, db: Session = Depends(get_db)):
    d = db.get(Donation, donation_id)
    if not d:
        raise HTTPException(404, "We could not find this donation.")
    return _status_out(d)
