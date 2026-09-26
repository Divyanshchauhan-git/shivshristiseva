import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Building2, CreditCard, Heart, Lock, ShieldCheck, Smartphone, Wallet } from 'lucide-react';
import type { DonationFrequency, DonationRequest, PaymentMethod } from '@/types';
import { campaigns } from '@/data/campaigns';
import { donationApi, isMockApi } from '@/services/api';
import { paymentGateway } from '@/services/payment';
import { email as emailRule, pan as panRule, phoneIN, pincode, required, validate, type Schema } from '@/utils/validate';
import { cn, inr } from '@/utils/format';
import { Button } from '@/components/ui/Button';
import { Checkbox, TextField, TextArea } from '@/components/ui/Field';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { DemoNote } from '@/components/ui/Section';
import { themeIcon } from '@/components/media/Icon';
import type { Theme } from '@/types';

export const causes: { id: string; label: string; theme: Theme; text: string }[] = [
  { id: 'General Fund', label: 'General Fund', theme: 'community', text: 'Where the need is greatest' },
  { id: 'Education', label: 'Child Education', theme: 'education', text: 'Kits, tuition, remedial centres' },
  { id: 'Women', label: 'Women Empowerment', theme: 'women', text: 'Vocational skills, SHGs & health' },
  { id: 'Healthcare', label: 'Healthcare & Camps', theme: 'health', text: 'Free medicine, screening camps' },
  { id: 'Food', label: 'Food & Nutrition', theme: 'food', text: 'Monthly dry rations for families' },
  { id: 'Animals', label: 'Animal Welfare', theme: 'animals', text: '24/7 rescue, shelter, feeding' },
  { id: 'Emergency Relief', label: 'Emergency Relief', theme: 'emergency', text: 'Disaster response' },
  { id: 'Environment', label: 'Environment', theme: 'environment', text: 'Trees and clean-ups' },
];

const presets = [500, 1000, 2500, 5000];
/** Example, NGO-defined impact statements. Replace with verified cost-per-unit data. */
const impactHint = (amount: number) =>
  amount >= 5000 ? 'could support a family’s essentials or an animal’s treatment course.'
    : amount >= 2500 ? 'could support skill-development activities for a trainee.'
      : amount >= 1000 ? 'could support essential healthcare or food assistance.'
        : amount >= 500 ? 'could support educational materials for a child.' : 'adds up with others to make a real difference.';

const methods: { id: PaymentMethod; label: string; text: string; icon: typeof Smartphone }[] = [
  { id: 'upi', label: 'UPI', text: 'GPay, PhonePe, Paytm, BHIM or any UPI app', icon: Smartphone },
  { id: 'card', label: 'Debit / credit card', text: 'Visa, Mastercard, RuPay', icon: CreditCard },
  { id: 'netbanking', label: 'Net banking', text: 'All major Indian banks', icon: Building2 },
  { id: 'wallet', label: 'Wallets & others', text: 'Supported wallets on the gateway', icon: Wallet },
];

const STEPS = ['Cause', 'Amount', 'Your details', 'Payment'] as const;
const MIN = 100, MAX = 1000000;

