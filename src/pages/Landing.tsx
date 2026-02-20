import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardCheck,
  Plus,
  ArrowRight,
  Bell,
  ShieldCheck,
  Award,
  Users,
  CheckCircle2,
  FileSignature,
  Scale,
  ChevronDown,
  BookOpen,
  Gavel,
  Car,
  FileText,
} from 'lucide-react';
import autoprovIcon from '@/assets/autoprov_icon.png';

interface ToolCard {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  status: 'active' | 'coming-soon';
  path?: string;
  accentClass: string;
  iconBgClass: string;
  iconColorClass: string;
}

const tools: ToolCard[] = [
  {
    id: 'pdi',
    icon: <ClipboardCheck size={28} />,
    title: 'Used Vehicle PDI',
    description: 'Comprehensive Pre-Delivery Inspection compliance and condition report for used vehicles. CRA 2015 compliant.',
    status: 'active',
    path: '/pdi',
    accentClass: 'border-l-[#2d6aad]',
    iconBgClass: 'bg-[#e8f0f9]',
    iconColorClass: 'text-[#1e3a5f]',
  },
  {
    id: 'distance-sale',
    icon: <FileSignature size={28} />,
    title: 'Digital Distance Sale Pack',
    description: 'Generate a legally structured, exportable PDF compliance pack for distance vehicle sales. CRA 2015 & Consumer Contracts Regulations compliant.',
    status: 'active',
    path: '/distance-sale',
    accentClass: 'border-l-[#2d6aad]',
    iconBgClass: 'bg-[#e8f0f9]',
    iconColorClass: 'text-[#1e3a5f]',
  },
  {
    id: 'dispute-response',
    icon: <Scale size={28} />,
    title: 'Dispute Response Builder',
    description: 'AI-powered complaint defence tool. Generate legally compliant, professionally worded responses to customer disputes. CRA 2015 aligned.',
    status: 'active',
    path: '/dispute-response',
    accentClass: 'border-l-[#2d6aad]',
    iconBgClass: 'bg-[#e8f0f9]',
    iconColorClass: 'text-[#1e3a5f]',
  },
  {
    id: 'more',
    icon: <Plus size={28} />,
    title: 'More Tools Coming',
    description: 'Additional automotive compliance and management tools are in development.',
    status: 'coming-soon',
    accentClass: 'border-l-slate-300',
    iconBgClass: 'bg-slate-100',
    iconColorClass: 'text-slate-500',
  },
];

const trustItems = [
  { icon: <ShieldCheck size={16} />, label: 'Consumer Rights Act 2015 Compliant' },
  { icon: <Award size={16} />, label: 'Professional PDI Reports' },
  { icon: <Users size={16} />, label: 'Trusted by Automotive Professionals' },
];

const faqs = [
  {
    q: 'What are the AutoProv Compliance Tools?',
    a: 'The AutoProv Compliance Tools are a suite of free, standalone digital tools built for UK used car dealers and motor trade professionals. They cover three core compliance areas: Pre-Delivery Inspection (PDI) reporting, Distance Sale Pack generation, and AI-powered Dispute Response drafting. These tools are part of the wider AutoProv platform — a broad automotive management and operations platform currently in development — and will be fully integrated into AutoProv when it launches.',
  },
  {
    q: 'What is AutoProv?',
    a: 'AutoProv is a broader automotive platform in development, designed to cover far more than compliance alone. The Compliance Tools available here represent just one module of what AutoProv will offer. The compliance suite has been released early as a free, standalone resource for UK motor traders, ahead of the full AutoProv platform launch.',
  },
  {
    q: 'What is a PDI report and why do used car dealers need one?',
    a: 'A Pre-Delivery Inspection (PDI) report is a formal document recording the mechanical and cosmetic condition of a used vehicle before it is handed over to a buyer. Under the Consumer Rights Act 2015, a vehicle must be of satisfactory quality, fit for purpose, and as described at the point of sale. A completed PDI report provides critical evidence of the vehicle\'s condition if a buyer later raises a fault or seeks to reject the vehicle under the 30-day short-term right to reject.',
  },
  {
    q: 'Do UK car dealers need a Distance Sale Pack?',
    a: 'Yes. If a UK car dealer sells a vehicle remotely — online, by phone, or without the buyer visiting the premises in person — the sale is classified as a distance sale under the Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013. The dealer must provide mandatory pre-contract information and notify the buyer of their 14-day cooling-off right to cancel. Failure to comply is a criminal offence and extends the cancellation period to 12 months. The AutoProv Compliance Tools Distance Sale Pack generator creates a fully compliant document in minutes.',
  },
  {
    q: 'How does the AI Dispute Response Builder work?',
    a: 'The AI Dispute Response Builder guides dealers through a 7-step process: entering sale details, recording time and usage since sale, describing the customer\'s complaint, logging supporting evidence (PDI report, service history, DVLA data), and then generating a professional, legally-referenced response letter using Google Gemini AI. The letter references relevant sections of the Consumer Rights Act 2015, the 6-month burden of proof rule, and applicable case law.',
  },
  {
    q: 'What consumer law applies to used car sales in the UK?',
    a: 'The primary legislation is the Consumer Rights Act 2015 (CRA 2015), which requires goods — including used cars — to be of satisfactory quality, fit for purpose, and as described. Buyers have a 30-day short-term right to reject faulty vehicles. Within the first 6 months of purchase, faults are presumed to have existed at the point of sale unless the dealer can prove otherwise. For remote or online sales, the Consumer Contracts Regulations 2013 (CCR 2013) additionally grant consumers a 14-day right to cancel.',
  },
  {
    q: 'Are the AutoProv Compliance Tools free to use?',
    a: 'Yes. The three AutoProv Compliance Tools — the PDI Report, Distance Sale Pack generator, and AI Dispute Response Builder — are all free to use for UK used car dealers and motor trade professionals. No account registration is required. These tools are provided as a standalone compliance resource ahead of the full AutoProv platform launch.',
  },
];

