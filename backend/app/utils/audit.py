from fastapi import Request
from sqlalchemy.orm import Session

from ..models import AuditLog, User


def audit(db: Session, request: Request | None, user: User | None, action: str, entity_type: str, entity_id: str | None = None, changes: dict | None = None) -> None:
    """Append-only audit trail. Never store secrets or full card/PAN values in `changes`."""
    db.add(AuditLog(
        actor_id=user.id if user else None, actor_email=user.email if user else "system", action=action,
        entity_type=entity_type, entity_id=entity_id, changes=changes,
        ip=(request.client.host if request and request.client else None),
    ))
