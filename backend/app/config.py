from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """All configuration comes from environment variables (or a local .env). No secrets in code."""
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_env: str = "development"
    site_url: str = "http://localhost:5173"
    cors_origins: str = "https://shivshristiseva-ziif.vercel.app,http://localhost:5173,http://localhost:3000"
    database_url: str = "sqlite:///./dev.db"

    jwt_secret: str = "dev-only-change-me"
    access_token_minutes: int = 30
    refresh_token_days: int = 7

    payment_gateway: str = "razorpay"
    payment_key_id: str = ""
    payment_key_secret: str = ""
    payment_webhook_secret: str = ""

    storage_bucket: str = ""
    storage_public_base_url: str = ""
    storage_endpoint_url: str | None = None
    aws_region: str = "ap-south-1"

    smtp_host: str = ""
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    mail_from: str = "Shivshristi Seva Sansthan <no-reply@example.org>"

    @property
    def is_production(self) -> bool:
        return self.app_env == "production"

    @property
    def cors_list(self) -> list[str]:
        origins = [o.strip() for o in self.cors_origins.split(",") if o.strip()]
        deployed_frontend = "https://shivshristiseva-ziif.vercel.app"
        if deployed_frontend not in origins:
            origins.append(deployed_frontend)
        return origins


@lru_cache
def get_settings() -> Settings:
    s = Settings()
    if s.is_production and (s.jwt_secret.startswith("dev") or s.jwt_secret == "change-me" or len(s.jwt_secret) < 32):
        raise RuntimeError("JWT_SECRET must be a long random value in production")
    return s
