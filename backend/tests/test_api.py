import hashlib
import hmac
import json
import os
import uuid

os.environ.update(DATABASE_URL="sqlite:///./test.db", PAYMENT_KEY_ID="rzp_test_key", PAYMENT_KEY_SECRET="test_secret", PAYMENT_WEBHOOK_SECRET="whsec", JWT_SECRET="x" * 40)

import pytest  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402

from app.database import Base, SessionLocal, engine  # noqa: E402
from app.main import app  # noqa: E402
from app.models import Donation, PaymentStatus, Role, User  # noqa: E402
from app.auth.security import hash_password  # noqa: E402
from app.services import payment_gateway as gw  # noqa: E402

client = TestClient(app)


@pytest.fixture(autouse=True, scope="module")
def db():
    Base.metadata.drop_all(engine); Base.metadata.create_all(engine)
    with SessionLocal() as s:
        s.add(User(email="fin@test.org", name="Fin", role=Role.finance, password_hash=hash_password("correct horse battery")))
        s.add(User(email="content@test.org", name="Con", role=Role.content_manager, password_hash=hash_password("correct horse battery")))
        s.commit()
    yield
    Base.metadata.drop_all(engine)


def order_body(**kw):
    b = {"cause": "Education", "amount": 1000, "frequency": "one-time", "method": "upi", "consent": True,
         "donor": {"name": "Asha", "email": "asha@example.com", "phone": "9876543210", "wants80G": False, "anonymous": False}}
    b.update(kw); return b


def test_health_and_headers():
    r = client.get("/api/health")
    assert r.status_code == 200 and r.headers["x-frame-options"] == "DENY" and "content-security-policy" in r.headers


def test_form_validation_errors_are_field_level():
    r = client.post("/api/contact", json={"name": "A", "email": "bad", "subject": "Hi", "message": "short"})
    assert r.status_code == 422
    fields = {d["loc"][-1] for d in r.json()["detail"]}
    assert {"name", "email", "message"} <= fields


def test_contact_ok():
    r = client.post("/api/contact", json={"name": "Ravi", "email": "ravi@example.com", "subject": "Hello", "message": "I would like to help."})
    assert r.status_code == 201 and r.json()["reference"].startswith("MSG-")


def test_donation_amount_limits_and_80g_requirements():
    assert client.post("/api/donations/create-order", json=order_body(amount=50)).status_code == 422
    bad = order_body(); bad["donor"]["wants80G"] = True
    assert client.post("/api/donations/create-order", json=bad).status_code == 422


def test_full_payment_flow_with_signed_webhook(monkeypatch):
    monkeypatch.setattr(gw, "create_order", lambda amt, rec, notes: gw.GatewayOrder(id="order_TEST1", amount_paise=amt * 100, currency="INR"))
    r = client.post("/api/donations/create-order", json=order_body())
    assert r.status_code == 200, r.text
    body = r.json(); did = body["donationId"]
    assert body["publicKey"] == "rzp_test_key" and "secret" not in json.dumps(body).lower()

    # checkout callback with a valid signature -> pending (webhook is authoritative)
    sig = hmac.new(b"test_secret", b"order_TEST1|pay_1", hashlib.sha256).hexdigest()
    r = client.post(f"/api/donations/{did}/verify", json={"razorpay_order_id": "order_TEST1", "razorpay_payment_id": "pay_1", "razorpay_signature": sig})
    assert r.json()["status"] == "pending"

    # forged webhook is rejected
    event = {"event": "payment.captured", "created_at": 1, "payload": {"payment": {"entity": {"id": "pay_1", "order_id": "order_TEST1", "amount": 100000, "method": "upi"}}}}
    raw = json.dumps(event).encode()
    assert client.post("/api/donations/webhook", content=raw, headers={"X-Razorpay-Signature": "forged"}).status_code == 400

    good = hmac.new(b"whsec", raw, hashlib.sha256).hexdigest()
    h = {"X-Razorpay-Signature": good, "X-Razorpay-Event-Id": "evt_1", "Content-Type": "application/json"}
    assert client.post("/api/donations/webhook", content=raw, headers=h).json()["status"] == "ok"
    assert client.post("/api/donations/webhook", content=raw, headers=h).json()["status"] == "duplicate"  # idempotent
    st = client.get(f"/api/donations/{did}/status").json()
    assert st["status"] == "success" and st["receiptNumber"]


def test_webhook_amount_mismatch_does_not_mark_success(monkeypatch):
    monkeypatch.setattr(gw, "create_order", lambda amt, rec, notes: gw.GatewayOrder(id="order_TEST2", amount_paise=amt * 100, currency="INR"))
    did = client.post("/api/donations/create-order", json=order_body()).json()["donationId"]
    event = {"event": "payment.captured", "created_at": 2, "payload": {"payment": {"entity": {"id": "pay_2", "order_id": "order_TEST2", "amount": 100}}}}
    raw = json.dumps(event).encode()
    client.post("/api/donations/webhook", content=raw, headers={"X-Razorpay-Signature": hmac.new(b"whsec", raw, hashlib.sha256).hexdigest(), "X-Razorpay-Event-Id": "evt_2"})
    with SessionLocal() as s:
        assert s.get(Donation, uuid.UUID(did)).status != PaymentStatus.success


def test_admin_requires_auth_and_rbac():
    c = TestClient(app)
    assert c.get("/api/admin/dashboard").status_code == 401
    assert c.post("/api/admin/login", json={"email": "fin@test.org", "password": "wrong"}).status_code == 401
    assert c.post("/api/admin/login", json={"email": "fin@test.org", "password": "correct horse battery"}).status_code == 200
    assert c.get("/api/admin/me").json()["role"] == "finance"
    assert c.get("/api/admin/donations").status_code == 200
    assert c.get("/api/admin/users").status_code == 403          # finance cannot manage users
    assert c.get("/api/admin/campaigns").status_code == 403      # nor edit campaigns
    c2 = TestClient(app)
    c2.post("/api/admin/login", json={"email": "content@test.org", "password": "correct horse battery"})
    assert c2.get("/api/admin/donations").status_code == 403     # content manager cannot see donations
    assert c2.get("/api/admin/stories").status_code == 200
