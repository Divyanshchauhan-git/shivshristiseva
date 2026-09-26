import { useState, type FormEvent } from 'react';
import { formsApi } from '@/services/api';
import { email as emailRule } from '@/utils/validate';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/format';

export function NewsletterForm({ dark }: { dark?: boolean }) {
  const [value, setValue] = useState('');
  const [state, setState] = useState<{ s: 'idle' | 'busy' | 'ok' | 'err'; msg?: string }>({ s: 'idle' });
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const err = !value.trim() ? 'Enter your email address.' : emailRule(value, {});
    if (err) return setState({ s: 'err', msg: err });
    setState({ s: 'busy' });
    try { await formsApi.newsletter(value.trim()); setState({ s: 'ok', msg: 'You are subscribed. Look out for our next update in your inbox.' }); setValue(''); }
    catch (x) { setState({ s: 'err', msg: x instanceof Error ? x.message : 'Something went wrong. Please try again.' }); }
  };
  return (
    <form noValidate onSubmit={submit} className="w-full max-w-lg" aria-label="Newsletter sign-up">
      <label htmlFor="newsletter-email" className="sr-only">Email address</label>
      <div className={cn('flex flex-col gap-2 rounded-3xl p-1.5 sm:flex-row sm:rounded-full', dark ? 'bg-white/10 ring-1 ring-white/20' : 'bg-surface ring-1 ring-line')}>
        <input id="newsletter-email" type="email" inputMode="email" autoComplete="email" value={value} onChange={(e) => { setValue(e.target.value); if (state.s === 'err') setState({ s: 'idle' }); }}
          placeholder="you@example.com" aria-invalid={state.s === 'err' || undefined} aria-describedby="newsletter-msg"
          className={cn('h-12 min-w-0 flex-1 rounded-full bg-transparent px-5 text-[0.95rem] focus:outline-none', dark ? 'text-white placeholder:text-white/50' : 'text-fg placeholder:text-muted')} />
        <Button type="submit" variant="donate" size="lg" loading={state.s === 'busy'}>Subscribe</Button>
      </div>
      <p id="newsletter-msg" role={state.s === 'err' ? 'alert' : 'status'} className={cn('mt-2 min-h-5 px-2 text-sm', state.s === 'err' ? (dark ? 'text-[#ffb3a6]' : 'text-danger') : dark ? 'text-white/75' : 'text-muted')}>
        {state.msg ?? 'One email a month. Unsubscribe any time.'}
      </p>
    </form>
  );
}