export function DonationForm({ initialCampaign, initialCause, initialAmount }: { initialCampaign?: string; initialCause?: string; initialAmount?: number }) {
  const navigate = useNavigate();
  const campaign = campaigns.find((c) => c.slug === initialCampaign && c.status === 'active');
  const [step, setStep] = useState(0);
  const [cause, setCause] = useState(campaign ? campaign.category : initialCause && causes.some((c) => c.id === initialCause) ? initialCause : 'General Fund');
  const [campaignSlug, setCampaignSlug] = useState<string | undefined>(campaign?.slug);
  const startAmt = initialAmount && initialAmount >= MIN && initialAmount <= MAX ? Math.round(initialAmount) : 1000;
  const [amount, setAmount] = useState<number>(presets.includes(startAmt) ? startAmt : 1000);
  const [custom, setCustom] = useState(presets.includes(startAmt) ? '' : String(startAmt));
  const [frequency, setFrequency] = useState<DonationFrequency>('one-time');
  const [method, setMethod] = useState<PaymentMethod>('upi');
  const [donor, setDonor] = useState({ name: '', email: '', phone: '', pan: '', address: '', city: '', state: '', pincode: '', wants80G: false, anonymous: false });
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  useEffect(() => { if (step > 0) document.getElementById('donate-step-title')?.focus(); }, [step]);

  const effectiveAmount = custom ? Number(custom) : amount;
  const causeLabel = campaignSlug ? campaigns.find((c) => c.slug === campaignSlug)?.title ?? cause : cause;

  const donorSchema = useMemo<Schema>(() => ({
    name: [required('Full name')], email: [required('Email'), emailRule], phone: [required('Mobile number'), phoneIN],
    ...(donor.wants80G ? { pan: [required('PAN'), panRule], address: [required('Address')], city: [required('City')], state: [required('State')], pincode: [required('PIN code'), pincode] } : {}),
  }), [donor.wants80G]);

  const validateStep = (s: number) => {
    let e: Record<string, string> = {};
    if (s === 1) {
      if (!Number.isFinite(effectiveAmount) || effectiveAmount < MIN) e.amount = `The minimum donation is ${inr(MIN)}.`;
      else if (effectiveAmount > MAX) e.amount = `For donations above ${inr(MAX)}, please contact us so we can help with a bank transfer.`;
      else if (!Number.isInteger(effectiveAmount)) e.amount = 'Enter a whole rupee amount.';
    }
    if (s === 2) e = validate(donor, donorSchema);
    if (s === 3 && !consent) e.consent = 'Please confirm to continue.';
    setErrors(e);
    if (Object.keys(e).length) requestAnimationFrame(() => document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
    return Object.keys(e).length === 0;
  };
  const next = () => { if (validateStep(step)) setStep((s) => Math.min(3, s + 1)); };
  const back = () => { setErrors({}); setStep((s) => Math.max(0, s - 1)); };
  const setD = (k: keyof typeof donor, v: string | boolean) => { setDonor((d) => ({ ...d, [k]: v })); setErrors((e) => { const n = { ...e }; delete n[k]; return n; }); };

  const pay = async (ev: FormEvent) => {
    ev.preventDefault();
    if (step < 3) return next();
    if (!validateStep(3)) return;
    setBusy(true); setPayError(null);
    const req: DonationRequest = {
      cause, campaignSlug, amount: effectiveAmount, frequency, method, consent,
      donor: { ...donor, pan: donor.wants80G ? donor.pan.toUpperCase() : undefined, address: donor.wants80G ? donor.address : undefined },
    };
    try {
      const order = await donationApi.createOrder(req);
      const result = await paymentGateway.open({ order, donor: { name: donor.name, email: donor.email, phone: donor.phone }, method, description: `${frequency === 'monthly' ? 'Monthly donation' : 'Donation'}: ${causeLabel}` });
      await donationApi.verify(order.donationId, result.payload, result.outcome);
      navigate(`/donate/status/${order.donationId}`);
    } catch (e) {
      setPayError(e instanceof Error ? e.message : 'We could not start the payment. Please try again.');
    } finally { setBusy(false); }
  };

  const CauseIcon = themeIcon[causes.find((c) => c.id === cause)?.theme ?? 'community'];

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      <form noValidate onSubmit={pay} className="rounded-3xl border border-line bg-surface p-5 shadow-soft sm:p-8" aria-label="Donation form">
        {/* Stepper */}
        <ol className="mb-8 grid grid-cols-4 gap-2" aria-label="Donation steps">
          {STEPS.map((s, i) => (
            <li key={s} aria-current={i === step ? 'step' : undefined}>
              <button type="button" disabled={i > step} onClick={() => i < step && setStep(i)} className="group w-full text-left disabled:cursor-default">
                <span className={cn('block h-1.5 rounded-full transition-colors', i <= step ? 'bg-marigold' : 'bg-surface-2')} />
                <span className={cn('mt-2 block text-xs font-semibold sm:text-sm', i === step ? 'text-fg' : i < step ? 'text-brand-text group-hover:underline' : 'text-muted')}>
                  <span className="tabular">{i + 1}.</span> <span className="hidden sm:inline">{s}</span><span className="sm:hidden">{s.split(' ')[0]}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>

        {step === 0 && (
          <fieldset>
            <legend id="donate-step-title" tabIndex={-1} className="font-display text-2xl outline-none sm:text-3xl">What would you like to support?</legend>
            {campaignSlug && (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-brand-soft/70 px-4 py-3 text-sm">
                <span>Giving to campaign: <strong>{causeLabel}</strong></span>
                <button type="button" className="font-semibold text-brand-text underline" onClick={() => setCampaignSlug(undefined)}>Choose a cause instead</button>
              </div>
            )}
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {causes.map((c) => {
                const I = themeIcon[c.theme]; const on = cause === c.id && !campaignSlug;
                return (
                  <label key={c.id} className={cn('relative flex cursor-pointer flex-col rounded-2xl border-2 p-3.5 transition-colors has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-marigold/40',
                    on ? 'border-brand bg-brand-soft/60' : 'border-line hover:border-brand-text/40')}>
                    <input type="radio" name="cause" value={c.id} checked={on} onChange={() => { setCause(c.id); setCampaignSlug(undefined); }} className="sr-only" />
                    <I className={cn('h-6 w-6', on ? 'text-brand-text' : 'text-muted')} aria-hidden="true" />
                    <span className="mt-2 text-sm font-semibold leading-tight">{c.label}</span>
                    <span className="mt-0.5 text-xs text-muted">{c.text}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        )}

        {step === 1 && (
          <div>
            <h2 id="donate-step-title" tabIndex={-1} className="text-2xl outline-none sm:text-3xl">How much would you like to give?</h2>
            <div role="radiogroup" aria-label="Donation frequency" className="mt-5 inline-grid grid-cols-2 rounded-full bg-surface-2 p-1">
              {(['one-time', 'monthly'] as const).map((f) => (
                <button key={f} type="button" role="radio" aria-checked={frequency === f} onClick={() => setFrequency(f)}
                  className={cn('rounded-full px-5 py-2 text-sm font-semibold transition-colors', frequency === f ? 'bg-surface text-fg shadow-soft' : 'text-muted hover:text-fg')}>
                  {f === 'one-time' ? 'One-time' : 'Monthly'}
                </button>
              ))}
            </div>
            <fieldset className="mt-5">
              <legend className="sr-only">Choose an amount</legend>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {presets.map((p) => {
                  const on = !custom && amount === p;
                  return (
                    <label key={p} className={cn('flex h-16 cursor-pointer items-center justify-center rounded-2xl border-2 font-display text-2xl tabular transition-colors has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-marigold/40',
                      on ? 'border-marigold bg-marigold-soft' : 'border-line hover:border-marigold/60')}>
                      <input type="radio" name="amount" className="sr-only" checked={on} onChange={() => { setAmount(p); setCustom(''); setErrors({}); }} />
                      {inr(p)}
                    </label>
                  );
                })}
              </div>
              <div className="mt-4">
                <TextField label="Or enter a custom amount (₹)" type="number" inputMode="numeric" min={MIN} max={MAX} step={1} placeholder="e.g. 1500" value={custom}
                  onChange={(e) => { setCustom(e.target.value.replace(/[^\d]/g, '')); setErrors({}); }} error={errors.amount} hint={`Minimum ${inr(MIN)}`} />
              </div>
            </fieldset>
            {effectiveAmount >= MIN && (
              <div className="mt-5 flex gap-3 rounded-2xl bg-leaf-soft/70 p-4">
                <Heart className="mt-0.5 h-5 w-5 shrink-0 fill-leaf text-leaf" aria-hidden="true" />
                <div>
                  <p className="text-sm"><strong className="tabular">{inr(effectiveAmount)}</strong>{frequency === 'monthly' ? ' every month' : ''} {impactHint(effectiveAmount)}</p>
                  <p className="mt-1 text-xs text-muted">Example only. Actual use depends on current needs and costs.</p>
                </div>
              </div>
            )}
            {frequency === 'monthly' && <p className="mt-4 text-sm text-muted">Monthly gifts use a UPI AutoPay mandate or card subscription. You can cancel any time from your UPI app or by contacting us.</p>}
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 id="donate-step-title" tabIndex={-1} className="text-2xl outline-none sm:text-3xl">Your details</h2>
            <p className="mt-1 text-sm text-muted">We need these to send your confirmation and receipt.</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <TextField label="Full name" autoComplete="name" value={donor.name} onChange={(e) => setD('name', e.target.value)} error={errors.name} className="sm:col-span-2" />
              <TextField label="Email" type="email" autoComplete="email" inputMode="email" value={donor.email} onChange={(e) => setD('email', e.target.value)} error={errors.email} />
              <TextField label="Mobile number" type="tel" autoComplete="tel" inputMode="tel" placeholder="+91" value={donor.phone} onChange={(e) => setD('phone', e.target.value)} error={errors.phone} />
            </div>
            <div className="mt-5 space-y-3 rounded-2xl border border-line p-4">
              <Checkbox checked={donor.wants80G} onChange={(v) => setD('wants80G', v)} label="I would like a tax exemption receipt"
                description="Needs your PAN and address, as required for tax receipts. [Replace with verified 80G details, if applicable.]" />
              {donor.wants80G && (
                <div className="grid gap-4 pt-2 sm:grid-cols-2 animate-rise">
                  <TextField label="PAN" autoComplete="off" value={donor.pan} onChange={(e) => setD('pan', e.target.value.toUpperCase())} error={errors.pan} maxLength={10} placeholder="ABCDE1234F" className="sm:col-span-2" />
                  <TextArea label="Address" autoComplete="street-address" rows={2} value={donor.address} onChange={(e) => setD('address', e.target.value)} error={errors.address} className="sm:col-span-2" />
                  <TextField label="City" autoComplete="address-level2" value={donor.city} onChange={(e) => setD('city', e.target.value)} error={errors.city} />
                  <TextField label="State" autoComplete="address-level1" value={donor.state} onChange={(e) => setD('state', e.target.value)} error={errors.state} />
                  <TextField label="PIN code" autoComplete="postal-code" inputMode="numeric" maxLength={6} value={donor.pincode} onChange={(e) => setD('pincode', e.target.value)} error={errors.pincode} />
                </div>
              )}
              <Checkbox checked={donor.anonymous} onChange={(v) => setD('anonymous', v)} label="Keep my name off public supporter lists" />
            </div>
          </div>
        )}

        {step === 3 && (
          <fieldset>
            <legend id="donate-step-title" tabIndex={-1} className="font-display text-2xl outline-none sm:text-3xl">Choose how to pay</legend>
            <p className="mt-1 text-sm text-muted">You will complete payment on our payment partner&rsquo;s secure page.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {methods.map((m) => {
                const on = method === m.id; const I = m.icon;
                return (
                  <label key={m.id} className={cn('flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-4 transition-colors has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-marigold/40', on ? 'border-brand bg-brand-soft/60' : 'border-line hover:border-brand-text/40')}>
                    <input type="radio" name="method" className="sr-only" checked={on} onChange={() => setMethod(m.id)} />
                    <span className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-xl', on ? 'bg-brand text-brand-fg' : 'bg-surface-2 text-muted')}><I className="h-5 w-5" aria-hidden="true" /></span>
                    <span><span className="block font-semibold">{m.label}</span><span className="block text-xs text-muted">{m.text}</span></span>
                  </label>
                );
              })}
            </div>
            <div className="mt-5">
              <Checkbox checked={consent} onChange={(v) => { setConsent(v); setErrors({}); }} error={errors.consent}
                label={<>I confirm these details are correct and agree to the Donation &amp; Refund Policy.</>} />
            </div>
            {payError && <Alert tone="error" title="Payment could not start" className="mt-4">{payError}</Alert>}
            {isMockApi && <DemoNote className="mt-4">Demo mode: a simulated gateway will open and no money will move. Connect the backend and a payment gateway to accept real donations.</DemoNote>}
          </fieldset>
        )}

        <div className="mt-8 flex items-center justify-between gap-3 border-t border-line pt-5">
          {step > 0 ? <Button variant="ghost" onClick={back} icon={<ArrowLeft className="h-4 w-4" />}>Back</Button> : <span />}
          {step < 3 ? (
            <Button type="submit" size="lg" className="min-w-[9rem]">Continue <ArrowRight className="h-4 w-4" aria-hidden="true" /></Button>
          ) : (
            <Button type="submit" variant="donate" size="lg" loading={busy} icon={!busy && <Lock className="h-4 w-4" />}>
              Donate {inr(effectiveAmount || 0)}{frequency === 'monthly' ? '/mo' : ''}
            </Button>
          )}
        </div>
      </form>

      {/* Summary */}
      <aside className="lg:sticky lg:top-24 lg:self-start" aria-label="Donation summary">
        <div className="overflow-hidden rounded-3xl bg-[#0F3D44] text-white shadow-lift">
          <div className="p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#F4B154]">Your gift</p>
            <p className="mt-2 font-display text-5xl tabular">{effectiveAmount >= MIN ? inr(effectiveAmount) : '—'}</p>
            <p className="mt-1 text-white/70">{frequency === 'monthly' ? 'Every month' : 'One-time donation'}</p>
            <div className="mt-5 flex items-center gap-3 rounded-2xl bg-white/10 p-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#EFA23A] text-[#211a08]"><CauseIcon className="h-5 w-5" aria-hidden="true" /></span>
              <span className="min-w-0"><span className="block text-xs text-white/60">Supporting</span><span className="block truncate font-semibold">{causeLabel}</span></span>
            </div>
            {step >= 3 && <p className="mt-3 text-sm text-white/70">Paying with <Badge tone="plain" className="bg-white/15 text-white">{methods.find((m) => m.id === method)?.label}</Badge></p>}
          </div>
          <ul className="space-y-2.5 border-t border-white/10 bg-black/10 p-6 text-sm text-white/80">
            <li className="flex gap-2"><ShieldCheck className="h-4 w-4 shrink-0 text-[#7fd6a6]" aria-hidden="true" />Secure payment through a licensed Indian payment gateway</li>
            <li className="flex gap-2"><Lock className="h-4 w-4 shrink-0 text-[#7fd6a6]" aria-hidden="true" />We never see or store your card details</li>
            <li className="flex gap-2"><Heart className="h-4 w-4 shrink-0 text-[#7fd6a6]" aria-hidden="true" />Email confirmation after the payment is confirmed</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
