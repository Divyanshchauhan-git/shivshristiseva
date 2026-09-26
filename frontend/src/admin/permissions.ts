import type { Role } from '@/data/admin';

/** Mirrors backend/app/auth/permissions.py. The server is the authority; the UI only hides what a role can't use. */
export type Permission =
  | 'dashboard:view'
  | 'donations:read' | 'donations:export' | 'donations:refund'
  | 'campaigns:write' | 'programmes:write' | 'stories:write' | 'stories:publish' | 'events:write' | 'gallery:write'
  | 'animals:write' | 'impact:write' | 'documents:write'
  | 'volunteers:manage' | 'csr:manage' | 'messages:read'
  | 'reports:read' | 'users:manage' | 'settings:manage' | 'audit:read';

const content: Permission[] = ['campaigns:write', 'programmes:write', 'stories:write', 'stories:publish', 'events:write', 'gallery:write', 'animals:write', 'impact:write', 'documents:write'];

export const rolePermissions: Record<Role, Permission[]> = {
  super_admin: ['dashboard:view', 'donations:read', 'donations:export', 'donations:refund', ...content, 'volunteers:manage', 'csr:manage', 'messages:read', 'reports:read', 'users:manage', 'settings:manage', 'audit:read'],
  admin: ['dashboard:view', 'donations:read', 'donations:export', ...content, 'volunteers:manage', 'csr:manage', 'messages:read', 'reports:read', 'audit:read'],
  finance: ['dashboard:view', 'donations:read', 'donations:export', 'donations:refund', 'csr:manage', 'reports:read', 'documents:write'],
  content_manager: ['dashboard:view', 'campaigns:write', 'programmes:write', 'stories:write', 'stories:publish', 'events:write', 'gallery:write', 'animals:write', 'impact:write', 'messages:read'],
  volunteer_coordinator: ['dashboard:view', 'volunteers:manage', 'events:write', 'animals:write', 'messages:read'],
};

export const roleLabel: Record<Role, string> = {
  super_admin: 'Super Admin', admin: 'Admin', finance: 'Finance', content_manager: 'Content Manager', volunteer_coordinator: 'Volunteer Coordinator',
};

export const can = (role: Role | undefined, p: Permission) => !!role && rolePermissions[role].includes(p);
