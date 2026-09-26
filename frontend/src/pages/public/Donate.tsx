import { useEffect, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, Clock, Heart, Mail, RefreshCw, XCircle, Ban, Receipt, ShieldCheck } from 'lucide-react';
import { useSeo } from '@/hooks/useSeo';
import { donationApi, isMockApi } from '@/services/api';
import type { DonationStatusResponse } from '@/types';
import { DonationForm } from '@/components/forms/DonationForm';
import { ButtonLink, Button } from '@/components/ui/Button';
import { LoadingBlock, ErrorState } from '@/components/ui/States';
import { Scene } from '@/components/media/Scene';
import { fmtDateTime, inr } from '@/utils/format';
import { brand } from '@/config/brand';

import { TrustStrip } from '@/components/layout/TrustStrip';

export function Donate() {
  useSeo({ title: 'Donate Securely · 80G Tax Exemption', description: `Donate securely to ${brand.name} with UPI, cards or net banking. All contributions eligible for 50% Tax Relief under Section 80G.`, path: '/donate' });
  const [params] = useSearchParams();
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-r from-[#072427] via-[#0B3B3E] to-[#0A3338] text-white">
        <div className="absolute inset-0 opacity-25" aria-hidden="true">
          <img src="/images/hero_community.jpg" alt="" className="h-full w-full object-cover object-center" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#072427] via-transparent to-transparent" />
        <div className="container-page relative py-12 sm:py-16 z-10">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-300 ring-1 ring-amber-400/30">
              ✓ 80G Tax Exemption (50% Tax Savings)
            </span>
            <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 ring-1 ring-emerald-400/30">
              ✓ Instant Receipt Generated
            </span>
          </div>
          <h1 className="mt-2 max-w-2xl text-4xl text-white sm:text-5xl tracking-tight">Your compassion changes lives &amp; protects the voiceless.</h1>
          <p className="mt-3 max-w-xl text-white/85 text-lg">Select a cause or support our general welfare mission. 100% secure payment through UPI, RuPay, Cards &amp; Net Banking.</p>
        </div>
      </section>
      <TrustStrip />
      <section className="relative pb-20">
        <div className="container-page">
          <DonationForm initialCampaign={params.get('campaign') ?? undefined} initialCause={params.get('cause') ?? undefined} initialAmount={Number(params.get('amount')) || undefined} />
          <div className="mt-10 grid gap-4 text-sm text-muted md:grid-cols-3">
            <p><strong className="text-fg">Instant 80G Receipts.</strong> An email confirmation and official 80G tax deduction receipt are sent as soon as your payment is confirmed.</p>
            <p><strong className="text-fg">Monthly Giving.</strong> Easily pause or cancel any time from your UPI app (Google Pay, PhonePe, Paytm) or by <Link to="/contact" className="link">contacting us</Link>.</p>
            <p><strong className="text-fg">Complete Transparency.</strong> Read our <Link to="/faq" className="link">donation FAQ</Link> and verify our <Link to="/transparency" className="link">audited accounts</Link>.</p>
          </div>
        </div>
      </section>
    </>
  );
}

const view = {
  success: { icon: CheckCircle2, tone: 'bg-ok', title: 'Thank you for your donation', text: 'Your payment was successful. A confirmation email is on its way.' },
  pending: { icon: Clock, tone: 'bg-warn', title: 'Your donation is being processed', text: 'Your bank has not confirmed the payment yet. This usually takes a few minutes. We will email you once it is confirmed.' },
  created: { icon: Clock, tone: 'bg-warn', title: 'Your donation is being processed', text: 'We are waiting for confirmation from the payment gateway.' },
  failed: { icon: XCircle, tone: 'bg-danger', title: 'The payment did not go through', text: 'No donation was recorded. If money was debited, your bank will usually reverse it within a few working days.' },
  cancelled: { icon: Ban, tone: 'bg-muted', title: 'Payment cancelled', text: 'You closed the payment page before completing it. No money was taken.' },
  refunded: { icon: AlertTriangle, tone: 'bg-muted', title: 'This donation was refunded', text: 'The amount has been returned to your original payment method.' },
} as const;

