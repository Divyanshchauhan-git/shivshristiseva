"""Create tables (dev only; use Alembic in production) and a first Super Admin.
Usage: python -m app.seed --email you@org.in --name "Your Name"   (password is prompted, never passed on the command line)"""
import argparse
import getpass

from .database import Base, SessionLocal, engine
from .models import Role, User
from .auth.security import hash_password


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--email", required=True)
    ap.add_argument("--name", required=True)
    a = ap.parse_args()
    Base.metadata.create_all(engine)
    pw = getpass.getpass("Password (min 12 chars): ")
    if len(pw) < 12:
        raise SystemExit("Password too short")
    with SessionLocal() as db:
        db.add(User(email=a.email.lower(), name=a.name, role=Role.super_admin, password_hash=hash_password(pw)))
        db.commit()
    print("Super Admin created.")


if __name__ == "__main__":
    main()
