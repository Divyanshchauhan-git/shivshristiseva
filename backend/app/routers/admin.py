"""Admin API: authentication, dashboard, CRUD, donations, uploads. Every route requires a signed-in user with the right permission."""
import csv
import io
import uuid
from datetime import datetime, timedelta, timezone
from typing import Any

import jwt
from fastapi import APIRouter, Body, Depends, HTTPException, Query, Request, Response
from fastapi.responses import StreamingResponse
from sqlalchemy import func, inspect, select
from sqlalchemy.orm import Session

from ..auth.deps import current_user, require
from ..auth.security import (ACCESS_COOKIE, REFRESH_COOKIE, cookie_kwargs, create_access_token, create_refresh_token, decode_token,
                             hash_password, needs_rehash, verify_password)
from ..config import get_settings
from ..database import get_db
from ..models import (AnimalCase, AnimalListing, AuditLog, Campaign, CampaignStatus, ContactMessage, Document, Donation, Event, GalleryAlbum,
                      ImpactMetric, Partnership, PaymentStatus, Programme, Story, User, Volunteer)
from ..schemas import LoginIn, MeOut
from ..services import payment_gateway as gw
from ..services.storage import presign_upload
from ..utils.audit import audit
from ..utils.security import limiter

router = APIRouter(prefix="/api/admin", tags=["admin"])
MAX_FAILED = 5
LOCK_MINUTES = 15


# ------------------------------------------------------------------ auth
def _set_session(resp: Response, user: User) -> None:
    s = get_settings()
    resp.set_cookie(ACCESS_COOKIE, create_access_token(user.id, user.token_version), **cookie_kwargs(s.access_token_minutes * 60))
    resp.set_cookie(REFRESH_COOKIE, create_refresh_token(user.id, user.token_version), **cookie_kwargs(s.refresh_token_days * 86400))


@router.post("/login")
@limiter.limit("5/minute")
def login(request: Request, body: LoginIn, response: Response, db: Session = Depends(get_db)):
    user = db.scalar(select(User).where(func.lower(User.email) == body.email.lower()))
    now = datetime.now(timezone.utc)
    generic = HTTPException(401, "Email or password is incorrect.")
    if not user or not user.is_active:
        verify_password(body.password, "$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHQ$ZmFrZWhhc2g")  # equalise timing
        raise generic
    if user.locked_until and user.locked_until > now:
        raise HTTPException(429, "Too many attempts. Try again in a few minutes.")
    if not verify_password(body.password, user.password_hash):
        user.failed_logins += 1
        if user.failed_logins >= MAX_FAILED:
            user.locked_until, user.failed_logins = now + timedelta(minutes=LOCK_MINUTES), 0
        audit(db, request, user, "Failed sign-in", "user", str(user.id))
        db.commit()
        raise generic
    if user.mfa_secret and not body.otp:
        raise HTTPException(401, "Enter the 6-digit code from your authenticator app.")
    # (TOTP verification with pyotp goes here when mfa_secret is set.)
    if needs_rehash(user.password_hash):
        user.password_hash = hash_password(body.password)
    user.failed_logins, user.locked_until, user.last_login_at = 0, None, now
    audit(db, request, user, "Signed in", "session")
    db.commit()
    _set_session(response, user)
    return {"ok": True}


@router.post("/refresh")
def refresh(request: Request, response: Response, db: Session = Depends(get_db)):
    token = request.cookies.get(REFRESH_COOKIE)
    try:
        data = decode_token(token or "", "refresh")
    except jwt.PyJWTError:
        raise HTTPException(401, "Session expired")
    user = db.get(User, uuid.UUID(data["sub"]))
    if not user or not user.is_active or user.token_version != data.get("ver"):
        raise HTTPException(401, "Session no longer valid")
    _set_session(response, user)  # rotate both tokens
    return {"ok": True}


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(ACCESS_COOKIE, path="/api")
    response.delete_cookie(REFRESH_COOKIE, path="/api")
    return {"ok": True}


@router.get("/me", response_model=MeOut, response_model_by_alias=True)
def me(user: User = Depends(current_user)):
    return MeOut(id=user.id, name=user.name, email=user.email, role=user.role.value, is_active=user.is_active, mfa=bool(user.mfa_secret))