const legalFrameworks = [
  {
    icon: <Gavel size={20} />,
    title: 'Consumer Rights Act 2015',
    description: 'Governs the quality and fitness of used vehicles. Dealers must understand the 30-day right to reject, the 6-month burden of proof reversal, and the right to repair or replace.',
  },
  {
    icon: <FileText size={20} />,
    title: 'Consumer Contracts Regulations 2013',
    description: 'Applies to all distance and online vehicle sales. Mandatory 14-day cooling-off period, pre-contract information requirements, and cancellation rights for remote buyers.',
  },
  {
    icon: <Car size={20} />,
    title: 'Road Traffic Act',
    description: 'Vehicle roadworthiness obligations at the point of sale. A dealer must not knowingly sell an unroadworthy vehicle. PDI records support compliance evidence.',
  },
  {
    icon: <BookOpen size={20} />,
    title: 'Sale of Goods Act 1979',
    description: 'Underlying principles relevant to dealer-to-dealer transactions and older pre-CRA sales. Implied terms of satisfactory quality and fitness for purpose.',
  },
];

const Landing = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">

      {/* ── Hero ── */}
      <header
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a3558 0%, #1e3f6b 55%, #0f2240 100%)' }}
      >
        {/* Gold decorative top stripe */}
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ background: 'linear-gradient(90deg, #c9a227, #f0c93a, #b8860b)' }}
        />

        {/* Subtle radial glow behind logo */}
        <div
          className="absolute left-1/2 top-0 -translate-x-1/2 w-96 h-96 opacity-10 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, #c9a227 0%, transparent 70%)',
          }}
        />

        <div className="relative max-w-5xl mx-auto px-6 py-14 sm:py-20 flex flex-col items-center text-center gap-6">

          {/* Logo */}
          <div
            className="rounded-2xl p-3 shadow-2xl"
            style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(6px)', border: '1px solid rgba(201,162,39,0.3)' }}
          >
            <img
              src={autoprovIcon}
              alt="AutoProv logo"
              className="w-20 h-20 sm:w-24 sm:h-24 object-contain drop-shadow-lg"
            />
          </div>

          {/* Brand name */}
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white drop-shadow">
              AutoProv
            </h1>
            <p className="text-base sm:text-lg font-medium tracking-widest uppercase" style={{ color: '#c9a227' }}>
              Compliance Tools
            </p>
          </div>

          {/* Tagline */}
          <p className="max-w-xl text-slate-300 text-sm sm:text-base leading-relaxed">
            Free automotive compliance tools for UK used car dealers — part of the wider AutoProv platform, releasing ahead of the full launch.
            Select a tool below to get started.
          </p>

          {/* Version chip */}
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
            style={{ background: 'rgba(201,162,39,0.18)', color: '#f0c93a', border: '1px solid rgba(201,162,39,0.35)' }}
          >
            <CheckCircle2 size={12} />
            Compliance Module — Early Access
          </span>
        </div>
      </header>

      {/* ── Trust bar ── */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-3 flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
          {trustItems.map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-xs font-medium text-slate-600">
              <span className="text-[#2d6aad]">{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>
      </div>

      {/* ── Tool grid ── */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12">
        <div className="mb-8 text-center">
          <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-slate-400 mb-1">Select a Tool</h2>
          <p className="text-2xl font-bold text-slate-800">What would you like to do today?</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {tools.map((tool) => {
            const isActive = tool.status === 'active';

            return (
              <div
                key={tool.id}
                className={[
                  'relative bg-white rounded-xl border border-slate-200 border-l-4 shadow-md p-6 flex flex-col gap-5 transition-all duration-200',
                  tool.accentClass,
                  isActive
                    ? 'cursor-pointer hover:shadow-xl hover:scale-[1.02]'
                    : 'opacity-70',
                ].join(' ')}
                onClick={isActive && tool.path ? () => navigate(tool.path!) : undefined}
                role={isActive ? 'button' : undefined}
                tabIndex={isActive ? 0 : undefined}
                onKeyDown={
                  isActive && tool.path
                    ? (e) => { if (e.key === 'Enter' || e.key === ' ') navigate(tool.path!); }
                    : undefined
                }
                aria-label={isActive ? `Launch ${tool.title}` : undefined}
              >
                {/* Status badge */}
                <span
                  className={[
                    'absolute top-4 right-4 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold',
                    isActive
                      ? 'bg-emerald-100 text-emerald-700'
                      : tool.id === 'more'
                        ? 'bg-slate-100 text-slate-500'
                        : 'bg-amber-100 text-amber-700',
                  ].join(' ')}
                >
                  {isActive ? (
                    <><CheckCircle2 size={10} /> Active</>
                  ) : (
                    'Coming Soon'
                  )}
                </span>

                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${tool.iconBgClass} ${tool.iconColorClass} shadow-sm`}>
                  {tool.icon}
                </div>

                {/* Text */}
                <div className="flex-1">
                  <h3 className="text-base font-bold text-slate-800 mb-1.5">{tool.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{tool.description}</p>
                </div>

                {/* CTA */}
                <div>
                  {isActive ? (
                    <button
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white shadow-sm transition-colors duration-150"
                      style={{ background: '#1e3a5f' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#2d5a9e')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = '#1e3a5f')}
                      onClick={(e) => { e.stopPropagation(); if (tool.path) navigate(tool.path); }}
                      tabIndex={-1}
                    >
                      Launch Tool <ArrowRight size={15} />
                    </button>
                  ) : (
                    <button
                      disabled
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold border border-amber-300 text-amber-600 bg-transparent opacity-60 cursor-not-allowed"
                    >
                      <Bell size={14} /> Notify Me
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* ── SEO / AEO Content Section ── */}
      <section
        aria-label="About AutoProv — UK Automotive Compliance Platform"
        className="bg-white border-t border-slate-200"
      >
        <div className="max-w-5xl mx-auto px-6 py-16 space-y-16">

          {/* ── Platform Overview ── */}
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-slate-400 mb-3">About These Tools</p>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4 leading-tight">
              AutoProv Compliance Tools for UK Used Car Dealers
            </h2>
            <p className="text-slate-600 text-base leading-relaxed mb-4">
              These are the <strong>AutoProv Compliance Tools</strong> — a suite of free digital compliance resources built specifically for UK used car dealers and motor trade professionals. They help dealers meet their legal obligations under the <strong>Consumer Rights Act 2015 (CRA 2015)</strong> and the <strong>Consumer Contracts Regulations 2013 (CCR 2013)</strong>, with no account required.
            </p>
            <p className="text-slate-500 text-sm leading-relaxed border border-slate-200 rounded-xl px-5 py-4 bg-slate-50">
              <strong className="text-slate-700">Note:</strong> These compliance tools are part of <strong>AutoProv</strong> — a broader automotive platform covering far more than compliance. The tools on this site are being made available as a free, standalone resource ahead of the full AutoProv platform launch.
            </p>
          </div>

          {/* ── Tool Descriptions ── */}
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">
              Three Compliance Tools. Free to Use.
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <article className="bg-slate-50 rounded-xl border border-slate-200 p-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ background: '#e8f0f9', color: '#1e3a5f' }}>
                  <ClipboardCheck size={20} />
                </div>
                <h4 className="text-base font-bold text-slate-800 mb-2">Used Vehicle PDI Report</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  A digital <strong>Pre-Delivery Inspection (PDI) report</strong> tool for UK used car dealers. Record the mechanical condition, tyre tread depths, brake performance, and cosmetic state of any used vehicle before handover. Capture customer signatures and generate a printable PDF. Protects dealers under <strong>CRA 2015</strong> if a buyer later claims a fault existed at the point of sale.
                </p>
              </article>

              <article className="bg-slate-50 rounded-xl border border-slate-200 p-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ background: '#e8f0f9', color: '#1e3a5f' }}>
                  <FileSignature size={20} />
                </div>
                <h4 className="text-base font-bold text-slate-800 mb-2">Digital Distance Sale Pack</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  A compliance document generator for dealers selling vehicles <strong>remotely — online, by phone, or at a distance</strong>. Creates a fully compliant pack meeting the <strong>Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013</strong>. Includes mandatory pre-contract information, the <strong>14-day cooling-off period</strong> notice, refund policy, and delivery terms — exported as a professional PDF.
                </p>
              </article>

              <article className="bg-slate-50 rounded-xl border border-slate-200 p-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ background: '#e8f0f9', color: '#1e3a5f' }}>
                  <Scale size={20} />
                </div>
                <h4 className="text-base font-bold text-slate-800 mb-2">AI Dispute Response Builder</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  An <strong>AI-powered tool for used car dealers</strong> facing customer complaints. Enter the sale details, complaint description, and supporting evidence, and the AI generates a professional, legally-referenced dispute response letter. References <strong>CRA 2015 sections</strong>, the 6-month burden of proof rule, and relevant case law — helping independent dealers compete without in-house legal teams.
                </p>
              </article>
            </div>
          </div>

          {/* ── Legal Frameworks ── */}
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-2 text-center">UK Consumer Law These Tools Cover</h3>
            <p className="text-sm text-slate-500 text-center mb-8">The legal frameworks every UK used car dealer must understand — addressed directly by the AutoProv Compliance Tools</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {legalFrameworks.map((law) => (
                <div key={law.title} className="flex gap-4 p-5 rounded-xl border border-slate-200 bg-slate-50">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: '#1e3a5f', color: '#f0c93a' }}
                  >
                    {law.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 mb-1">{law.title}</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">{law.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── FAQ / AEO Section ── */}
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-2 text-center">
              Frequently Asked Questions
            </h3>
            <p className="text-sm text-slate-500 text-center mb-8">
              Common questions from UK used car dealers about compliance, PDI reports, and consumer law
            </p>
            <div className="max-w-3xl mx-auto space-y-3">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="border border-slate-200 rounded-xl overflow-hidden bg-white"
                >
                  <button
                    className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left hover:bg-slate-50 transition-colors"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    aria-expanded={openFaq === i}
                  >
                    <span className="text-sm font-semibold text-slate-800">{faq.q}</span>
                    <ChevronDown
                      size={16}
                      className={`shrink-0 text-slate-400 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── Who It's For ── */}
          <div className="rounded-2xl border border-slate-200 p-8" style={{ background: 'linear-gradient(135deg, #1a3558 0%, #1e3f6b 100%)' }}>
            <h3 className="text-xl font-bold text-white mb-4 text-center">Who These Tools Are For</h3>
            <p className="text-slate-300 text-sm text-center mb-8 max-w-xl mx-auto">
              The AutoProv Compliance Tools are built for UK motor trade professionals who need reliable, legally-grounded compliance resources without the cost of specialist legal advice.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {[
                'Independent used car dealers',
                'Franchised motor dealers',
                'Car supermarkets',
                'Vehicle auction traders',
                'Online-only car retailers',
                'Motor trade compliance managers',
              ].map((role) => (
                <div key={role} className="flex items-center gap-2.5 text-sm text-slate-200">
                  <CheckCircle2 size={15} style={{ color: '#f0c93a' }} className="shrink-0" />
                  <span>{role}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        className="border-t py-6"
        style={{ background: '#0f2240', borderColor: 'rgba(255,255,255,0.08)' }}
      >
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <img src={autoprovIcon} alt="" className="w-5 h-5 opacity-70 object-contain" />
            <span className="font-semibold text-slate-300">AutoProv Compliance Tools</span>
            <span className="text-slate-600">·</span>
            <span>Part of the AutoProv Platform</span>
          </div>
          <span className="text-slate-500">CRA 2015 Compliant &mdash; © {new Date().getFullYear()} AutoProv</span>
        </div>
      </footer>

    </div>
  );
};

export default Landing;
