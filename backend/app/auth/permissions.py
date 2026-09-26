"""Role → permission map. Mirrors frontend/src/admin/permissions.ts; the server is the authority."""
from ..models import Role

CONTENT = {"campaigns:write", "programmes:write", "stories:write", "stories:publish", "events:write", "gallery:write", "animals:write", "impact:write", "documents:write"}

ROLE_PERMISSIONS: dict[Role, set[str]] = {
    Role.super_admin: {"dashboard:view", "donations:read", "donations:export", "donations:refund", *CONTENT, "volunteers:manage", "csr:manage",
                       "messages:read", "reports:read", "users:manage", "settings:manage", "audit:read"},
    Role.admin: {"dashboard:view", "donations:read", "donations:export", *CONTENT, "volunteers:manage", "csr:manage", "messages:read", "reports:read", "audit:read"},
    Role.finance: {"dashboard:view", "donations:read", "donations:export", "donations:refund", "csr:manage", "reports:read", "documents:write"},
    Role.content_manager: {"dashboard:view", *(CONTENT - {"documents:write"}), "messages:read"},
    Role.volunteer_coordinator: {"dashboard:view", "volunteers:manage", "events:write", "animals:write", "messages:read"},
}


def has_permission(role: Role, permission: str) -> bool:
    return permission in ROLE_PERMISSIONS.get(role, set())
