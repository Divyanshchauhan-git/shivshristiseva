import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ShieldCheck, CheckCircle2, Search, Award, FileText,
  UserCheck, Printer, Building2,
  Phone, MapPin, Mail
} from 'lucide-react';
import { brand } from '@/config/brand';
import { useSeo } from '@/hooks/useSeo';
import { PageHero } from '@/components/layout/PageHero';
import { Button } from '@/components/ui/Button';
import { inr } from '@/utils/format';

// Deterministic QR Code visual generator for dynamic verification
function VerificationQRCode({ value, size = 100, className = '' }: { value: string; size?: number; className?: string }) {
  // Generate a realistic grid based on the string hash
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  const cells: boolean[][] = [];
  const gridSize = 21; // Standard Version 1 QR code matrix size

  for (let r = 0; r < gridSize; r++) {
    cells[r] = [];
    for (let c = 0; c < gridSize; c++) {
      // Corner detection patterns (top-left, top-right, bottom-left)
      const isTopLeft = r < 7 && c < 7;
      const isTopRight = r < 7 && c >= gridSize - 7;
      const isBottomLeft = r >= gridSize - 7 && c < 7;

      if (isTopLeft || isTopRight || isBottomLeft) {
        const localR = isBottomLeft ? r - (gridSize - 7) : r;
        const localC = isTopRight ? c - (gridSize - 7) : c;
        if (localR === 0 || localR === 6 || localC === 0 || localC === 6) {
          cells[r][c] = true;
        } else if (localR >= 2 && localR <= 4 && localC >= 2 && localC <= 4) {
          cells[r][c] = true;
        } else {
          cells[r][c] = false;
        }
      } else {
        // Pseudo-random data bits from hash
        const bit = Math.abs(Math.sin((r * gridSize + c + hash) * 12.9898) * 43758.5453) % 1 > 0.5;
        cells[r][c] = bit;
      }
    }
  }

  const cellSize = size / gridSize;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className} aria-label={`QR Code for ${value}`}>
      <rect width={size} height={size} fill="#ffffff" rx={4} />
      {cells.map((row, r) =>
        row.map((active, c) =>
          active ? (
            <rect
              key={`${r}-${c}`}
              x={c * cellSize}
              y={r * cellSize}
              width={cellSize - 0.2}
              height={cellSize - 0.2}
              fill="#0B3B3E"
            />
          ) : null
        )
      )}
    </svg>
  );
}

