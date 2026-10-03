import os
from collections.abc import Iterator
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker
from .config import get_settings

settings = get_settings()

def _resolve_db_url(url: str) -> str:
    if url.startswith("sqlite") and "/tmp" not in url:
        if os.environ.get("VERCEL") or os.environ.get("AWS_LAMBDA_FUNCTION_NAME") or not os.access(".", os.W_OK):
            return "sqlite:////tmp/dev.db"
    return url

db_url = _resolve_db_url(settings.database_url)

engine = create_engine(
    db_url,
    pool_pre_ping=True,
    **({"connect_args": {"check_same_thread": False}} if db_url.startswith("sqlite") else {"pool_size": 10, "max_overflow": 20}),
)
SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


def get_db() -> Iterator[Session]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
