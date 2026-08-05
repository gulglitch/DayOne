/**
 * mockWebSocket.js
 *
 * A lightweight Socket.IO-compatible mock for local development and demo purposes.
 * Simulates the full 6-agent boardroom event stream without a live backend.
 *
 * When the real backend is ready, replace this import in CompanyPage.jsx:
 *   import { io } from '../lib/mockWebSocket'   ← mock
 *   import { io } from 'socket.io-client'        ← real
 *
 * Event types emitted (matching the backend WebSocket contract):
 *   agent_joined     → { agent_name, status, timestamp }
 *   agent_posted     → { agent_name, message, findings?, timestamp }
 *   challenge_raised → { raised_by, target_agent, challenge_type, reason, details, timestamp }
 *   resolution_made  → { decision_type, decision, rationale, timestamp }
 *   run_complete     → {}
 */

const MOCK_DELAY_MS = 1200 // ms between events — adjust to taste

// ---------------------------------------------------------------------------
// Mock event sequence
// ---------------------------------------------------------------------------
function buildMockEvents(idea = 'a startup idea') {
  const ts = () => new Date().toISOString()

  return [
    // ── Opening sequence ──────────────────────────────────────────────────
    { event: 'agent_joined', data: { agent_name: 'CEO', status: 'Opening the office and briefing the founding team.', timestamp: ts() } },
    { event: 'agent_joined', data: { agent_name: 'Research', status: 'Scanning the competitive landscape.', timestamp: ts() } },
    { event: 'agent_joined', data: { agent_name: 'Product', status: 'Evaluating MVP scope and technical feasibility.', timestamp: ts() } },
    { event: 'agent_joined', data: { agent_name: 'Design', status: 'Defining brand direction and UX principles.', timestamp: ts() } },
    { event: 'agent_joined', data: { agent_name: 'Finance', status: 'Running cost and revenue model validation.', timestamp: ts() } },
    { event: 'agent_joined', data: { agent_name: 'Marketing', status: 'Crafting go-to-market and investor narrative.', timestamp: ts() } },

    // ── Round 1: Research + Product ───────────────────────────────────────
    {
      event: 'agent_posted',
      data: {
        agent_name: 'CEO',
        message: `Alright team — the idea on the table is: "${idea}". Research and Product, you're up first. Give me the landscape and tell me what we can actually ship.`,
        timestamp: ts(),
      },
    },
    {
      event: 'agent_posted',
      data: {
        agent_name: 'Research',
        message: 'Competitive analysis complete. The space has established players but meaningful whitespace exists.',
        findings: 'Market is growing at ~22% YoY. Dominant players optimise for breadth; no one owns the trusted, niche vertical. UVP opportunity: verified, community-specific matching vs. generic aggregation.',
        timestamp: ts(),
      },
    },
    {
      event: 'agent_posted',
      data: {
        agent_name: 'Product',
        message: 'MVP is scoped. Core loop: user profile → curated listing feed → direct apply. Recommendation engine is a round-2 feature.',
        findings: 'Stack: Next.js frontend, FastAPI backend, PostgreSQL. Estimated 4-week MVP build with 2 engineers. Matching engine would add 3+ weeks — recommend cutting for launch.',
        timestamp: ts(),
      },
    },

    // ── Round 2: Design + Finance challenge ───────────────────────────────
    {
      event: 'agent_posted',
      data: {
        agent_name: 'Design',
        message: 'Brand direction locked. Positioning: "the trusted insider network, not another job board."',
        findings: 'Brand names shortlist: Verified, Insider, Anchor, TrustBoard. Recommend Anchor — memorable, transferable, clean. Color: deep navy + warm cream. Typeface: Inter.',
        timestamp: ts(),
      },
    },
    {
      event: 'challenge_raised',
      data: {
        raised_by: 'Finance',
        target_agent: 'Product',
        challenge_type: 'pricing_conflict',
        reason: 'Proposed freemium-to-$15/mo consumer model will not clear CAC for this audience.',
        details: 'Student LTV is low and churn is high. At $15/mo with a 6-month average retention, blended LTV is ~$72. Estimated CAC via paid channels is $90–120. The unit economics are upside-down from day one.',
        timestamp: ts(),
      },
    },
    {
      event: 'agent_posted',
      data: {
        agent_name: 'Finance',
        message: 'The consumer freemium model doesn\'t work at this CAC. I\'m recommending a B2B university licensing model instead.',
        findings: 'University SaaS: $8K–$25K/yr per institution. 10 universities = $80K–$250K ARR with a single sales cycle. Compare to ~14,000 paying students needed for the same revenue at $15/mo.',
        timestamp: ts(),
      },
    },

    // ── CEO Resolution (the "wow moment") ─────────────────────────────────
    {
      event: 'resolution_made',
      data: {
        decision_type: 'CEO Overrule',
        decision: 'Consumer freemium is cut. We ship university B2B licensing at $12K/yr as the primary revenue model. Matching engine is deferred post-launch. Manual curated listings + verification goes live in MVP.',
        rationale: 'Finance\'s numbers are correct — the consumer CAC doesn\'t work. University licensing gives us a defensible revenue base and the institutional trust signal that makes the brand positioning credible.',
        timestamp: ts(),
      },
    },

    // ── Round 3: Marketing wraps ──────────────────────────────────────────
    {
      event: 'agent_posted',
      data: {
        agent_name: 'Marketing',
        message: 'GTM and investor narrative ready. The B2B pivot actually strengthens the story.',
        findings: 'Launch strategy: 3 pilot universities via warm intros, co-branded launch ("Powered by Anchor"), PR angle is "universities fight back against generic job boards." Seed raise narrative: B2B SaaS with institutional distribution moat.',
        timestamp: ts(),
      },
    },
    {
      event: 'agent_posted',
      data: {
        agent_name: 'CEO',
        message: 'Company formation complete. Dossier is being compiled now.',
        timestamp: ts(),
      },
    },

    // ── Done ──────────────────────────────────────────────────────────────
    { event: 'run_complete', data: {} },
  ]
}

// ---------------------------------------------------------------------------
// Mock socket factory — mirrors the socket.io-client API surface used in the app
// ---------------------------------------------------------------------------
export function io(_url, _opts) {
  const listeners = {}
  let cancelled = false
  const timers = []

  const socket = {
    /** Register an event listener */
    on(event, handler) {
      listeners[event] = handler
      return socket
    },

    /** Emit to the mock server (ignored except for join_run which seeds the idea) */
    emit(event, data) {
      if (event === 'join_run') {
        socket._runId = data
      }
    },

    /** Clean up all pending timers */
    disconnect() {
      cancelled = true
      timers.forEach(clearTimeout)
    },

    _runId: null,
  }

  // Kick off the event sequence after a short initial delay
  setTimeout(() => {
    const events = buildMockEvents(socket._idea || 'your startup idea')
    let cumulativeDelay = 500

    events.forEach(({ event, data }) => {
      const t = setTimeout(() => {
        if (cancelled) return
        const handler = listeners[event]
        if (handler) handler(data)
      }, cumulativeDelay)

      timers.push(t)
      cumulativeDelay += MOCK_DELAY_MS
    })
  }, 100)

  return socket
}