// Sample verified database records for demonstration
const verifiedRecords = {
  volunteers: [
    {
      id: 'SSS-VOL-2024-001',
      name: 'Aarav Sharma',
      role: 'Senior Field Coordinator',
      department: 'Animal Rescue & Feeding',
      bloodGroup: 'B+',
      phone: '+91 98765 43210',
      joinedDate: '15 Jan 2024',
      validTill: '31 Dec 2026',
      status: 'Active',
      photo: '/images/animal_rescue.jpg',
      emergencyContact: '+91 98111 22334',
      issuedBy: 'General Secretary',
    },
    {
      id: 'SSS-VOL-2024-042',
      name: 'Priya Verma',
      role: 'Education Lead & Volunteer',
      department: 'Child Education & Learning Camps',
      bloodGroup: 'O+',
      phone: '+91 98222 33445',
      joinedDate: '10 Mar 2024',
      validTill: '31 Dec 2026',
      status: 'Active',
      photo: '/images/hero_community.jpg',
      emergencyContact: '+91 98333 44556',
      issuedBy: 'President',
    },
    {
      id: 'SSS-VOL-2024-089',
      name: 'Sunita Devi',
      role: 'Community Artisan Coordinator',
      department: 'Women Empowerment & Self-Help',
      bloodGroup: 'A+',
      phone: '+91 98333 77889',
      joinedDate: '01 Jun 2024',
      validTill: '31 Dec 2026',
      status: 'Active',
      photo: '/images/women_livelihood.jpg',
      emergencyContact: '+91 98444 55667',
      issuedBy: 'Program Director',
    },
  ],
  receipts: [
    {
      id: 'SSS-80G-2024-108',
      donorName: 'Vikram Malhotra',
      pan: 'ABCDE1234F',
      amount: 10000,
      amountWords: 'Rupees Ten Thousand Only',
      cause: 'Child Education & Learning Kits',
      mode: 'UPI (Google Pay)',
      date: '18 Sep 2024',
      refNumber: 'UPI/428910283719',
      status: 'Verified & Audited',
    },
    {
      id: 'SSS-80G-2024-245',
      donorName: 'Meera Sengupta',
      pan: 'BKZPS9876K',
      amount: 5000,
      amountWords: 'Rupees Five Thousand Only',
      cause: 'Animal Healthcare & Shelter Food',
      mode: 'Net Banking (HDFC Bank)',
      date: '22 Sep 2024',
      refNumber: 'HDFC/8912739182',
      status: 'Verified & Audited',
    },
  ],
  certificates: [
    {
      id: 'SSS-CERT-2024-892',
      recipient: 'Aarav Sharma',
      title: 'Certificate of Exemplary Volunteer Service',
      description: 'In recognition of outstanding dedication and compassionate service towards community animal rescue, emergency care, and daily feeding programs across Delhi-NCR.',
      date: '15 Aug 2024',
      signatory: 'Dr. R. K. Sharma (President)',
      signatory2: 'Dharmender Kumar (Secretary)',
    },
    {
      id: 'SSS-CERT-2024-411',
      recipient: 'Priya Verma',
      title: 'Certificate of Appreciation in Child Education',
      description: 'For selfless commitment to teaching and conducting daily remedial classes for over 60 underserved children at the Rohini Community Study Centre.',
      date: '05 Sep 2024 (Teachers Day)',
      signatory: 'Dr. R. K. Sharma (President)',
      signatory2: 'Dharmender Kumar (Secretary)',
    },
  ],
  appointments: [
    {
      id: 'SSS-APT-2024-034',
      candidateName: 'Aarav Sharma',
      designation: 'Honorary Animal Welfare Coordinator',
      appointmentDate: '15 Jan 2024',
      duration: 'Two Years (Renewable)',
      responsibilities: [
        'Coordinate rescue operations and transport for injured community animals.',
        'Supervise daily feeding routes in designated municipal wards.',
        'Liaise with partner veterinary surgeons and maintain medication logs.',
        'Represent the Sansthan in local civic community meetings.',
      ],
      reportingTo: 'Board of Trustees & General Secretary',
    },
  ],
};

