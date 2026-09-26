"""Password hashing (Argon2id) and signed session tokens (JWT in httpOnly cookies)."""
import uuid
from datetime import datetime, timedelta, timezone

import jwt
from argon2 import PasswordHasher
from argon2.exceptions import InvalidHashError, VerifyMismatchError

from ..config import get_settings

_ph = PasswordHasher()  # Argon2id with library defaults (memory-hard)
ALGO = "HS256"
ACCESS_COOKIE = "usf_access"
REFRESH_COOKIE = "usf_refresh"


def hash_password(password: str) -> str:
    return _ph.hash(password)


def verify_password(password: str, hashed: str) -> bool:
    try:
        return _ph.verify(hashed, password)
    except (VerifyMismatchError, InvalidHashError):
        return False


def needs_rehash(hashed: str) -> bool:
    return _ph.check_needs_rehash(hashed)


def _encode(sub: uuid.UUID, kind: str, ttl: timedelta, version: int) -> str:
    now = datetime.now(timezone.utc)
    s = get_settings()
    return jwt.encode({"sub": str(sub), "typ": kind, "ver": version, "iat": now, "exp": now + ttl, "jti": uuid.uuid4().hex}, s.jwt_secret, algorithm=ALGO)


def create_access_token(user_id: uuid.UUID, version: int) -> str:
    return _encode(user_id, "access", timedelta(minutes=get_settings().access_token_minutes), version)


def create_refresh_token(user_id: uuid.UUID, version: int) -> str:
    return _encode(user_id, "refresh", timedelta(days=get_settings().refresh_token_days), version)


def decode_token(token: str, expected: str) -> dict:
    data = jwt.decode(token, get_settings().jwt_secret, algorithms=[ALGO])
    if data.get("typ") != expected:
        raise jwt.InvalidTokenError("wrong token type")
    return data


def cookie_kwargs(max_age: int) -> dict:
    """httpOnly + Secure + SameSite=Strict: not readable by JS, not sent cross-site (CSRF defence)."""
    s = get_settings()
    return {"httponly": True, "secure": s.is_production, "samesite": "strict", "max_age": max_age, "path": "/api"}
