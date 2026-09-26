import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { demoUsers, DEMO_PASSWORD, type AdminUser } from '@/data/admin';
import { isMockApi, ApiError } from '@/services/api';
import { safeSession } from '@/utils/storage';
import { can, type Permission } from './permissions';

/**
 * Admin authentication.
 * Real mode: POST /api/admin/login sets an httpOnly, Secure, SameSite=Strict session
 * cookie (access + rotating refresh token); GET /api/admin/me returns the user and role.
 * Tokens are never stored in JS-readable storage.
 * Demo mode: accepts the listed demo accounts and keeps the session in sessionStorage.
 */
interface AuthCtx { user: AdminUser | null; login: (email: string, password: string, otp?: string) => Promise<void>; logout: () => void; can: (p: Permission) => boolean }
const Ctx = createContext<AuthCtx | null>(null);
const KEY = 'usf.admin.session';
const BASE = ((import.meta.env.VITE_API_BASE_URL as string | undefined) || '').replace(/\/$/, '');

function restore(): AdminUser | null {
  if (!isMockApi) return null;
  try { const raw = safeSession.get(KEY); if (!raw) return null; const s = JSON.parse(raw); return s.exp > Date.now() ? s.user : null; } catch { return null; }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(restore);
  const login = useCallback(async (email: string, password: string, otp?: string) => {
    if (!isMockApi) {
      const res = await fetch(`${BASE}/api/admin/login`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password, otp }) });
      if (!res.ok) throw new ApiError(res.status === 429 ? 'Too many attempts. Try again in a few minutes.' : 'Email or password is incorrect.', res.status);
      const me = await fetch(`${BASE}/api/admin/me`, { credentials: 'include' }).then((r) => r.json());
      setUser(me); return;
    }
    await new Promise((r) => setTimeout(r, 600));
    const u = demoUsers.find((x) => x.email.toLowerCase() === email.trim().toLowerCase());
    if (!u || password !== DEMO_PASSWORD) throw new ApiError('Email or password is incorrect.', 401);
    safeSession.set(KEY, JSON.stringify({ user: u, exp: Date.now() + 1000 * 60 * 60 * 8 }));
    setUser(u);
  }, []);
  const logout = useCallback(() => {
    if (!isMockApi) fetch(`${BASE}/api/admin/logout`, { method: 'POST', credentials: 'include' }).catch(() => {});
    safeSession.remove(KEY); setUser(null);
  }, []);
  return <Ctx.Provider value={{ user, login, logout, can: (p) => can(user?.role, p) }}>{children}</Ctx.Provider>;
}

export const useAuth = () => { const c = useContext(Ctx); if (!c) throw new Error('useAuth outside AuthProvider'); return c; };

/** Redirects unauthenticated visitors to /admin/login, preserving where they were going. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const loc = useLocation();
  if (!user) return <Navigate to="/admin/login" replace state={{ from: loc.pathname }} />;
  return <>{children}</>;
}