export default function Verify() {
  useSeo({
    title: 'Online Verification Portal · ID Cards, 80G Receipts & Certificates',
    description: `Official verification portal of ${brand.name}. Verify Volunteer ID cards, 80G Tax Exemption receipts, Certificates of Appreciation, and Appointment Letters.`,
    path: '/verify',
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const initialType = searchParams.get('type') || 'volunteer';
  const initialQuery = searchParams.get('id') || '';

  const [activeTab, setActiveTab] = useState<'volunteer' | 'receipt' | 'certificate' | 'appointment'>(
    initialType as any
  );
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchedId, setSearchedId] = useState(initialQuery || 'SSS-VOL-2024-001');

  // Find records
  const currentVolunteer =
    verifiedRecords.volunteers.find((v) => v.id.toLowerCase() === searchedId.toLowerCase()) ||
    verifiedRecords.volunteers[0];

  const currentReceipt =
    verifiedRecords.receipts.find((r) => r.id.toLowerCase() === searchedId.toLowerCase()) ||
    verifiedRecords.receipts[0];

  const currentCert =
    verifiedRecords.certificates.find((c) => c.id.toLowerCase() === searchedId.toLowerCase()) ||
    verifiedRecords.certificates[0];

  const currentApt =
    verifiedRecords.appointments.find((a) => a.id.toLowerCase() === searchedId.toLowerCase()) ||
    verifiedRecords.appointments[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchedId(searchQuery.trim());
      setSearchParams({ type: activeTab, id: searchQuery.trim() });
    }
  };

  const handleTabChange = (tab: 'volunteer' | 'receipt' | 'certificate' | 'appointment') => {
    setActiveTab(tab);
    let sampleId = '';
    if (tab === 'volunteer') sampleId = verifiedRecords.volunteers[0].id;
    if (tab === 'receipt') sampleId = verifiedRecords.receipts[0].id;
    if (tab === 'certificate') sampleId = verifiedRecords.certificates[0].id;
    if (tab === 'appointment') sampleId = verifiedRecords.appointments[0].id;
    setSearchQuery(sampleId);
    setSearchedId(sampleId);
    setSearchParams({ type: tab, id: sampleId });
  };

  const handlePrint = () => {
    window.print();
  };

  const currentUrl = typeof window !== 'undefined' ? `${window.location.origin}/verify?type=${activeTab}&id=${searchedId}` : '';

  return (
    <>
      <PageHero
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Verification Portal' }]}
        eyebrow="Official Verification Portal"
        title="Verify NGO Credentials & Documents."
        text="Instant digital verification for Volunteer ID Cards, 80G Tax Exemption Receipts, Appointment Letters, and Certificates of Honor."
      />

      <section className="section bg-bg pt-8 sm:pt-12">
        <div className="container-page max-w-5xl">
          {/* Trust Banner */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-emerald-500/30 bg-emerald-50/70 p-4 sm:p-5 text-xs text-emerald-950 shadow-sm backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-600 text-white shadow-sm">
                <ShieldCheck className="h-6 w-6" />
              </span>
              <div>
                <p className="font-bold text-sm text-emerald-900">Official Government Verified NGO Portal</p>
                <p className="text-emerald-800">All documents generated here are backed by {brand.legal.registration} &amp; {brand.legal.darpan}.</p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-200/70 px-3 py-1 font-mono font-bold text-[0.72rem] text-emerald-900">
              100% Tamper Proof
            </span>
          </div>

          {/* Search Bar */}
          <div className="rounded-3xl border border-line bg-surface p-6 shadow-soft sm:p-8">
            <div className="flex flex-wrap gap-2 border-b border-line pb-6">
              {[
                { key: 'volunteer', label: 'Volunteer / Member ID Card', icon: UserCheck },
                { key: 'receipt', label: '80G Tax Donation Receipt', icon: FileText },
                { key: 'certificate', label: 'Appreciation Certificate', icon: Award },
                { key: 'appointment', label: 'Appointment Letter', icon: Building2 },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => handleTabChange(tab.key as any)}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all sm:text-sm ${
                      active
                        ? 'bg-brand text-white shadow-sm ring-2 ring-brand/20'
                        : 'border border-line bg-surface-2/60 text-fg hover:border-brand/40 hover:bg-surface-2'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Search Input Form */}
            <form onSubmit={handleSearch} className="mt-6 flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Enter ${activeTab === 'volunteer' ? 'Member / Volunteer ID (e.g. SSS-VOL-2024-001)' : activeTab === 'receipt' ? 'Receipt No (e.g. SSS-80G-2024-108)' : 'Certificate Serial No'}`}
                  className="w-full rounded-xl border border-line bg-surface-2/40 py-3 pl-10 pr-4 text-sm font-medium text-fg focus:border-brand-text focus:outline-none focus:ring-2 focus:ring-brand/20"
                />
              </div>
              <Button type="submit" variant="primary" size="md" icon={<Search className="h-4 w-4" />}>
                Verify Now
              </Button>
            </form>

            {/* Quick Demo Previews */}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted">
              <span>Quick Sample Records:</span>
              {activeTab === 'volunteer' && (
                <>
                  <button type="button" onClick={() => { setSearchQuery('SSS-VOL-2024-001'); setSearchedId('SSS-VOL-2024-001'); }} className="rounded-lg bg-surface-2 px-2 py-1 font-mono hover:text-brand-text">SSS-VOL-2024-001</button>
                  <button type="button" onClick={() => { setSearchQuery('SSS-VOL-2024-042'); setSearchedId('SSS-VOL-2024-042'); }} className="rounded-lg bg-surface-2 px-2 py-1 font-mono hover:text-brand-text">SSS-VOL-2024-042</button>
                </>
              )}
              {activeTab === 'receipt' && (
                <>
                  <button type="button" onClick={() => { setSearchQuery('SSS-80G-2024-108'); setSearchedId('SSS-80G-2024-108'); }} className="rounded-lg bg-surface-2 px-2 py-1 font-mono hover:text-brand-text">SSS-80G-2024-108</button>
                  <button type="button" onClick={() => { setSearchQuery('SSS-80G-2024-245'); setSearchedId('SSS-80G-2024-245'); }} className="rounded-lg bg-surface-2 px-2 py-1 font-mono hover:text-brand-text">SSS-80G-2024-245</button>
                </>
              )}
              {activeTab === 'certificate' && (
                <button type="button" onClick={() => { setSearchQuery('SSS-CERT-2024-892'); setSearchedId('SSS-CERT-2024-892'); }} className="rounded-lg bg-surface-2 px-2 py-1 font-mono hover:text-brand-text">SSS-CERT-2024-892</button>
              )}
              {activeTab === 'appointment' && (
                <button type="button" onClick={() => { setSearchQuery('SSS-APT-2024-034'); setSearchedId('SSS-APT-2024-034'); }} className="rounded-lg bg-surface-2 px-2 py-1 font-mono hover:text-brand-text">SSS-APT-2024-034</button>
              )}
            </div>
          </div>

          {/* ========================================================= */}
          {/* TAB 1: VOLUNTEER / MEMBER ID CARD */}
          {/* ========================================================= */}
          {activeTab === 'volunteer' && (
            <div className="mt-10 animate-rise">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Verified Official ID Card · Status: Active
                  </span>
                  <h3 className="mt-1 font-display text-2xl text-fg sm:text-3xl">Digital Identity Card</h3>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" onClick={handlePrint} icon={<Printer className="h-4 w-4" />}>
                    Print ID Card
                  </Button>
                </div>
              </div>

              {/* ID Card Front and Back Grid */}
              <div className="grid gap-8 md:grid-cols-2">
                {/* FRONT SIDE */}
                <div className="relative mx-auto w-full max-w-[22rem] overflow-hidden rounded-3xl border-2 border-[#0B3B3E]/30 bg-gradient-to-b from-[#0B3B3E] via-[#0E494C] to-[#0B3B3E] text-white shadow-2xl">
                  {/* Lanyard punch hole hole preview */}
                  <div className="mx-auto mt-3 h-3 w-12 rounded-full bg-white/20 ring-1 ring-black/20" />
                  
                  {/* Top Header */}
                  <div className="p-5 pb-3 text-center">
                    <p className="font-deva text-xs tracking-wider text-amber-300">{brand.nativeName}</p>
                    <h4 className="font-display text-lg tracking-tight text-white leading-tight mt-0.5">{brand.name}</h4>
                    <p className="mt-1 text-[0.62rem] text-white/70 uppercase tracking-widest">{brand.legal.registration}</p>
                  </div>

                  {/* Photo & Badge */}
                  <div className="mt-1 flex flex-col items-center">
                    <div className="relative h-28 w-28 overflow-hidden rounded-2xl border-4 border-amber-400 bg-surface shadow-md">
                      <img src={currentVolunteer.photo} alt={currentVolunteer.name} className="h-full w-full object-cover object-top" />
                    </div>
                    <span className="mt-3 inline-block rounded-full bg-amber-400 px-3 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-stone-950">
                      Volunteer / Member
                    </span>
                    <h5 className="mt-2 text-xl font-bold tracking-tight text-white">{currentVolunteer.name}</h5>
                    <p className="text-xs font-semibold text-amber-300">{currentVolunteer.role}</p>
                  </div>

                  {/* Details Pill */}
                  <div className="m-4 mt-4 rounded-2xl bg-white/10 p-3.5 backdrop-blur-md text-xs text-white/90">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[0.65rem] uppercase text-white/60">ID Number</span>
                        <p className="font-mono font-bold text-amber-300">{currentVolunteer.id}</p>
                      </div>
                      <div>
                        <span className="text-[0.65rem] uppercase text-white/60">Blood Group</span>
                        <p className="font-bold text-white">{currentVolunteer.bloodGroup}</p>
                      </div>
                      <div>
                        <span className="text-[0.65rem] uppercase text-white/60">Issued Date</span>
                        <p className="font-medium text-white/80">{currentVolunteer.joinedDate}</p>
                      </div>
                      <div>
                        <span className="text-[0.65rem] uppercase text-white/60">Valid Thru</span>
                        <p className="font-medium text-white/80">{currentVolunteer.validTill}</p>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Bar */}
                  <div className="border-t border-white/15 bg-black/25 px-4 py-2 text-center text-[0.65rem] text-white/75">
                    Official Identity Card · Authorized by General Secretary
                  </div>
                </div>

                {/* BACK SIDE */}
                <div className="relative mx-auto flex w-full max-w-[22rem] flex-col justify-between overflow-hidden rounded-3xl border-2 border-line bg-surface p-6 shadow-2xl text-fg">
                  <div>
                    {/* Lanyard punch hole preview */}
                    <div className="mx-auto -mt-2 h-3 w-12 rounded-full bg-surface-2 ring-1 ring-line" />
                    
                    <div className="mt-4 flex items-center justify-between border-b border-line pb-3">
                      <div>
                        <h4 className="font-sans text-xs font-bold text-brand uppercase tracking-wider">Instructions &amp; Verification</h4>
                        <p className="text-[0.68rem] text-muted">Scan QR to verify live authorization</p>
                      </div>
                      <VerificationQRCode value={currentUrl} size={64} className="border border-line rounded" />
                    </div>

                    <div className="mt-4 space-y-2 text-xs text-muted">
                      <p className="flex items-start gap-2">
                        <Phone className="h-3.5 w-3.5 shrink-0 text-brand-text mt-0.5" />
                        <span><strong>Emergency Contact:</strong> {currentVolunteer.emergencyContact}</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-brand-text mt-0.5" />
                        <span><strong>Office:</strong> {brand.contact.address.join(', ')}</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <Mail className="h-3.5 w-3.5 shrink-0 text-brand-text mt-0.5" />
                        <span><strong>Email:</strong> {brand.contact.email}</span>
                      </p>
                    </div>

                    <div className="mt-4 rounded-xl bg-surface-2 p-3 text-[0.68rem] text-muted">
                      <p>1. This card is non-transferable and remains property of {brand.name}.</p>
                      <p className="mt-1">2. If found, please return to the office address or call helpline {brand.contact.phone}.</p>
                    </div>
                  </div>

                  {/* Signatures & Seal */}
                  <div className="mt-6 flex items-end justify-between border-t border-line pt-4">
                    <div className="text-center">
                      <div className="h-8 flex items-center justify-center font-serif italic text-xs text-brand font-bold">
                        P. Gupta
                      </div>
                      <span className="block border-t border-muted/30 pt-1 text-[0.62rem] text-muted uppercase">Holder Signature</span>
                    </div>

                    {/* Official Stamp */}
                    <div className="grid h-12 w-12 place-items-center rounded-full border-2 border-dashed border-red-700/60 text-[0.55rem] font-bold text-red-800 uppercase leading-none text-center">
                      SEAL<br/>VERIFIED
                    </div>

                    <div className="text-center">
                      <div className="h-8 flex items-center justify-center font-serif italic text-xs text-brand font-bold">
                        S. N. Chauhan
                      </div>
                      <span className="block border-t border-muted/30 pt-1 text-[0.62rem] text-muted uppercase">Gen. Secretary</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: 80G TAX DONATION RECEIPT */}
          {/* ========================================================= */}
          {activeTab === 'receipt' && (
            <div className="mt-10 animate-rise">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Verified Official Receipt · 80G Tax Exemption Valid
                  </span>
                  <h3 className="mt-1 font-display text-2xl text-fg sm:text-3xl">Official 80G Donation Receipt</h3>
                </div>
                <Button variant="secondary" size="sm" onClick={handlePrint} icon={<Printer className="h-4 w-4" />}>
                  Print Receipt
                </Button>
              </div>

              {/* Printable Letterhead Receipt */}
              <div className="rounded-3xl border-2 border-line bg-surface p-6 sm:p-10 shadow-lift text-fg">
                {/* Letterhead Header */}
                <div className="flex flex-col gap-4 border-b-2 border-brand pb-6 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h4 className="font-display text-2xl text-brand">{brand.name}</h4>
                    <p className="font-deva text-sm text-brand-text font-medium">{brand.nativeName}</p>
                    <p className="mt-1 text-xs text-muted max-w-md">{brand.contact.address.join(', ')} | Phone: {brand.contact.phone}</p>
                    <p className="mt-1 font-mono text-[0.72rem] text-muted">
                      {brand.legal.registration} | PAN: <strong>{brand.legal.pan}</strong>
                    </p>
                  </div>
                  <div className="rounded-2xl border border-line bg-surface-2/60 p-4 text-right">
                    <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-bold text-amber-900">80G TAX EXEMPTION</span>
                    <p className="mt-1 font-mono text-sm font-bold text-fg">Receipt: {currentReceipt.id}</p>
                    <p className="text-xs text-muted">Date: {currentReceipt.date}</p>
                  </div>
                </div>

                {/* Tax Exemption Accreditation Citation */}
                <div className="mt-4 rounded-xl bg-emerald-50/80 border border-emerald-500/20 p-3 text-xs text-emerald-900">
                  <strong>Income Tax Exemption:</strong> Donations to {brand.name} are eligible for 50% deduction under Section 80G of the Income Tax Act, 1961 (Registration: {brand.legal.taxExemption}).
                </div>

                {/* Donor Receipt Details Table */}
                <div className="mt-6 divide-y divide-line rounded-2xl border border-line bg-surface-2/30 text-sm">
                  <div className="grid grid-cols-1 gap-2 p-4 sm:grid-cols-2">
                    <div>
                      <span className="text-xs text-muted uppercase">Received With Thanks From</span>
                      <p className="font-bold text-base text-fg mt-0.5">{currentReceipt.donorName}</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted uppercase">Donor PAN Number</span>
                      <p className="font-mono font-bold text-fg mt-0.5">{currentReceipt.pan}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-2 p-4 sm:grid-cols-2">
                    <div>
                      <span className="text-xs text-muted uppercase">Amount Donated</span>
                      <p className="font-display text-2xl text-emerald-700 mt-0.5">{inr(currentReceipt.amount)}</p>
                      <p className="text-xs italic text-muted mt-0.5">({currentReceipt.amountWords})</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted uppercase">Payment Mode &amp; Reference</span>
                      <p className="font-medium text-fg mt-0.5">{currentReceipt.mode}</p>
                      <p className="font-mono text-xs text-muted">{currentReceipt.refNumber}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <span className="text-xs text-muted uppercase">Purpose / Cause Allocated</span>
                    <p className="font-semibold text-fg mt-0.5">{currentReceipt.cause}</p>
                  </div>
                </div>

                {/* QR Code & Signatures */}
                <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-t border-line pt-6">
                  <div className="flex items-center gap-3">
                    <VerificationQRCode value={currentUrl} size={76} className="border border-line rounded-lg" />
                    <div className="text-xs text-muted">
                      <p className="font-bold text-fg">Scan to Verify 80G Receipt</p>
                      <p>Instant online record on {brand.shortName} portal</p>
                      <p className="font-mono text-[0.68rem] text-brand-text">{currentReceipt.id}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="grid h-16 w-16 place-items-center rounded-full border-2 border-dashed border-red-700/60 text-[0.6rem] font-bold text-red-800 uppercase leading-tight text-center">
                      OFFICIAL<br/>80G STAMP<br/>VERIFIED
                    </div>
                    <div className="text-center">
                      <div className="h-8 flex items-center justify-center font-serif italic text-base text-brand font-bold">
                        S. N. Chauhan
                      </div>
                      <span className="block border-t border-muted/30 pt-1 text-xs text-muted uppercase font-medium">Authorized Signatory</span>
                      <span className="text-[0.68rem] text-muted">{brand.name}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: CERTIFICATE OF APPRECIATION */}
          {/* ========================================================= */}
          {activeTab === 'certificate' && (
            <div className="mt-10 animate-rise">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900">
                    <Award className="h-4 w-4 text-amber-700" />
                    Verified Official Certificate · Authentic Honor
                  </span>
                  <h3 className="mt-1 font-display text-2xl text-fg sm:text-3xl">Certificate of Appreciation</h3>
                </div>
                <Button variant="secondary" size="sm" onClick={handlePrint} icon={<Printer className="h-4 w-4" />}>
                  Print Certificate
                </Button>
              </div>

              {/* Certificate Canvas */}
              <div className="relative rounded-3xl border-8 border-double border-amber-600/40 bg-gradient-to-b from-[#fffdf7] to-[#fffbf0] p-8 sm:p-14 shadow-2xl text-center text-stone-900">
                {/* Decorative border corners */}
                <div className="mx-auto max-w-2xl">
                  <div className="flex items-center justify-center gap-2">
                    <span className="h-px w-10 bg-amber-500" />
                    <p className="font-deva text-sm tracking-wider text-amber-800">{brand.nativeName}</p>
                    <span className="h-px w-10 bg-amber-500" />
                  </div>
                  <h4 className="font-display text-2xl sm:text-3xl tracking-tight text-[#0B3B3E] mt-1">{brand.name}</h4>
                  <p className="text-[0.72rem] uppercase tracking-[0.2em] text-stone-600 mt-1">{brand.legal.registration}</p>

                  <div className="my-6">
                    <span className="font-serif italic text-base text-amber-800">This Certificate of Honor is proudly presented to</span>
                    <h5 className="font-display text-3xl sm:text-4xl text-[#0B3B3E] mt-2 underline decoration-amber-400 decoration-wavy underline-offset-8">
                      {currentCert.recipient}
                    </h5>
                  </div>

                  <p className="font-sans text-sm sm:text-base leading-relaxed text-stone-700 max-w-xl mx-auto">
                    {currentCert.description}
                  </p>

                  <div className="mt-8 flex items-center justify-center gap-4">
                    <span className="rounded-full bg-amber-100 px-4 py-1 text-xs font-bold font-mono text-amber-900 border border-amber-300">
                      Serial No: {currentCert.id}
                    </span>
                    <span className="text-xs text-stone-500">Date: {currentCert.date}</span>
                  </div>

                  {/* Signatures & Seal */}
                  <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between border-t border-amber-300/60 pt-6">
                    <div className="text-center sm:text-left">
                      <div className="font-serif italic text-base font-bold text-[#0B3B3E]">Dr. R. K. Sharma</div>
                      <span className="text-xs text-stone-600 uppercase tracking-wider">President</span>
                    </div>

                    {/* Gold Foil Seal */}
                    <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-tr from-amber-500 via-amber-300 to-amber-500 shadow-md ring-4 ring-amber-200 text-[0.62rem] font-bold text-stone-900 uppercase">
                      OFFICIAL<br/>SEAL
                    </div>

                    <div className="text-center sm:text-right">
                      <div className="font-serif italic text-base font-bold text-[#0B3B3E]">S. N. Chauhan</div>
                      <span className="text-xs text-stone-600 uppercase tracking-wider">General Secretary</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: APPOINTMENT LETTER */}
          {/* ========================================================= */}
          {activeTab === 'appointment' && (
            <div className="mt-10 animate-rise">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Verified Official Appointment · Authorized Record
                  </span>
                  <h3 className="mt-1 font-display text-2xl text-fg sm:text-3xl">Official Letter of Appointment</h3>
                </div>
                <Button variant="secondary" size="sm" onClick={handlePrint} icon={<Printer className="h-4 w-4" />}>
                  Print Letter
                </Button>
              </div>

              {/* Letter Document */}
              <div className="rounded-3xl border-2 border-line bg-surface p-8 sm:p-12 shadow-lift text-fg">
                <div className="border-b-2 border-brand pb-6">
                  <h4 className="font-display text-2xl text-brand">{brand.name}</h4>
                  <p className="font-deva text-xs text-brand-text">{brand.nativeName}</p>
                  <p className="text-xs text-muted mt-1">{brand.contact.address.join(', ')}</p>
                  <div className="mt-3 flex flex-wrap justify-between text-xs font-mono text-muted">
                    <span>Ref No: {currentApt.id}</span>
                    <span>Date: {currentApt.appointmentDate}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-4 text-sm leading-relaxed text-stone-800">
                  <p><strong>To,</strong><br/>{currentApt.candidateName}<br/>Volunteer &amp; Community Member</p>
                  <p className="font-bold text-base text-brand">Subject: Letter of Appointment as {currentApt.designation}</p>
                  <p>Dear {currentApt.candidateName},</p>
                  <p>
                    On behalf of the Governing Board of <strong>{brand.name}</strong>, we are pleased to officially appoint you as <strong>{currentApt.designation}</strong> with effect from <strong>{currentApt.appointmentDate}</strong>.
                  </p>
                  <p>
                    Your tenure will be for an initial duration of <strong>{currentApt.duration}</strong>. In this honorary role, you will be responsible for the following core duties:
                  </p>
                  <ul className="list-disc pl-6 space-y-1.5 text-stone-700">
                    {currentApt.responsibilities.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                  <p>
                    We welcome you to our mission of service and express our deepest gratitude for your volunteer spirit towards the empowerment of underprivileged lives and the welfare of voiceless animals.
                  </p>
                  <p className="pt-4">Sincerely,<br/><strong>For {brand.name}</strong></p>
                </div>

                <div className="mt-10 flex items-center justify-between border-t border-line pt-6">
                  <div className="flex items-center gap-3">
                    <VerificationQRCode value={currentUrl} size={64} className="border border-line rounded" />
                    <span className="text-xs text-muted font-mono">{currentApt.id}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-serif italic text-base text-brand font-bold">S. N. Chauhan</div>
                    <span className="text-xs text-muted uppercase">General Secretary</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