export function DonationStatus() {
  const { id = '' } = useParams();
  useSeo({ title: 'Donation status', noindex: true });
  const [d, setD] = useState<DonationStatusResponse | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const tries = useRef(0);

  const load = () => { setErr(null); donationApi.status(id).then(setD, (e: Error) => setErr(e.message)); };
  useEffect(load, [id]);
  // Poll while pending: the webhook, not the browser, is the source of truth.
  useEffect(() => {
    if (!d || !(d.status === 'pending' || d.status === 'created') || tries.current > 10 || isMockApi) return;
    const t = setTimeout(() => { tries.current += 1; load(); }, 4000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d]);

  if (err) return <div className="container-page py-16"><ErrorState message={err} onRetry={load} /></div>;
  if (!d) return <div className="container-page max-w-2xl py-16"><LoadingBlock label="Checking your donation" /><p className="text-center text-muted">Your donation is being processed…</p></div>;
  const v = view[d.status];
  const I = v.icon;
  const retry = `/donate${d.cause && d.cause !== 'General Fund' ? `?cause=${encodeURIComponent(d.cause)}` : ''}`;
  return (
    <section className="container-page max-w-3xl py-12 sm:py-16">
      <div className="overflow-hidden rounded-[2rem] border border-line bg-surface shadow-lift">
        <div className="relative h-36 overflow-hidden" aria-hidden="true"><Scene theme={d.status === 'success' ? 'volunteer' : 'community'} seed={9} className="h-full w-full" /></div>
        <div className="-mt-10 px-6 pb-8 text-center sm:px-10">
          <span className={`relative mx-auto grid h-20 w-20 place-items-center rounded-full border-[6px] border-surface text-white ${v.tone}`}><I className="h-9 w-9" aria-hidden="true" /></span>
          <h1 className="mt-4 text-3xl sm:text-4xl" tabIndex={-1}>{v.title}{d.status === 'success' && d.donorName !== 'Anonymous donor' ? `, ${d.donorName.split(' ')[0]}` : ''}</h1>
          <p className="mx-auto mt-3 max-w-md text-muted" role="status">{v.text}</p>

          <dl className="mx-auto mt-8 grid max-w-lg gap-px overflow-hidden rounded-2xl border border-line bg-line text-left text-sm sm:grid-cols-2">
            {[
              ['Donation reference', <span className="select-all font-mono">{d.reference}</span>],
              ['Payment status', <span className="capitalize">{d.status}</span>],
              ['Amount', <span className="tabular">{inr(d.amount)}{d.frequency === 'monthly' ? ' / month' : ''}</span>],
              ['Cause', d.cause],
              ['Date', fmtDateTime(d.createdAt)],
              ['Receipt', d.receiptNumber ? <span className="font-mono">{d.receiptNumber}</span> : d.status === 'success' ? 'Being generated' : 'Not applicable'],
            ].map(([k, val]) => (
              <div key={k as string} className="bg-surface p-4"><dt className="text-xs text-muted">{k}</dt><dd className="mt-0.5 font-semibold">{val}</dd></div>
            ))}
          </dl>

          {d.status === 'success' && (
            <div className="mx-auto mt-6 flex max-w-lg flex-col gap-2 rounded-2xl bg-leaf-soft/60 p-4 text-left text-sm">
              <p className="flex gap-2"><Mail className="h-4 w-4 shrink-0 text-ok" aria-hidden="true" />Confirmation sent to <strong className="break-all">{d.donorEmail}</strong></p>
              <p className="flex gap-2"><Receipt className="h-4 w-4 shrink-0 text-ok" aria-hidden="true" />Your receipt will be attached to the email as a PDF.</p>
            </div>
          )}
          {isMockApi && <p className="mt-4 text-xs text-muted">Demo mode: no payment was taken and no email was sent.</p>}

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            {d.status === 'success' && <><ButtonLink to="/stories" variant="secondary">See stories of change</ButtonLink><ButtonLink to="/volunteer" icon={<Heart className="h-4 w-4" />}>Volunteer with us</ButtonLink></>}
            {(d.status === 'failed' || d.status === 'cancelled') && <><ButtonLink to={retry} variant="donate" icon={<RefreshCw className="h-4 w-4" />}>Try again</ButtonLink><ButtonLink to="/contact" variant="secondary">Contact us</ButtonLink></>}
            {(d.status === 'pending' || d.status === 'created') && <><Button variant="secondary" onClick={load} icon={<RefreshCw className="h-4 w-4" />}>Check again</Button><ButtonLink to="/">Back to home</ButtonLink></>}
          </div>
          <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted"><ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />Keep your reference for any questions about this donation.</p>
        </div>
      </div>
    </section>
  );
}
