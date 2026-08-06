import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Building2,
  Target,
  Code2,
  Palette,
  TrendingUp,
  Presentation,
  Copy,
  Download,
  CheckCircle,
  RotateCcw,
  ChevronRight,
  DollarSign,
  Users,
  Zap,
  Globe,
  Shield,
  BarChart3,
  Layers,
  Map,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Tab configuration (maps to dossier section keys from the backend)
// ---------------------------------------------------------------------------
const TABS = [
  { id: 'strategy', label: 'Strategy', icon: Target },
  { id: 'product', label: 'Product', icon: Layers },
  { id: 'tech', label: 'Tech', icon: Code2 },
  { id: 'brand', label: 'Brand', icon: Palette },
  { id: 'gtm', label: 'Go-to-Market', icon: TrendingUp },
  { id: 'pitch', label: 'Pitch', icon: Presentation },
]

// ---------------------------------------------------------------------------
// Shared sub-components
// ---------------------------------------------------------------------------

function TabButton({ tab, isActive, onClick }) {
  const Icon = tab.icon
  return (
    <button
      onClick={() => onClick(tab.id)}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap
        ${isActive
          ? 'bg-violet-600 text-white shadow-sm'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        }`}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      {tab.label}
    </button>
  )
}

function SectionCard({ title, icon: Icon, children, accent = false }) {
  return (
    <div className={`rounded-xl border p-6 ${accent
      ? 'bg-violet-50 border-violet-200'
      : 'bg-white border-gray-200'
      }`}>
      {title && (
        <div className="flex items-center gap-2 mb-4">
          {Icon && <Icon className={`w-4 h-4 ${accent ? 'text-violet-600' : 'text-violet-500'}`} />}
          <h3 className={`font-semibold text-base ${accent ? 'text-violet-900' : 'text-gray-900'}`}>
            {title}
          </h3>
        </div>
      )}
      {children}
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between items-start py-2.5 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500 flex-shrink-0 mr-4">{label}</span>
      <span className="text-sm font-medium text-gray-900 text-right">{value || '—'}</span>
    </div>
  )
}

function TagList({ items = [], color = 'violet' }) {
  const colorMap = {
    violet: 'bg-violet-100 text-violet-800',
    green: 'bg-green-100 text-green-800',
    blue: 'bg-blue-100 text-blue-800',
    amber: 'bg-amber-100 text-amber-800',
    gray: 'bg-gray-100 text-gray-700',
  }
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, i) => (
        <span key={i} className={`text-xs font-medium px-2.5 py-1 rounded-full ${colorMap[color] || colorMap.gray}`}>
          {item}
        </span>
      ))}
    </div>
  )
}

function CheckList({ items = [] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
          {item}
        </li>
      ))}
    </ul>
  )
}

// ---------------------------------------------------------------------------
// Tab content panels
// ---------------------------------------------------------------------------

function StrategyTab({ data }) {
  const d = data?.strategy || {}
  return (
    <div className="grid md:grid-cols-2 gap-5">
      <SectionCard title="Startup Summary" icon={Building2}>
        <p className="text-sm text-gray-700 leading-relaxed">
          {d.startup_summary || 'A focused product solving a real problem in an underserved market.'}
        </p>
      </SectionCard>

      <SectionCard title="Problem Statement" icon={Zap}>
        <p className="text-sm text-gray-700 leading-relaxed">
          {d.problem_statement || 'Existing solutions are too generic and don\'t serve the niche well.'}
        </p>
      </SectionCard>

      <SectionCard title="Target Audience" icon={Users}>
        <p className="text-sm text-gray-700 mb-3">
          {d.target_audience || 'Early adopters in a defined, reachable segment.'}
        </p>
        {d.audience_tags && <TagList items={d.audience_tags} color="blue" />}
      </SectionCard>

      <SectionCard title="Competitor Landscape" icon={BarChart3}>
        <div className="space-y-2">
          {(d.competitors || [
            { name: 'Competitor A', weakness: 'Too broad, low trust signal' },
            { name: 'Competitor B', weakness: 'Enterprise-only pricing' },
          ]).map((c, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-gray-900">{c.name}</span>
                {c.weakness && <span className="text-gray-500"> — {c.weakness}</span>}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Unique Value Proposition" icon={Target} accent>
        <p className="text-sm text-violet-800 leading-relaxed font-medium">
          {d.uvp || 'The only platform built specifically for this audience, with verified, trusted listings and community accountability.'}
        </p>
      </SectionCard>

      <SectionCard title="Revenue Model" icon={DollarSign}>
        <div className="space-y-1">
          <InfoRow label="Model" value={d.revenue_model || 'B2B SaaS'} />
          <InfoRow label="Pricing" value={d.pricing || '$12,000/yr per institution'} />
          <InfoRow label="Year 1 target" value={d.year1_target || '$120K ARR (10 accounts)'} />
        </div>
      </SectionCard>
    </div>
  )
}

function ProductTab({ data }) {
  const d = data?.product || {}
  return (
    <div className="grid md:grid-cols-2 gap-5">
      <SectionCard title="MVP Definition" icon={Zap}>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          {d.mvp_definition || 'Core user loop only: onboarding, curated listings, and verified apply flow.'}
        </p>
        {d.mvp_features && <CheckList items={d.mvp_features} />}
      </SectionCard>

      <SectionCard title="What's Cut (Post-MVP)" icon={Shield}>
        <div className="space-y-2">
          {(d.cut_features || ['AI recommendation engine', 'In-app messaging', 'Analytics dashboard']).map((f, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
              <span className="w-4 h-4 flex items-center justify-center rounded-full bg-red-100 text-red-500 text-xs font-bold flex-shrink-0">✕</span>
              {f}
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Product Roadmap" icon={Map} className="md:col-span-2">
        <div className="space-y-3">
          {(d.roadmap || [
            { phase: 'Phase 1 — Launch', timeline: 'Weeks 1–4', items: ['User profiles', 'Curated listing feed', 'Verification flow', 'Apply button'] },
            { phase: 'Phase 2 — Growth', timeline: 'Weeks 5–10', items: ['Analytics for institutions', 'Admin dashboard', 'Email notifications'] },
            { phase: 'Phase 3 — Moat', timeline: 'Week 11+', items: ['Recommendation engine', 'API for universities', 'Mobile app'] },
          ]).map((phase, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm text-gray-900">{phase.phase}</span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{phase.timeline}</span>
              </div>
              <TagList items={phase.items} color="gray" />
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}

function TechTab({ data }) {
  const d = data?.tech || {}
  return (
    <div className="grid md:grid-cols-2 gap-5">
      <SectionCard title="Recommended Stack" icon={Code2}>
        <div className="space-y-1">
          <InfoRow label="Frontend" value={d.frontend || 'Next.js + Tailwind CSS'} />
          <InfoRow label="Backend" value={d.backend || 'FastAPI (Python)'} />
          <InfoRow label="Database" value={d.database || 'PostgreSQL (Supabase)'} />
          <InfoRow label="Auth" value={d.auth || 'Clerk / NextAuth.js'} />
          <InfoRow label="Hosting" value={d.hosting || 'Vercel + Render'} />
          <InfoRow label="CDN/Files" value={d.cdn || 'Cloudflare / S3'} />
        </div>
      </SectionCard>

      <SectionCard title="System Architecture" icon={Layers}>
        <p className="text-sm text-gray-700 leading-relaxed">
          {d.system_architecture ||
            'Client-server SPA. Next.js frontend talks to a FastAPI REST backend. Auth is stateless JWT. All user-facing writes go through a validation layer before hitting Postgres. Background jobs (email, verification) run via async task queue.'}
        </p>
      </SectionCard>

      <SectionCard title="Database Architecture" icon={BarChart3}>
        <div className="space-y-2">
          {(d.db_tables || [
            'users — profile + verification status',
            'listings — company, role, tags, status',
            'applications — user ↔ listing join with status',
            'institutions — B2B account + seat count',
            'events — audit log',
          ]).map((t, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
              <span className="w-1.5 h-1.5 bg-violet-400 rounded-full flex-shrink-0" />
              <code className="font-mono text-xs text-gray-800">{t}</code>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Key Technical Decisions" icon={Zap}>
        <CheckList items={d.key_decisions || [
          'Schema-first API contracts (OpenAPI) before any frontend work',
          'Row-level security in Postgres for multi-tenant isolation',
          'Optimistic UI updates with server-side validation fallback',
          'Feature flags for phased rollout of post-MVP features',
        ]} />
      </SectionCard>
    </div>
  )
}

function BrandTab({ data }) {
  const d = data?.brand || {}
  return (
    <div className="grid md:grid-cols-2 gap-5">
      <SectionCard title="Brand Name Options" icon={Palette} accent>
        <div className="space-y-2">
          {(d.name_options || ['Anchor', 'Verified', 'Insider', 'TrustBoard']).map((name, i) => (
            <div key={i} className={`flex items-center gap-3 p-3 rounded-lg border ${i === 0 ? 'border-violet-300 bg-white' : 'border-gray-100 bg-white/60'}`}>
              {i === 0 && (
                <span className="text-xs font-semibold text-violet-600 bg-violet-100 px-2 py-0.5 rounded">
                  Recommended
                </span>
              )}
              <span className={`font-semibold ${i === 0 ? 'text-violet-700 text-lg' : 'text-gray-700'}`}>
                {name}
              </span>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Brand Positioning" icon={Target}>
        <p className="text-sm text-gray-700 leading-relaxed">
          {d.positioning || '"The insider network, not another job board." Trusted, verified, and built specifically for this community — not a watered-down version of a generic platform.'}
        </p>
      </SectionCard>

      <SectionCard title="Visual Identity" icon={Globe}>
        <div className="space-y-1">
          <InfoRow label="Primary color" value={d.primary_color || 'Deep navy (#0F172A)'} />
          <InfoRow label="Accent color" value={d.accent_color || 'Warm cream (#FEFCE8)'} />
          <InfoRow label="Typeface" value={d.typeface || 'Inter (geometric sans)'} />
          <InfoRow label="Logo direction" value={d.logo_direction || 'Wordmark — clean, single weight, no icon'} />
          <InfoRow label="Tone" value={d.tone || 'Confident, credible, insider'} />
        </div>
      </SectionCard>

      <SectionCard title="UX Principles" icon={Zap}>
        <CheckList items={d.ux_principles || [
          'Verification status is always visible — trust is the core currency',
          'Reduce friction to apply: one-tap from listing to application',
          'Institution dashboard is simple, not a CRM — admins aren\'t power users',
          'Mobile-first: students live on their phones',
        ]} />
      </SectionCard>
    </div>
  )
}

function GtmTab({ data }) {
  const d = data?.gtm || {}
  return (
    <div className="grid md:grid-cols-2 gap-5">
      <SectionCard title="Go-to-Market Strategy" icon={TrendingUp}>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          {d.strategy || 'Land 3 pilot universities via warm intros. Co-branded launch gives institutional credibility from day one. Expand through word-of-mouth within university networks.'}
        </p>
        {d.channels && <TagList items={d.channels} color="green" />}
      </SectionCard>

      <SectionCard title="Launch Checklist" icon={CheckCircle}>
        <CheckList items={d.launch_checklist || [
          'Sign 2–3 university pilot agreements (paid or free trial)',
          'Build co-branded landing pages for each institution',
          'Seed 50+ verified listings before invite-only beta',
          'Ship student onboarding in under 2 minutes',
          'Draft outreach template for campus career centers',
          'Set up basic analytics (signups, apply-clicks, WAU)',
        ]} />
      </SectionCard>

      <SectionCard title="Investor Summary" icon={BarChart3} accent>
        <p className="text-sm text-violet-800 leading-relaxed">
          {d.investor_summary ||
            'B2B SaaS platform targeting a $2.4B university career services market. Defensible distribution moat through institutional partnerships. Blended LTV/CAC >3x at 10 pilot institutions. Seed-stage raise of $600K to fund 18 months of runway and 5 university accounts.'}
        </p>
      </SectionCard>

      <SectionCard title="Key Metrics to Track" icon={BarChart3}>
        <div className="space-y-1">
          <InfoRow label="Primary" value={d.primary_metric || 'Institutions signed'} />
          <InfoRow label="Activation" value={d.activation_metric || 'Student profiles verified / institution'} />
          <InfoRow label="Retention" value={d.retention_metric || 'Contract renewal rate (annual)'} />
          <InfoRow label="Revenue" value={d.revenue_metric || 'ARR'} />
        </div>
      </SectionCard>
    </div>
  )
}

function PitchTab({ data, onCopyPitch }) {
  const d = data?.pitch || {}
  const elevatorPitch = d.elevator_pitch ||
    'We\'re building the verified insider network for university students — think LinkedIn, but your university vouches for every listing and every profile. Universities pay $12K/yr for a co-branded portal; students apply for free. We\'re launching with 3 pilots next semester.'

  return (
    <div className="space-y-5">
      {/* Hero elevator pitch */}
      <SectionCard title="Elevator Pitch" icon={Presentation} accent>
        <p className="text-violet-800 leading-relaxed text-base font-medium mb-4">
          "{elevatorPitch}"
        </p>
        <button
          onClick={() => onCopyPitch(elevatorPitch)}
          className="flex items-center gap-2 text-sm text-violet-700 hover:text-violet-900 font-medium transition-colors"
        >
          <Copy className="w-4 h-4" />
          Copy to clipboard
        </button>
      </SectionCard>

      <div className="grid md:grid-cols-2 gap-5">
        <SectionCard title="The Problem (one line)" icon={Zap}>
          <p className="text-sm text-gray-700">
            {d.problem_one_liner || 'Generic job boards don\'t verify anything — students can\'t trust them and universities can\'t control their brand.'}
          </p>
        </SectionCard>

        <SectionCard title="The Solution (one line)" icon={Target}>
          <p className="text-sm text-gray-700">
            {d.solution_one_liner || 'A university-branded, verified internship portal that institutions own and students trust.'}
          </p>
        </SectionCard>

        <SectionCard title="Why Now" icon={TrendingUp}>
          <p className="text-sm text-gray-700">
            {d.why_now || 'Gen Z demand for trusted, niche platforms over generic aggregators is measurably growing. Universities are under pressure to show tangible career outcomes after years of tuition increases.'}
          </p>
        </SectionCard>

        <SectionCard title="The Ask" icon={DollarSign}>
          <div className="space-y-1">
            <InfoRow label="Raising" value={d.raise_amount || '$600K seed'} />
            <InfoRow label="Use of funds" value={d.use_of_funds || '50% eng, 30% sales, 20% ops'} />
            <InfoRow label="Runway" value={d.runway || '18 months'} />
            <InfoRow label="Milestone" value={d.milestone || '10 university accounts, $120K ARR'} />
          </div>
        </SectionCard>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main DossierView component
// ---------------------------------------------------------------------------
export default function DossierView({ runData, dossierData, runId }) {
  const [activeTab, setActiveTab] = useState('strategy')
  const [pitchCopied, setPitchCopied] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  const navigate = useNavigate()

  const companyName = dossierData?.brand?.name_options?.[0]
    || dossierData?.company_name
    || 'Your Company'

  const handleCopyPitch = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setPitchCopied(true)
      setTimeout(() => setPitchCopied(false), 2500)
    } catch {
      /* clipboard blocked */
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2500)
    } catch {
      /* clipboard blocked */
    }
  }

  const handleExport = () => {
    const blob = new Blob(
      [JSON.stringify({ company: companyName, idea: runData?.idea_text, dossier: dossierData, generated_at: new Date().toISOString() }, null, 2)],
      { type: 'application/json' }
    )
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${companyName.toLowerCase().replace(/\s+/g, '-')}-dossier.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'strategy': return <StrategyTab data={dossierData} />
      case 'product': return <ProductTab data={dossierData} />
      case 'tech': return <TechTab data={dossierData} />
      case 'brand': return <BrandTab data={dossierData} />
      case 'gtm': return <GtmTab data={dossierData} />
      case 'pitch': return <PitchTab data={dossierData} onCopyPitch={handleCopyPitch} />
      default: return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Top nav ──────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          {/* Left: back + title */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => navigate(`/company/${runId}`)}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              Boardroom
            </button>
            <span className="text-gray-300">|</span>
            <div className="min-w-0">
              <h1 className="font-bold text-gray-900 text-lg leading-tight truncate">
                {companyName}
              </h1>
              {runData?.idea_text && (
                <p className="text-xs text-gray-500 truncate">
                  "{runData.idea_text}"
                </p>
              )}
            </div>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {linkCopied
                ? <><CheckCircle className="w-4 h-4 text-green-500" /> Copied</>
                : <><Copy className="w-4 h-4" /> Share</>
              }
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-2 text-sm bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              New
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div className="max-w-5xl mx-auto px-4 pb-3">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {TABS.map(tab => (
              <TabButton
                key={tab.id}
                tab={tab}
                isActive={activeTab === tab.id}
                onClick={setActiveTab}
              />
            ))}
          </div>
        </div>
      </header>

      {/* ── Completion banner ─────────────────────────────────────────────── */}
      <div className="bg-green-50 border-b border-green-100">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
          <p className="text-sm text-green-800">
            <span className="font-medium">Company formation complete.</span>{' '}
            Your founding team reached consensus in under 2 minutes.
          </p>
          {pitchCopied && (
            <span className="ml-auto text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded">
              Pitch copied!
            </span>
          )}
        </div>
      </div>

      {/* ── Tab content ───────────────────────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {renderTab()}
      </main>
    </div>
  )
}
