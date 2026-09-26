import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronDown, Download, FileText, Lock, Search } from 'lucide-react';
import { useSeo } from '@/hooks/useSeo';
import { useAsync } from '@/hooks/useAsync';
import { contentApi } from '@/services/api';
import { brand } from '@/config/brand';
import { PageHero } from '@/components/layout/PageHero';
import { ContactBlock } from './Home';
import { AsyncView, EmptyState, LoadingBlock } from '@/components/ui/States';
import { SearchInput } from '@/components/ui/Controls';
import { ButtonLink, Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import type { DocumentItem } from '@/types';
import NotFound from './NotFound';

export function Contact() {
  useSeo({ title: 'Contact', description: `Contact ${brand.name}: phone, email, WhatsApp, office address and contact form.`, path: '/contact' });
  return (
    <>
      <PageHero crumbs={[{ label: 'Home', to: '/' }, { label: 'Contact' }]} eyebrow="Contact" theme="community" seed={15} title="Get in touch." text="Questions about donations, volunteering, partnerships or an animal in need? We're here to help." />
      <section className="section"><div className="container-page"><ContactBlock /></div></section>
    </>
  );
}

export function Faq() {
  useSeo({ title: 'FAQ', description: 'Answers about donations, payments, receipts, monthly giving, volunteering, CSR, adoption, campaigns, transparency and refunds.', path: '/faq' });
  const s = useAsync(() => contentApi.faqs(), []);
  const [q, setQ] = useState('');
  const [open, setOpen] = useState<string | null>(null);
  return (
    <>
      <PageHero crumbs={[{ label: 'Home', to: '/' }, { label: 'FAQ' }]} eyebrow="Help" theme="health" seed={27} title="Frequently asked questions." />
      <section className="section pt-10">
        <div className="container-page max-w-3xl">
          <SearchInput value={q} onChange={setQ} placeholder="Search questions" label="Search questions" />
          <div className="mt-8">
            <AsyncView state={s} retry={s.retry} loading={<LoadingBlock />} isEmpty={(d) => !d.some((f) => (f.q + f.a).toLowerCase().includes(q.toLowerCase()))}
              empty={<EmptyState title="No questions match your search." text="Try different words, or contact us." icon={<Search className="h-6 w-6" />} action={<ButtonLink to="/contact">Contact us</ButtonLink>} />}>
              {(d) => {
                const list = d.filter((f) => (f.q + f.a).toLowerCase().includes(q.toLowerCase()));
                const groups = [...new Set(list.map((f) => f.group))];
                return (
                  <div className="space-y-10">
                    {groups.map((g) => (
                      <section key={g} aria-labelledby={`faq-${g.replace(/\W/g, "")}`}>
                        <h2 id={`faq-${g.replace(/\W/g, '')}`} className="mb-3 text-2xl">{g}</h2>
                        <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
                          {list.filter((f) => f.group === g).map((f) => {
                            const on = open === f.q; const id = 'a-' + f.q.replace(/\W/g, '').slice(0, 24);
                            return (
                              <div key={f.q}>
                                <h3 className="font-sans">
                                  <button type="button" aria-expanded={on} aria-controls={id} onClick={() => setOpen(on ? null : f.q)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold hover:bg-surface-2/60">
                                    {f.q}<ChevronDown className={`h-5 w-5 shrink-0 text-muted transition-transform ${on ? 'rotate-180' : ''}`} aria-hidden="true" />
                                  </button>
                                </h3>
                                <div id={id} hidden={!on} className="px-5 pb-5 text-muted">{f.a}</div>
                              </div>
                            );
                          })}
                        </div>
                      </section>
                    ))}
                  </div>
                );
              }}
            </AsyncView>
          </div>
          <div className="mt-12 rounded-2xl bg-surface-2 p-6 text-center"><p className="font-semibold">Still have a question?</p><ButtonLink to="/contact" className="mt-3">Send us a message</ButtonLink></div>
        </div>
      </section>
    </>
  );
}

function DocRow({ d }: { d: DocumentItem }) {
  return (
    <li className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-5 sm:flex-row sm:items-center">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand-text"><FileText className="h-5 w-5" aria-hidden="true" /></span>
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{d.title}{d.period && <span className="font-normal text-muted"> · {d.period}</span>}</p>
        <p className="text-sm text-muted">{d.note}</p>
      </div>
      {d.verified && d.url ? (
        <a href={d.url} className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-text hover:underline" target="_blank" rel="noopener noreferrer"><Download className="h-4 w-4" aria-hidden="true" />Download PDF</a>
      ) : <Badge tone="warn" dot>Pending verification</Badge>}
    </li>
  );
}

export function Transparency() {
  useSeo({ title: 'Transparency & Reports', description: 'Registration information, tax documents, annual reports, audited financials, impact reports and policies.', path: '/transparency' });
  const s = useAsync(() => contentApi.documents(), []);
  const groups: { title: string; cats: DocumentItem['category'][] }[] = [
    { title: 'Registration & tax', cats: ['Registration', 'Tax'] },
    { title: 'Annual & financial reports', cats: ['Annual report', 'Financial report'] },
    { title: 'Impact reports', cats: ['Impact report'] },
    { title: 'Policies & legal', cats: ['Policy', 'Legal'] },
  ];
  return (
    <>
      <PageHero crumbs={[{ label: 'Home', to: '/' }, { label: 'Transparency' }]} eyebrow="Transparency centre" theme="community" seed={34}
        title="Transparency & reports." text="We publish only verified documents. Anything not yet verified is clearly marked." />
      <section className="section pt-10">
        <div className="container-page grid gap-10 lg:grid-cols-[18rem_1fr]">
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl bg-[#0F3D44] p-5 text-white">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#F4B154]">Registration information</p>
              <dl className="mt-3 space-y-2 text-sm">
                {Object.entries({ Registration: brand.legal.registration, PAN: brand.legal.pan, 'Tax exemption': brand.legal.taxExemption, 'CSR-1': brand.legal.csr1, FCRA: brand.legal.fcra }).map(([k, v]) => (
                  <div key={k}><dt className="text-white/60">{k}</dt><dd>{v}</dd></div>
                ))}
              </dl>
            </div>
            <nav aria-label="Policies" className="rounded-2xl border border-line p-5 text-sm">
              <p className="font-semibold">Policy summaries</p>
              <ul className="mt-2 space-y-1.5">{legalPages.map((l) => <li key={l.slug}><Link to={`/legal/${l.slug}`} className="link font-normal">{l.title}</Link></li>)}</ul>
            </nav>
          </aside>
          <div>
            <Alert tone="info" title="Only verified documents are published">Every slot below will link to a PDF once the document is verified and approved. We do not publish draft or unverified legal information.</Alert>
            <AsyncView state={s} retry={s.retry} loading={<LoadingBlock />}>
              {(d) => (
                <div className="mt-8 space-y-10">
                  {groups.map((g) => (
                    <section key={g.title} aria-labelledby={`doc-${g.cats[0].replace(/\W/g, "")}`}>
                      <h2 id={`doc-${g.cats[0].replace(/\W/g, "")}`} className="mb-4 text-2xl">{g.title}</h2>
                      <ul className="space-y-3">{d.filter((x) => g.cats.includes(x.category)).map((x) => <DocRow key={x.id} d={x} />)}</ul>
                    </section>
                  ))}
                </div>
              )}
            </AsyncView>
          </div>
        </div>
      </section>
    </>
  );
}

/* ================================ LEGAL ================================ */
const legalPages = [
  {
    slug: 'privacy', title: 'Privacy Policy', body: [
      ['What we collect', 'Contact details you give us (name, email, phone), donation details required for receipts (PAN and address, only when you ask for a tax receipt), and volunteer or partnership application details. Payment card or bank details are collected by the payment gateway, never by us.'],
      ['How we use it', 'To process donations, issue receipts, respond to messages, manage volunteering, and send updates you have agreed to receive.'],
      ['Sharing', 'We never sell your data. We share it only with service providers who help us operate (such as the payment gateway and email provider) and where required by law, including tax authorities for receipt reporting.'],
      ['Storage & security', 'Data is stored on secured servers with access limited by role, encrypted in transit, and retained only as long as needed for legal and operational purposes.'],
      ['Your rights', 'You can ask to see, correct or delete your personal data, or unsubscribe from emails at any time, subject to legal record-keeping requirements. Contact us to make a request.'],
      ['Stories & photos', 'We publish stories and images only with informed consent, and never identify children in protection situations.'],
    ],
  },
  {
    slug: 'terms', title: 'Terms of Use', body: [
      ['Using this website', 'By using this website you agree to use it lawfully and not to interfere with its operation or security.'],
      ['Content', 'Content on this site is provided for information. Figures marked as sample or demo are illustrative and not verified results.'],
      ['Donations', 'Donations are governed by our Donation & Refund Policy.'],
      ['Changes', 'We may update these terms. The version on this page applies.'],
      ['Governing law', '[Replace with verified governing law and jurisdiction.]'],
    ],
  },
  {
    slug: 'donation-refund', title: 'Donation / Refund Policy', body: [
      ['Use of donations', 'Donations to a specific programme or campaign are used for that purpose. General Fund donations go where the need is greatest, including essential operating costs.'],
      ['Receipts', 'A confirmation is emailed once the payment gateway confirms your payment. Tax receipts require PAN and address. [Replace with verified 80G details, if applicable.]'],
      ['Refunds', 'If you donated in error (duplicate payment or wrong amount), contact us within [X] days with your donation reference. Approved refunds are returned to the original payment method within the gateway’s timelines. Refunds are not possible after a tax receipt has been reported, except as permitted by law.'],
      ['Monthly donations', 'You can cancel a monthly mandate at any time from your UPI app, bank or by contacting us. Cancellation stops future debits.'],
      ['Failed payments', 'If money was debited for a failed payment, it is usually reversed automatically by your bank within a few working days.'],
    ],
  },
  {
    slug: 'safeguarding', title: 'Safeguarding Policy', body: [
      ['Our commitment', 'We are committed to protecting children and vulnerable adults from harm in everything we do.'],
      ['Code of conduct', 'All staff and volunteers sign a code of conduct, attend safeguarding orientation, and are never left alone with children without appropriate checks and supervision.'],
      ['Photos and stories', 'We do not publish identifying images or details of children in protection situations or of people receiving sensitive support.'],
      ['Reporting a concern', 'Report concerns to our Safeguarding Officer at [safeguarding email]. In an emergency involving a child, call CHILDLINE 1098 or the police on 112.'],
      ['Response', 'Every concern is recorded, handled confidentially and referred to the appropriate authorities where required.'],
    ],
  },
] as const;

export function Legal() {
  const { slug = '' } = useParams();
  const page = legalPages.find((l) => l.slug === slug);
  useSeo({ title: page?.title ?? 'Legal', path: `/legal/${slug}` });
  if (!page) return <NotFound />;
  return (
    <>
      <PageHero crumbs={[{ label: 'Home', to: '/' }, { label: 'Legal' }, { label: page.title }]} eyebrow="Legal" theme="community" seed={41} title={page.title} />
      <section className="section pt-10">
        <div className="container-page max-w-3xl">
          <Alert tone="warning" title="Summary for review">This is a plain-language template. It must be reviewed by the NGO&rsquo;s legal adviser and replaced with the approved policy before launch.</Alert>
          <div className="prose-body mt-8">
            {page.body.map(([h, t]) => (<div key={h}><h2>{h}</h2><p className="text-muted">{t}</p></div>))}
          </div>
          <p className="mt-10 flex items-center gap-2 text-sm text-muted"><Lock className="h-4 w-4" aria-hidden="true" />Questions? <Link to="/contact" className="link">Contact us</Link>.</p>
          <Button variant="ghost" className="-ml-4 mt-4" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to top</Button>
        </div>
      </section>
    </>
  );
}