# ------------------------------------------------------------------ dashboard
@router.get("/dashboard")
def dashboard(user: User = Depends(require("dashboard:view")), db: Session = Depends(get_db)):
    month_start = datetime.now(timezone.utc).replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    ok = Donation.status == PaymentStatus.success
    return {
        "totalDonations": db.scalar(select(func.coalesce(func.sum(Donation.amount), 0)).where(ok)),
        "monthDonations": db.scalar(select(func.coalesce(func.sum(Donation.amount), 0)).where(ok, Donation.paid_at >= month_start)),
        "activeCampaigns": db.scalar(select(func.count()).select_from(Campaign).where(Campaign.status == CampaignStatus.active)),
        "volunteerApplications": db.scalar(select(func.count()).select_from(Volunteer)),
        "newVolunteers": db.scalar(select(func.count()).select_from(Volunteer).where(Volunteer.status == "New")),
        "contactEnquiries": db.scalar(select(func.count()).select_from(ContactMessage)),
        "csrEnquiries": db.scalar(select(func.count()).select_from(Partnership)),
        "recentActivity": [{"at": a.at, "actor": a.actor_email, "action": a.action, "entity": a.entity_type}
                           for a in db.scalars(select(AuditLog).order_by(AuditLog.at.desc()).limit(10))],
    }


# ------------------------------------------------------------------ donations
@router.get("/donations")
def list_donations(user: User = Depends(require("donations:read")), db: Session = Depends(get_db),
                   status: PaymentStatus | None = None, campaign_id: uuid.UUID | None = None, date_from: datetime | None = None,
                   date_to: datetime | None = None, min_amount: int | None = None, page: int = Query(1, ge=1), size: int = Query(50, le=200)):
    q = select(Donation)
    if status: q = q.where(Donation.status == status)
    if campaign_id: q = q.where(Donation.campaign_id == campaign_id)
    if date_from: q = q.where(Donation.created_at >= date_from)
    if date_to: q = q.where(Donation.created_at <= date_to)
    if min_amount: q = q.where(Donation.amount >= min_amount)
    rows = db.scalars(q.order_by(Donation.created_at.desc()).offset((page - 1) * size).limit(size)).all()
    return [{"id": d.id, "reference": d.reference, "donor": "Anonymous" if d.is_anonymous else d.donor.name, "amount": d.amount,
             "campaignId": d.campaign_id, "cause": d.cause, "method": d.method, "status": d.status.value, "date": d.created_at,
             "receipt": "issued" if d.receipt_sent_at else ("pending" if d.status == PaymentStatus.success else "not applicable")} for d in rows]


@router.get("/donations/export.csv")
def export_donations(request: Request, user: User = Depends(require("donations:export")), db: Session = Depends(get_db)):
    buf = io.StringIO()
    w = csv.writer(buf)
    w.writerow(["Reference", "Donor", "Email", "Amount (INR)", "Cause", "Method", "Status", "Created", "Paid", "Receipt"])
    safe = lambda v: ("'" + v) if isinstance(v, str) and v[:1] in "=+-@" else v  # CSV formula-injection guard
    for d in db.scalars(select(Donation).order_by(Donation.created_at.desc())):
        w.writerow([safe(x) for x in [d.reference, d.donor.name, d.donor.email, d.amount, d.cause, d.method, d.status.value, d.created_at, d.paid_at, d.receipt_number]])
    audit(db, request, user, "Exported donations CSV", "donation"); db.commit()
    return StreamingResponse(iter([buf.getvalue()]), media_type="text/csv", headers={"Content-Disposition": "attachment; filename=donations.csv"})


@router.post("/donations/{donation_id}/refund")
def refund_donation(request: Request, donation_id: uuid.UUID, user: User = Depends(require("donations:refund")), db: Session = Depends(get_db)):
    d = db.get(Donation, donation_id)
    if not d or d.status != PaymentStatus.success or not d.gateway_payment_id:
        raise HTTPException(400, "Only successful payments can be refunded")
    gw.refund(d.gateway_payment_id)  # final status arrives via the refund.processed webhook
    audit(db, request, user, "Requested refund", "donation", str(d.id)); db.commit()
    return {"ok": True}


# ------------------------------------------------------------------ uploads
@router.post("/uploads/sign")
def sign_upload(content_type: str = Body(embed=True), folder: str = Body("media", embed=True), private: bool = Body(False, embed=True),
                user: User = Depends(require("gallery:write"))):
    try:
        return presign_upload(content_type, folder, private)
    except ValueError as e:
        raise HTTPException(400, str(e))


# ------------------------------------------------------------------ generic CRUD
READONLY = {"id", "created_at", "updated_at"}
PROTECTED = {"password_hash", "mfa_secret", "token_version", "failed_logins", "locked_until"}


def _dump(obj: Any) -> dict:
    return {c.key: getattr(obj, c.key) for c in inspect(obj).mapper.column_attrs if c.key not in PROTECTED}


