import uuid
from collections.abc import Callable

import jwt
from fastapi import Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User
from .permissions import has_permission
from .security import ACCESS_COOKIE, decode_token


def current_user(request: Request, db: Session = Depends(get_db)) -> User:
    token = request.cookies.get(ACCESS_COOKIE)
    if not token:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Not signed in")
    try:
        data = decode_token(token, "access")
    except jwt.PyJWTError:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Session expired")
    user = db.get(User, uuid.UUID(data["sub"]))
    if not user or not user.is_active or user.token_version != data.get("ver"):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Session no longer valid")
    return user


def require(permission: str) -> Callable[[User], User]:
    """Route dependency: `user = Depends(require("donations:read"))`."""
    def checker(user: User = Depends(current_user)) -> User:
        if not has_permission(user.role, permission):
            raise HTTPException(status.HTTP_403_FORBIDDEN, "You don't have permission to do this")
        return user
    return checker
