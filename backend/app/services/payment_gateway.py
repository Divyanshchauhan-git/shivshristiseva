"""
Payment gateway client (Razorpay-compatible REST API; Cashfree/PayU follow the same shape).

Security rules enforced here:
  * The key SECRET and webhook SECRET are read from environment variables only.
  * Card / UPI / bank details are entered on the gateway's hosted checkout. They never reach this server.
  * A payment is marked successful ONLY after (a) the checkout callback signature verifies,
    and authoritatively (b) a signed `payment.captured` webhook is received.
  * Signatures are compared with hmac.compare_digest (constant time).
"""
import hashlib
import hmac
from dataclasses import dataclass

import httpx

from ..config import get_settings

API = "https://api.razorpay.com/v1"


@dataclass
class GatewayOrder:
    id: str
    amount_paise: int
    currency: str


class PaymentGatewayError(Exception):
    pass


def _auth() -> tuple[str, str]:
    s = get_settings()
    if not s.payment_key_id or not s.payment_key_secret:
        raise PaymentGatewayError("Payment gateway is not configured")
    return s.payment_key_id, s.payment_key_secret


def create_order(amount_rupees: int, receipt: str, notes: dict[str, str]) -> GatewayOrder:
    """Create an order server-side. Amount is fixed here, so the browser cannot change it."""
    payload = {"amount": amount_rupees * 100, "currency": "INR", "receipt": receipt, "notes": notes, "payment_capture": 1}
    try:
        r = httpx.post(f"{API}/orders", json=payload, auth=_auth(), timeout=15)
        r.raise_for_status()
    except httpx.HTTPError as e:
        raise PaymentGatewayError("Could not create payment order") from e
    d = r.json()
    return GatewayOrder(id=d["id"], amount_paise=d["amount"], currency=d["currency"])


def create_subscription(plan_id: str, total_count: int, notes: dict[str, str]) -> str:
    """Monthly giving via UPI AutoPay / card mandate. Plans are created once per amount tier in the dashboard or via API."""
    r = httpx.post(f"{API}/subscriptions", json={"plan_id": plan_id, "total_count": total_count, "customer_notify": 1, "notes": notes}, auth=_auth(), timeout=15)
    r.raise_for_status()
    return r.json()["id"]


def verify_checkout_signature(order_id: str, payment_id: str, signature: str) -> bool:
    """signature = HMAC_SHA256(order_id + "|" + payment_id, key_secret)"""
    _, secret = _auth()
    expected = hmac.new(secret.encode(), f"{order_id}|{payment_id}".encode(), hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature or "")


def verify_webhook_signature(raw_body: bytes, signature_header: str | None) -> bool:
    """X-Razorpay-Signature = HMAC_SHA256(raw request body, webhook_secret). Must use the RAW bytes."""
    secret = get_settings().payment_webhook_secret
    if not secret or not signature_header:
        return False
    expected = hmac.new(secret.encode(), raw_body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature_header)


def refund(payment_id: str, amount_rupees: int | None = None) -> dict:
    body = {"amount": amount_rupees * 100} if amount_rupees else {}
    r = httpx.post(f"{API}/payments/{payment_id}/refund", json=body, auth=_auth(), timeout=15)
    r.raise_for_status()
    return r.json()
