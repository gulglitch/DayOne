/**
 * API client for Day One backend.
 *
 * Base URL is read from the VITE_API_URL env var (set in .env.local).
 * Falls back to localhost:8000 for local development.
 *
 * When VITE_USE_MOCK=true (or the backend is unreachable), all calls
 * return mock data so the frontend works standalone for demos.
 *
 * Backend endpoints (FastAPI):
 *   POST   /api/runs                 → create a new company run
 *   GET    /api/runs/:id             → fetch run status + metadata
 *   GET    /api/runs/:id/dossier     → fetch compiled dossier
 *   GET    /api/runs/:id/events      → fetch full event transcript (replay)
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

// ---------------------------------------------------------------------------
// Mock data — used when VITE_USE_MOCK=true or backend is unreachable
// ---------------------------------------------------------------------------

/** Generates a short unique-ish ID for mock runs */
function mockId() {
  return Math.random().toString(36).slice(2, 10)
}

const MOCK_RUN_STORE = {}

function mockCreateRun(payload) {
  const id = mockId()
  MOCK_RUN_STORE[id] = {
    id,
    idea_text: payload.idea_text,
    target_market: payload.target_market || '',
    business_type: payload.business_type || '',
    status: 'running',
    created_at: new Date().toISOString(),
    completed_at: null,
  }
  return id
}

function mockGetRun(runId) {
  return (
    MOCK_RUN_STORE[runId] || {
      id: runId,
      idea_text: 'A platform that helps university students find internships',
      target_market: 'students',
      business_type: 'saas',
      status: 'running',
      created_at: new Date().toISOString(),
      completed_at: null,
    }
  )
}

