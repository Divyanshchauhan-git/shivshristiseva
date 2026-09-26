import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Lock, LogIn } from 'lucide-react';
import { useAuth } from '../auth';
import { roleLabel } from '../permissions';
import { demoUsers, DEMO_PASSWORD } from '@/data/admin';
import { isMockApi } from '@/services/api';
import { TextField } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Logo } from '@/components/layout/Logo';
import { Scene } from '@/components/media/Scene';
import { email as emailRule } from '@/utils/validate';

export default function Login() {
  const { user, login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation() as { state?: { from?: string } };
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [fieldErr, setFieldErr] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  if (user) return <Navigate to={loc.state?.from ?? '/admin'} replace />;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const fe: Record<string, string> = {};
    if (!email.trim()) fe.email = 'Email is required.'; else { const m = emailRule(email, {}); if (m) fe.email = m; }
    if (!password) fe.password = 'Password is required.';
    setFieldErr(fe); if (Object.keys(fe).length) return;
    setBusy(true); setErr(null);
    try { await login(email, password); nav(loc.state?.from ?? '/admin', { replace: true }); }
    catch (x) { setErr(x instanceof Error ? x.message : 'Sign-in failed.'); }
    finally { setBusy(false); }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-[#0F3D44] lg:block">
        <Scene theme="community" seed={77} className="absolute inset-0 h-full w-full opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F3D44] via-[#0F3D44]/40 to-transparent" />
        <div className="absolute bottom-0 p-12 text-white">
          <h2 className="max-w-md text-4xl text-white">Run programmes, campaigns and volunteers from one place.</h2>
          <p className="mt-3 max-w-md text-white/75">Access is limited by role. Every change is recorded in the audit log.</p>
        </div>
      </div>
      <div className="flex flex-col justify-center px-4 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-sm">
          <Logo />
          <h1 className="mt-10 text-3xl">Staff sign in</h1>
          <p className="mt-1 text-muted">Use your organisation account.</p>
          <form noValidate onSubmit={submit} className="mt-8 space-y-4">
            <TextField label="Email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} error={fieldErr.email} />
            <TextField label="Password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} error={fieldErr.password} />
            {err && <Alert tone="error">{err}</Alert>}
            <Button type="submit" size="lg" className="w-full" loading={busy} icon={<LogIn className="h-4 w-4" />}>Sign in</Button>
            <p className="flex items-center gap-1.5 text-xs text-muted"><Lock className="h-3.5 w-3.5" aria-hidden="true" />Protected by rate limiting and optional two-factor authentication.</p>
          </form>
          {isMockApi && (
            <div className="mt-8 rounded-2xl border border-dashed border-warn/50 bg-marigold-soft/50 p-4 text-sm">
              <p className="font-semibold">Demo accounts</p>
              <p className="mt-1 text-xs text-muted">Password for all: <code className="font-mono">{DEMO_PASSWORD}</code>. Pick a role to see its permissions.</p>
              <ul className="mt-3 space-y-1.5">
                {demoUsers.map((u) => (
                  <li key={u.id}>
                    <button type="button" onClick={() => { setEmail(u.email); setPassword(DEMO_PASSWORD); }} className="flex w-full items-center justify-between rounded-lg bg-surface px-3 py-2 text-left hover:ring-1 hover:ring-brand-text/40">
                      <span className="font-medium">{roleLabel[u.role]}</span><span className="font-mono text-xs text-muted">{u.email}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
