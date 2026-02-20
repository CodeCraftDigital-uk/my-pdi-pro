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

const Landing = () => {
  const navigate = useNavigate();

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
              Professional Automotive Compliance Platform
            </p>
          </div>

          {/* Tagline */}
          <p className="max-w-xl text-slate-300 text-sm sm:text-base leading-relaxed">
            Streamlined compliance tools designed for automotive professionals.
            Select a tool below to get started.
          </p>

          {/* Version chip */}
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
            style={{ background: 'rgba(201,162,39,0.18)', color: '#f0c93a', border: '1px solid rgba(201,162,39,0.35)' }}
          >
            <CheckCircle2 size={12} />
            Platform v1.0
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

      {/* ── Footer ── */}
      <footer
        className="border-t py-6"
        style={{ background: '#0f2240', borderColor: 'rgba(255,255,255,0.08)' }}
      >
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <img src={autoprovIcon} alt="" className="w-5 h-5 opacity-70 object-contain" />
            <span className="font-semibold text-slate-300">AutoProv Platform</span>
            <span className="text-slate-600">·</span>
            <span>Professional Automotive Compliance</span>
          </div>
          <span className="text-slate-500">Consumer Rights Act 2015 Compliant &mdash; © {new Date().getFullYear()} AutoProv</span>
        </div>
      </footer>

    </div>
  );
};

export default Landing;