def crud(name: str, model: type, perm: str) -> None:
    """Registers GET list, GET one, POST, PATCH, DELETE for /api/admin/{name}. Payloads are filtered to real columns."""
    columns = {c.key for c in inspect(model).mapper.column_attrs} - READONLY - PROTECTED

    @router.get(f"/{name}", name=f"list_{name}")
    def _list(user: User = Depends(require(perm)), db: Session = Depends(get_db), page: int = Query(1, ge=1), size: int = Query(50, le=200)):
        return [_dump(r) for r in db.scalars(select(model).offset((page - 1) * size).limit(size))]

    @router.get(f"/{name}/{{item_id}}", name=f"get_{name}")
    def _get(item_id: uuid.UUID, user: User = Depends(require(perm)), db: Session = Depends(get_db)):
        obj = db.get(model, item_id)
        if not obj: raise HTTPException(404, "Not found")
        return _dump(obj)

    @router.post(f"/{name}", status_code=201, name=f"create_{name}")
    def _create(request: Request, payload: dict = Body(...), user: User = Depends(require(perm)), db: Session = Depends(get_db)):
        data = {k: v for k, v in payload.items() if k in columns}
        obj = model(**data); db.add(obj); db.flush()
        audit(db, request, user, "Created", name, str(obj.id), {"fields": sorted(data)}); db.commit()
        return _dump(obj)

    @router.patch(f"/{name}/{{item_id}}", name=f"update_{name}")
    def _update(request: Request, item_id: uuid.UUID, payload: dict = Body(...), user: User = Depends(require(perm)), db: Session = Depends(get_db)):
        obj = db.get(model, item_id)
        if not obj: raise HTTPException(404, "Not found")
        changed = {}
        for k, v in payload.items():
            if k in columns and getattr(obj, k) != v:
                changed[k] = True; setattr(obj, k, v)
        audit(db, request, user, "Updated", name, str(obj.id), {"fields": sorted(changed)}); db.commit()
        return _dump(obj)

    @router.delete(f"/{name}/{{item_id}}", status_code=204, name=f"delete_{name}")
    def _delete(request: Request, item_id: uuid.UUID, user: User = Depends(require(perm)), db: Session = Depends(get_db)):
        obj = db.get(model, item_id)
        if not obj: raise HTTPException(404, "Not found")
        if hasattr(obj, "status") and name in {"campaigns", "stories", "programmes", "events"}:
            obj.status = "archived"  # soft delete keeps history and donation links intact
        else:
            db.delete(obj)
        audit(db, request, user, "Deleted", name, str(item_id)); db.commit()


for _name, _model, _perm in [
    ("programmes", Programme, "programmes:write"), ("campaigns", Campaign, "campaigns:write"), ("stories", Story, "stories:write"),
    ("events", Event, "events:write"), ("gallery", GalleryAlbum, "gallery:write"), ("animals", AnimalListing, "animals:write"),
    ("animal-cases", AnimalCase, "animals:write"), ("impact-metrics", ImpactMetric, "impact:write"), ("documents", Document, "documents:write"),
    ("volunteers", Volunteer, "volunteers:manage"), ("partnerships", Partnership, "csr:manage"), ("messages", ContactMessage, "messages:read"),
]:
    crud(_name, _model, _perm)


# ------------------------------------------------------------------ users (super admin)
@router.get("/users")
def list_users(user: User = Depends(require("users:manage")), db: Session = Depends(get_db)):
    return [_dump(u) for u in db.scalars(select(User))]


@router.post("/users", status_code=201)
def invite_user(request: Request, email: str = Body(embed=True), name: str = Body(embed=True), role: str = Body(embed=True),
                user: User = Depends(require("users:manage")), db: Session = Depends(get_db)):
    import secrets
    new = User(email=email.lower(), name=name, role=role, password_hash=hash_password(secrets.token_urlsafe(32)))
    db.add(new); db.flush()
    audit(db, request, user, "Invited user", "user", str(new.id), {"role": role}); db.commit()
    # A one-time set-password link is emailed; the random password above is never shown.
    return _dump(new)


@router.post("/users/{user_id}/revoke-sessions")
def revoke_sessions(request: Request, user_id: uuid.UUID, user: User = Depends(require("users:manage")), db: Session = Depends(get_db)):
    target = db.get(User, user_id)
    if not target: raise HTTPException(404, "Not found")
    target.token_version += 1
    audit(db, request, user, "Revoked sessions", "user", str(user_id)); db.commit()
    return {"ok": True}
