/**
 * OpeningSequence
 *
 * Cinematic "opening the office" screen shown while the 6 agents join.
 * Agents appear one-by-one using a self-managed stagger — the component
 * drives its own animation so it works even before WebSocket events arrive.
 *
 * Props:
 *   idea   {string}  — the user's startup idea text
 *   events {Array}   — agent_joined events from the WebSocket (used to
 *                      show the agent's live status line once it arrives)
 */
import { useEffect, useState } from 'react'
import { Building2, Search, Palette, Calculator, Megaphone, Crown } from 'lucide-react'

const AGENT_ORDER = ['CEO', 'Research', 'Product', 'Design', 'Finance', 'Marketing']

const AGENT_CONFIG = {
  CEO: {
    icon: Crown,
    title: 'Chief Executive Officer',
    description: 'Opening the office and briefing the founding team',
    color: 'text-violet-700 bg-violet-100',
    dot: 'bg-violet-500',
  },
  Research: {
    icon: Search,
    title: 'Market & Research',
    description: 'Scanning the competitive landscape',
    color: 'text-blue-700 bg-blue-100',
    dot: 'bg-blue-500',
  },
  Product: {
    icon: Building2,
    title: 'Product & Engineering',
    description: 'Evaluating MVP scope and technical feasibility',
    color: 'text-emerald-700 bg-emerald-100',
    dot: 'bg-emerald-500',
  },
  Design: {
    icon: Palette,
    title: 'Brand & Design',
    description: 'Defining brand direction and UX principles',
    color: 'text-pink-700 bg-pink-100',
    dot: 'bg-pink-500',
  },
  Finance: {
    icon: Calculator,
    title: 'Finance & Legal',
    description: 'Running cost model and compliance checks',
    color: 'text-orange-700 bg-orange-100',
    dot: 'bg-orange-500',
  },
  Marketing: {
    icon: Megaphone,
    title: 'Marketing & Investor Relations',
    description: 'Crafting go-to-market and investor narrative',
    color: 'text-indigo-700 bg-indigo-100',
    dot: 'bg-indigo-500',
  },
}

// Stagger delay between each agent card appearing (ms)
const STAGGER_MS = 750

export default function OpeningSequence({ idea, events = [] }) {
  // How many agents are currently visible (grows over time)
  const [visibleCount, setVisibleCount] = useState(0)

  // Start revealing agents on mount, one every STAGGER_MS
  useEffect(() => {
    const timers = []
    AGENT_ORDER.forEach((_, i) => {
      timers.push(
        setTimeout(() => setVisibleCount(i + 1), (i + 1) * STAGGER_MS)
      )
    })
    return () => timers.forEach(clearTimeout)
  }, [])

  // Build a map of agent_name → live status from WebSocket events
  const liveStatus = {}
  events.forEach(e => {
    if (e.agent_name) liveStatus[e.agent_name] = e.status
  })

  const visibleAgents = AGENT_ORDER.slice(0, visibleCount)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-xl mx-auto">

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-800 px-4 py-1.5 rounded-full text-sm font-medium mb-5">
            <span className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-pulse" />
            New company formation
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Opening the office
          </h1>

          {/* Idea card */}
          <div className="bg-white border border-gray-200 rounded-xl px-6 py-4 shadow-sm">
            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1.5">Your idea</p>
            <p className="text-gray-900 font-medium leading-snug">"{idea}"</p>
          </div>
        </div>

        {/* ── Agent cards ─────────────────────────────────────────────── */}
        <div className="space-y-3">
          {visibleAgents.map((agentName) => {
            const cfg = AGENT_CONFIG[agentName]
            const Icon = cfg.icon
            const status = liveStatus[agentName] || cfg.description

            return (
              <div
                key={agentName}
                className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex items-center gap-4 shadow-sm animate-slide-up"
              >
                {/* Icon badge */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${cfg.color}`}>
                  <Icon className="w-5 h-5" />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-900">{cfg.title}</p>
                  <p className="text-xs text-gray-500 truncate">{status}</p>
                </div>

                {/* Online dot */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className={`w-2 h-2 rounded-full animate-pulse ${cfg.dot}`} />
                  <span className="text-xs font-medium text-gray-500">Active</span>
                </div>
              </div>
            )
          })}

          {/* Placeholder cards for agents not yet visible */}
          {AGENT_ORDER.slice(visibleCount).map((agentName) => (
            <div
              key={agentName}
              className="bg-gray-50 border border-dashed border-gray-200 rounded-xl px-5 py-4 flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/3" />
                <div className="h-2.5 bg-gray-100 rounded animate-pulse w-1/2" />
              </div>
            </div>
          ))}
        </div>

        {/* ── Footer pulse ────────────────────────────────────────────── */}
        <div className="mt-8 flex items-center justify-center gap-1.5">
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 120}ms` }}
            />
          ))}
        </div>
        <p className="mt-3 text-center text-xs text-gray-400">
          Your founding team is assembling…
        </p>

      </div>
    </div>
  )
}
