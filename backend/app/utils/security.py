from fastapi import Request
from slowapi import Limiter
from slowapi.util import get_remote_address
from starlette.middleware.base import BaseHTTPMiddleware

# Per-IP rate limiting. Behind a proxy, configure it to set X-Forwarded-For and use ProxyHeadersMiddleware.
limiter = Limiter(key_func=get_remote_address, default_limits=["300/minute"])

CSP = (
    "default-src 'self'; script-src 'self' https://checkout.razorpay.com; "
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; "
    "img-src 'self' data: https:; connect-src 'self' https://api.razorpay.com https://lumberjack.razorpay.com; "
    "frame-src https://api.razorpay.com https://checkout.razorpay.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
)


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        h = response.headers
        h.setdefault("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload")
        h.setdefault("X-Content-Type-Options", "nosniff")
        h.setdefault("X-Frame-Options", "DENY")
        h.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
        h.setdefault("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(self \"https://checkout.razorpay.com\")")
        h.setdefault("Content-Security-Policy", CSP)
        if request.url.path.startswith("/api/admin"):
            h["Cache-Control"] = "no-store"
        return response
