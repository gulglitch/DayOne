/**
 * LiveBoardroom
 *
 * The core demo screen. Renders the streaming agent event feed in real time.
 *
 * Event types rendered:
 *   agent_posted     — normal agent message (white card, agent color accent)
 *   challenge_raised — amber warning card with raised-by → target badge
 *   resolution_made  — violet "CEO Overrule" card, full-width, visually dominant
 *
 * Props:
 *   runData    { idea_text, ... }   — run metadata
 *   events     Array                — all events including agent_joined
 *   isComplete boolean
 */
import { useEffect, useRef } from 'react'
import {
  Crown, Search, Building2, Palette, Calculator, Megaphone,
  AlertTriangle, CheckCircle, Clock, Gavel, ArrowRight,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Agent appearance config
// ---------------------------------------------------------------------------
const AGENT_ICON = {
  CEO: Crown,
  Research: Search,
  Product: Building2,
  Design: Palette,
  Finance: Calculator,
  Marketing: Megaphone,
}

const AGENT_STYLE = {
  CEO: { badge: 'bg-violet-100 text-violet-700 border-violet-200', dot: 'bg-violet-500' },
  Research: { badge: 'bg-blue-100   text-blue-700   border-blue-200', dot: 'bg-blue-500' },
  Product: { badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  Design: { badge: 'bg-pink-100   text-pink-700   border-pink-200', dot: 'bg-pink-500' },
  Finance: { badge: 'bg-orange-100 text-orange-700 border-orange-200', dot: 'bg-orange-500' },
  Marketing: { badge: 'bg-indigo-100 text-indigo-700 border-indigo-200', dot: 'bg-indigo-500' },
}

function agentStyle(name) { return AGENT_STYLE[name] || { badge: 'bg-gray-100 text-gray-700 border-gray-200', dot: 'bg-gray-400' } }
function AgentIcon({ name, size = 'w-4 h-4' }) {
  const Icon = AGENT_ICON[name] || Building2
  return <Icon className={size} />
}

// ---------------------------------------------------------------------------
// Event card components
// ---------------------------------------------------------------------------

function AgentPostedCard({ event }) {
  const style = agentStyle(event.agent_name)
  const ts = event.timestamp ? new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : ''

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 animate-slide-up">
      {/* Header row */}
      <div className="flex items-center gap-2.5 mb-3">
        <div className={`w-7 h-7 rounded-full border flex items-center justify-center flex-shrink-0 ${style.badge}`}>
          <AgentIcon name={event.agent_name} size="w-3.5 h-3.5" />
        </div>
        <span className="font-semibold text-sm text-gray-900">{event.agent_name}</span>
        {ts && (
          <span className="ml-auto flex items-center gap-1 text-xs text-gray-400">
            <Clock className="w-3 h-3" />
            {ts}
          </span>
        )}
      </div>

      {/* Message */}
      {event.message && (
        <p className="text-sm text-gray-700 leading-relaxed">{event.message}</p>
      )}

      {/* Findings block */}
      {event.findings && (
        <div className="mt-3 bg-gray-50 border border-gray-100 rounded-lg p-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Key findings</p>
          <p className="text-sm text-gray-700 leading-relaxed">{event.findings}</p>
        </div>
      )}
    </div>
  )
}

function ChallengeCard({ event }) {
  return (
    <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-sm text-amber-900">Challenge raised</span>
            <span className="text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full font-medium">
              {event.raised_by} → {event.target_agent}
            </span>
            {event.challenge_type && (
              <span className="text-xs bg-white border border-amber-300 text-amber-700 px-2 py-0.5 rounded-full">
                {event.challenge_type}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Reason */}
      <p className="text-sm font-semibold text-amber-800 mb-1">{event.reason}</p>
      {event.details && (
        <p className="text-sm text-amber-700 leading-relaxed">{event.details}</p>
      )}
    </div>
  )
}

function ResolutionCard({ event }) {
  return (
    <div className="relative bg-violet-600 rounded-xl p-5 animate-slide-up overflow-hidden">
      {/* Subtle texture */}
      <div className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white 0%, transparent 60%)' }} />

      {/* Header */}
      <div className="relative flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-full bg-white/20 border border-white/30 flex items-center justify-center flex-shrink-0">
          <Gavel className="w-4 h-4 text-white" />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-white text-sm">CEO Overrule</span>
          {event.decision_type && event.decision_type !== 'CEO Overrule' && (
            <span className="text-xs bg-white/20 text-white/90 px-2 py-0.5 rounded-full">
              {event.decision_type}
            </span>
          )}
        </div>
      </div>

      {/* Decision */}
      <p className="relative text-white font-semibold text-sm leading-relaxed mb-2">
        {event.decision}
      </p>

      {/* Rationale */}
      {event.rationale && (
        <p className="relative text-violet-200 text-sm leading-relaxed">
          {event.rationale}
        </p>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Header agent avatar row
// ---------------------------------------------------------------------------
function AgentAvatarRow({ activeAgents }) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {activeAgents.map(name => {
        const style = agentStyle(name)
        return (
          <div
            key={name}
            title={name}
            className={`w-7 h-7 rounded-full border flex items-center justify-center ${style.badge}`}
          >
            <AgentIcon name={name} size="w-3.5 h-3.5" />
          </div>
        )
      })}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function LiveBoardroom({ runData, events, isComplete, onViewDossier }) {
  const bottomRef = useRef(null)

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [events])

  const boardroomEvents = events.filter(e => e.type !== 'agent_joined')
  const activeAgents = [...new Set(
    events.filter(e => e.type === 'agent_joined').map(e => e.agent_name)
  )]

  const challengeCount = boardroomEvents.filter(e => e.type === 'challenge_raised').length
  const resolutionCount = boardroomEvents.filter(e => e.type === 'resolution_made').length

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* ── Sticky header ─────────────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-start justify-between gap-4">

          {/* Left: idea + agents */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <h1 className="font-bold text-gray-900 text-base">Founding team meeting</h1>
              {!isComplete && (
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  Live
                </span>
              )}
              {isComplete && (
                <span className="flex items-center gap-1 text-xs font-medium text-violet-700 bg-violet-50 border border-violet-200 px-2 py-0.5 rounded-full">
                  <CheckCircle className="w-3 h-3" />
                  Complete
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 truncate max-w-sm">
              "{runData?.idea_text}"
            </p>
          </div>

          {/* Right: avatar row + counters */}
          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            <AgentAvatarRow activeAgents={activeAgents} />
            {(challengeCount > 0 || resolutionCount > 0) && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                {challengeCount > 0 && (
                  <span className="flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-amber-500" />
                    {challengeCount} challenge{challengeCount > 1 ? 's' : ''}
                  </span>
                )}
                {resolutionCount > 0 && (
                  <span className="flex items-center gap-1">
                    <Gavel className="w-3 h-3 text-violet-500" />
                    {resolutionCount} resolution{resolutionCount > 1 ? 's' : ''}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── Feed ──────────────────────────────────────────────────────── */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6">
        <div className="space-y-3">

          {boardroomEvents.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3 animate-pulse">
                <Building2 className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">Founding team is getting ready…</p>
            </div>
          ) : (
            boardroomEvents.map((event, index) => {
              const key = `${event.type}-${index}`
              if (event.type === 'agent_posted') return <AgentPostedCard key={key} event={event} />
              if (event.type === 'challenge_raised') return <ChallengeCard key={key} event={event} />
              if (event.type === 'resolution_made') return <ResolutionCard key={key} event={event} />
              return null
            })
          )}

          {/* Completion CTA — user navigates manually */}
          {isComplete && (
            <div className="bg-white border-2 border-violet-200 rounded-xl p-6 text-center animate-slide-up shadow-sm">
              <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-violet-600" />
              </div>
              <p className="font-bold text-gray-900 text-base mb-1">
                Company formation complete
              </p>
              <p className="text-sm text-gray-500 mb-5">
                Your founding team reached consensus. The full dossier is ready.
              </p>
              <button
                onClick={onViewDossier}
                className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm px-6 py-3 rounded-lg transition-colors"
              >
                View company dossier
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </main>
    </div>
  )
}
