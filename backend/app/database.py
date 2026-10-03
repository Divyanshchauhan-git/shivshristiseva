import os
from collections.abc import Iterator
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker
from .config import get_settings

settings = get_settings()

db_url = settings.database_url
# On Vercel / AWS Lambda serverless, the deployment root directory is read-only.
# Local SQLite must write to /tmp to prevent "readonly database" operational errors.
if (os.environ.get("VERCEL") or os.environ.get("AWS_LAMBDA_FUNCTION_NAME")) and db_url.startswith("sqlite") and "/tmp" not in db_url:
    db_url = "sqlite:////tmp/dev.db"

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
