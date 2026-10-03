"""Shivshristi Seva Sansthan API. Run: uvicorn app.main:app --reload"""
import logging

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from .config import get_settings
from .database import Base, engine
from . import models  # register all models with Base.metadata
from .routers import admin, donations, forms, public
from .utils.security import SecurityHeadersMiddleware, limiter

settings = get_settings()
logging.basicConfig(level=logging.INFO)

# Ensure database tables exist automatically (crucial for serverless environments)
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    logging.getLogger("udaan").warning(f"Could not auto-create database tables: {e}")

app = FastAPI(
    title="Shivshristi Seva Sansthan API",
    version="1.0.0",
    docs_url=None if settings.is_production else "/api/docs",
    redoc_url=None,
    openapi_url=None if settings.is_production else "/api/openapi.json",
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(GZipMiddleware, minimum_size=1024)

if settings.is_production:
    allowed_hosts = [
        "*.vercel.app",
        "localhost",
        "127.0.0.1",
        *[h.split("//")[-1] for h in settings.cors_list],
    ]
    app.add_middleware(TrustedHostMiddleware, allowed_hosts=allowed_hosts)

# CORSMiddleware added as outermost wrapper to ensure all requests and preflights receive CORS headers
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_list,
    allow_origin_regex=r"^https://.*\.vercel\.app$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    max_age=86400,
)


@app.exception_handler(RequestValidationError)
async def validation_handler(_: Request, exc: RequestValidationError):
    # Same shape FastAPI uses ({detail: [{loc, msg}]}) so the frontend maps field errors; never echoes input values.
    return JSONResponse(status_code=422, content={"detail": [{"loc": list(e["loc"]), "msg": e["msg"].replace("Value error, ", "")} for e in exc.errors()]})


@app.exception_handler(Exception)
async def unhandled(_: Request, exc: Exception):
    logging.getLogger("udaan").exception("Unhandled error")
    return JSONResponse(status_code=500, content={"detail": "Something went wrong. Please try again."})


@app.get("/", tags=["ops"])
def root():
    return {
        "status": "ok",
        "service": "Shivshristi Seva Sansthan API",
        "version": "1.0.0",
        "docs": "/api/docs" if not settings.is_production else None,
    }


@app.get("/api/health", tags=["ops"])
def health():
    return {"status": "ok"}


for r in (public.router, forms.router, donations.router, admin.router):
    app.include_router(r)
