import { Suspense, useEffect, useState, type ReactNode } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart3, Building2, CalendarDays, ExternalLink, FileText, FolderKanban, HandCoins, Image, LayoutDashboard, LogOut, Mail, Megaphone,
  Menu, NotebookPen, PawPrint, Settings, ShieldCheck, Users, UserCog, X, FlaskConical,
} from 'lucide-react';
import { LogoMark } from '@/components/layout/Logo';
import { brand } from '@/config/brand';
import { isMockApi } from '@/services/api';
import { LoadingBlock } from '@/components/ui/States';
import { cn } from '@/utils/format';
import { useAuth } from './auth';
import { roleLabel, type Permission } from './permissions';
import { useAdminData } from './store';

export const adminNav: { label: string; to: string; icon: typeof LayoutDashboard; perm: Permission; badge?: 'volunteers' | 'messages' | 'partnerships' }[] = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, perm: 'dashboard:view' },
  { label: 'Donations', to: '/admin/donations', icon: HandCoins, perm: 'donations:read' },
  { label: 'Campaigns', to: '/admin/campaigns', icon: Megaphone, perm: 'campaigns:write' },
  { label: 'Programmes', to: '/admin/programmes', icon: FolderKanban, perm: 'programmes:write' },
  { label: 'Volunteers', to: '/admin/volunteers', icon: Users, perm: 'volunteers:manage', badge: 'volunteers' },
  { label: 'Stories', to: '/admin/stories', icon: NotebookPen, perm: 'stories:write' },
  { label: 'Events', to: '/admin/events', icon: CalendarDays, perm: 'events:write' },
  { label: 'Gallery', to: '/admin/gallery', icon: Image, perm: 'gallery:write' },
  { label: 'Animal Welfare', to: '/admin/animals', icon: PawPrint, perm: 'animals:write' },
  { label: 'Impact', to: '/admin/impact', icon: BarChart3, perm: 'impact:write' },
  { label: 'CSR / Partners', to: '/admin/csr', icon: Building2, perm: 'csr:manage', badge: 'partnerships' },
  { label: 'Contact Messages', to: '/admin/messages', icon: Mail, perm: 'messages:read', badge: 'messages' },
  { label: 'Reports', to: '/admin/reports', icon: FileText, perm: 'reports:read' },
  { label: 'Documents', to: '/admin/documents', icon: ShieldCheck, perm: 'documents:write' },
  { label: 'Users', to: '/admin/users', icon: UserCog, perm: 'users:manage' },
  { label: 'Settings', to: '/admin/settings', icon: Settings, perm: 'settings:manage' },
];

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { can } = useAuth();
  const data = useAdminData();
  const counts = {
    volunteers: data.volunteers.filter((v) => v.status === 'New').length,
    messages: data.messages.filter((m) => m.status === 'New').length,
    partnerships: data.partnerships.filter((p) => p.status === 'New').length,
  };
  return (
    <nav aria-label="Admin" className="flex h-full flex-col">
      <Link to="/admin" onClick={onNavigate} className="flex items-center gap-2.5 px-5 py-5">
        <LogoMark className="h-9 w-9" />
        <span className="leading-tight"><span className="block font-display text-lg text-white">{brand.shortName}</span><span className="block text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white/50">Admin console</span></span>
      </Link>
      <ul className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-4">
        {adminNav.filter((n) => can(n.perm)).map(({ label, to, icon: I, badge }) => (
          <li key={to}>
            <NavLink to={to} end={to === '/admin'} onClick={onNavigate}
              className={({ isActive }) => cn('flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors', isActive ? 'bg-white/15 text-white shadow-[inset_3px_0_0_#EFA23A]' : 'text-white/70 hover:bg-white/5 hover:text-white')}>
              <I className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
              <span className="flex-1">{label}</span>
              {badge && counts[badge] > 0 && <span className="rounded-full bg-[#EFA23A] px-2 text-xs font-semibold text-[#211a08] tabular" aria-label={`${counts[badge]} new`}>{counts[badge]}</span>}
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="border-t border-white/10 p-3">
        <Link to="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white"><ExternalLink className="h-[18px] w-[18px]" aria-hidden="true" />View public site</Link>
      </div>
    </nav>
  );
}

export function AdminLayout() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => { document.title = `Admin · ${brand.name}`; let m = document.querySelector<HTMLMetaElement>('meta[name="robots"]'); if (!m) { m = document.createElement('meta'); m.name = 'robots'; document.head.appendChild(m); } m.content = 'noindex, nofollow'; }, [pathname]);
  if (!user) return null;
  return (
    <div className="min-h-screen bg-bg lg:grid lg:grid-cols-[16.5rem_1fr]">
      <aside className="hidden bg-[#0A2A2F] lg:sticky lg:top-0 lg:block lg:h-screen">
        <Sidebar />
      </aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Admin menu">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} aria-hidden="true" />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-[#0A2A2F] animate-rise [animation-duration:.2s]">
            <button onClick={() => setOpen(false)} className="absolute right-3 top-4 grid h-10 w-10 place-items-center rounded-full text-white/70 hover:bg-white/10" aria-label="Close menu"><X className="h-5 w-5" /></button>
            <Sidebar onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}
      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-line bg-surface/90 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-2">
            <button onClick={() => setOpen(true)} className="grid h-10 w-10 place-items-center rounded-xl border border-line lg:hidden" aria-label="Open admin menu"><Menu className="h-5 w-5" /></button>
            {isMockApi && <span className="hidden items-center gap-1.5 rounded-full bg-marigold-soft px-3 py-1 text-xs font-semibold text-warn sm:inline-flex"><FlaskConical className="h-3.5 w-3.5" aria-hidden="true" />Demo data · changes reset on reload</span>}
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right leading-tight"><p className="text-sm font-semibold">{user.name}</p><p className="text-xs text-muted">{roleLabel[user.role]}</p></div>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-brand text-sm font-semibold text-brand-fg" aria-hidden="true">{user.name[0]}</span>
            <button onClick={() => { logout(); navigate('/admin/login'); }} className="grid h-10 w-10 place-items-center rounded-xl border border-line text-muted hover:text-fg" aria-label="Sign out" title="Sign out"><LogOut className="h-[18px] w-[18px]" /></button>
          </div>
        </header>
        <main id="admin-main" className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Suspense fallback={<LoadingBlock />}><Outlet /></Suspense>
        </main>
      </div>
    </div>
  );
}