function mockGetDossier() {
  return {
    company_name: 'Anchor',
    strategy: {
      startup_summary: 'Anchor is a verified, university-branded internship portal that replaces generic job boards with trusted, institution-backed listings.',
      problem_statement: 'Generic job boards don\'t verify listings or profiles. Students can\'t trust what they see, and universities can\'t control their brand or career outcomes data.',
      target_audience: 'University students seeking internships and the career centers that serve them.',
      audience_tags: ['University students', 'Career centers', 'Campus recruiters'],
      competitors: [
        { name: 'Handshake', weakness: 'Broad and impersonal — no institutional ownership' },
        { name: 'LinkedIn', weakness: 'Optimised for professionals, overwhelming for students' },
        { name: 'Indeed', weakness: 'Zero verification, high noise-to-signal ratio' },
      ],
      uvp: 'The only internship portal where your university vouches for every listing and every applicant — verified trust on both sides.',
      revenue_model: 'B2B SaaS — university licensing',
      pricing: '$12,000 / yr per institution',
      year1_target: '$120K ARR (10 university accounts)',
    },
    product: {
      mvp_definition: 'Core loop: student profile → verified listing feed → one-click apply. No recommendation engine, no in-app chat.',
      mvp_features: [
        'Student onboarding + profile creation (< 2 min)',
        'University admin portal for listing management',
        'Verified listing feed with filters',
        'Apply flow with status tracking',
        'Institution co-branding per portal',
      ],
      cut_features: [
        'AI recommendation / matching engine',
        'In-app student ↔ recruiter messaging',
        'Analytics dashboard for students',
        'Mobile app (web-first for MVP)',
      ],
      roadmap: [
        { phase: 'Phase 1 — Launch', timeline: 'Weeks 1–4', items: ['Student profiles', 'Curated listing feed', 'Verification flow', 'Apply tracking'] },
        { phase: 'Phase 2 — Growth', timeline: 'Weeks 5–10', items: ['Institution analytics', 'Admin dashboard v2', 'Email notifications'] },
        { phase: 'Phase 3 — Moat', timeline: 'Week 11+', items: ['Recommendation engine', 'University API', 'Mobile app'] },
      ],
    },
    tech: {
      frontend: 'React + Vite + Tailwind CSS',
      backend: 'FastAPI (Python 3.12)',
      database: 'PostgreSQL on Supabase',
      auth: 'Clerk (student SSO via university email)',
      hosting: 'Vercel (frontend) + Render (backend)',
      cdn: 'Cloudflare R2 for file storage',
      system_architecture: 'React SPA talks to a FastAPI REST API. Auth is stateless JWT issued by Clerk. All writes go through a schema-validated service layer before hitting Postgres. Background jobs (email, verification webhooks) run via async Celery workers backed by Redis.',
      db_tables: [
        'users              — profile, university, verification status',
        'listings           — company, role, tags, status, university_id',
        'applications       — user_id ↔ listing_id join + status',
        'institutions       — B2B account, seat count, branding config',
        'audit_events       — append-only activity log',
      ],
      key_decisions: [
        'OpenAPI contract defined before any frontend work begins',
        'Row-level security in Postgres for multi-tenant data isolation',
        'Optimistic UI updates with server validation fallback',
        'Feature flags (LaunchDarkly) for phased post-MVP rollout',
      ],
    },
    brand: {
      name_options: ['Anchor', 'Verified', 'Insider', 'TrustBoard'],
      positioning: '"The trusted insider network — not another job board." Built for a specific community, vouched for by the institution they already trust.',
      primary_color: 'Deep navy (#0F172A)',
      accent_color: 'Warm cream (#FEFCE8)',
      typeface: 'Inter — geometric sans, single weight',
      logo_direction: 'Wordmark only — clean, no abstract icon. Lowercase "anchor." in navy.',
      tone: 'Confident, credible, insider',
      ux_principles: [
        'Verification badge is always visible — trust is the product',
        'Apply in one tap from the listing card',
        'Institution portal is dead simple — admins aren\'t power users',
        'Mobile-first: students check this between lectures',
      ],
    },
    gtm: {
      strategy: 'Land 3 pilot universities via warm intros through career center networks. Co-branded launch creates a trust signal from day one and generates press coverage in higher-ed media.',
      channels: ['Career center partnerships', 'Campus ambassador program', 'Higher-ed press', 'University LinkedIn pages'],
      launch_checklist: [
        'Sign 2–3 university pilot agreements (paid or revenue-share)',
        'Build co-branded student portal for each pilot institution',
        'Seed 50+ verified listings before opening student signups',
        'Student onboarding flow under 2 minutes, tested with 10 real students',
        'Draft outreach sequence for campus career center directors',
        'Set up basic analytics: signups, apply-clicks, WAU per institution',
      ],
      investor_summary: 'B2B SaaS platform targeting the $2.4B university career services market. Institutional distribution moat: once a university signs, their students default to the platform. Blended LTV/CAC >3× at 10 pilot accounts. Raising $600K seed to reach $120K ARR and 10 university contracts in 18 months.',
      primary_metric: 'University accounts signed',
      activation_metric: 'Student profiles verified per institution',
      retention_metric: 'Annual contract renewal rate',
      revenue_metric: 'ARR',
    },
    pitch: {
      elevator_pitch: 'We\'re building Anchor — a verified insider network for university students. Think LinkedIn, but your university vouches for every listing and every profile. Universities pay $12K/yr for a co-branded portal their students actually trust. We\'re launching with 3 pilot institutions next semester.',
      problem_one_liner: 'Generic job boards don\'t verify anything — students can\'t trust the listings and universities can\'t control their career outcomes brand.',
      solution_one_liner: 'A university-branded, verified internship portal that institutions own, control, and students trust over any generic alternative.',
      why_now: 'Gen Z distrust of generic platforms is at an all-time high. Universities face mounting pressure to show tangible career ROI after years of tuition increases. No one has built the institutional trust layer yet.',
      raise_amount: '$600K seed',
      use_of_funds: '50% engineering · 30% sales · 20% ops',
      runway: '18 months',
      milestone: '10 university accounts · $120K ARR',
    },
  }
}

// ---------------------------------------------------------------------------
// Generic fetch wrapper
// ---------------------------------------------------------------------------
async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(body || `Request failed: ${res.status}`)
  }
  return res.json()
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Create a new company run.
 * @param {{ idea_text: string, target_market?: string, business_type?: string }} payload
 * @returns {Promise<string>} runId
 */
export async function createRun(payload) {
  if (USE_MOCK) return mockCreateRun(payload)
  try {
    const data = await request('/api/runs', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    return data.id
  } catch {
    // Fallback to mock if backend is unreachable
    return mockCreateRun(payload)
  }
}

/**
 * Fetch run metadata and status.
 * @param {string} runId
 * @returns {Promise<object>}
 */
export async function getRun(runId) {
  if (USE_MOCK) return mockGetRun(runId)
  try {
    return await request(`/api/runs/${runId}`)
  } catch {
    return mockGetRun(runId)
  }
}

/**
 * Fetch the compiled company dossier once a run is complete.
 * @param {string} runId
 * @returns {Promise<object>}
 */
export async function getDossier(runId) {
  if (USE_MOCK) return mockGetDossier(runId)
  try {
    return await request(`/api/runs/${runId}/dossier`)
  } catch {
    return mockGetDossier(runId)
  }
}

/**
 * Fetch the full event transcript for a completed run (replay feature).
 * @param {string} runId
 * @returns {Promise<Array>}
 */
export async function getEvents(runId) {
  if (USE_MOCK) return []
  try {
    return await request(`/api/runs/${runId}/events`)
  } catch {
    return []
  }
}