export function AdminHeader({ title, text, actions }: { title: string; text?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div><h1 className="text-3xl">{title}</h1>{text && <p className="mt-1 text-muted">{text}</p>}</div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function DashboardCard({ label, value, hint, icon: I, tone = 'brand', children }: { label: string; value: ReactNode; hint?: ReactNode; icon: typeof LayoutDashboard; tone?: 'brand' | 'marigold' | 'leaf' | 'hibiscus'; children?: ReactNode }) {
  const t = { brand: 'bg-brand-soft text-brand-text', marigold: 'bg-marigold-soft text-warn', leaf: 'bg-leaf-soft text-leaf', hibiscus: 'bg-hibiscus-soft text-hibiscus' }[tone];
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted">{label}</p>
        <span className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-xl', t)}><I className="h-[18px] w-[18px]" aria-hidden="true" /></span>
      </div>
      <p className="mt-2 font-display text-3xl tabular">{value}</p>
      <div className="mt-1 flex items-end justify-between gap-2">{hint && <p className="text-xs text-muted">{hint}</p>}{children}</div>
    </div>
  );
}

export function Forbidden() {
  return (
    <div className="card mx-auto max-w-lg p-10 text-center">
      <ShieldCheck className="mx-auto h-10 w-10 text-muted" aria-hidden="true" />
      <h1 className="mt-4 text-2xl">You don&rsquo;t have access to this area</h1>
      <p className="mt-2 text-muted">Your role doesn&rsquo;t include this permission. Ask a Super Admin if you need access.</p>
      <Link to="/admin" className="link mt-4 inline-block">Back to dashboard</Link>
    </div>
  );
}
