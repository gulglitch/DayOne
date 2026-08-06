import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { io } from '../lib/mockWebSocket'
import { getRun } from '../lib/api'
import LiveBoardroom from '../components/LiveBoardroom'
import OpeningSequence from '../components/OpeningSequence'

// The opening sequence shows until we receive the first non-join event
// (i.e. the CEO's first real message). After that, the boardroom takes over.
const BOARDROOM_TRIGGER_TYPES = ['agent_posted', 'challenge_raised', 'resolution_made']

export default function CompanyPage() {
  const [runData, setRunData] = useState(null)
  const [events, setEvents] = useState([])
  const [isComplete, setIsComplete] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const { runId } = useParams()
  const navigate = useNavigate()
  const socketRef = useRef(null)

  useEffect(() => {
    let cancelled = false

    const init = async () => {
      // 1. Fetch run metadata
      try {
        const data = await getRun(runId)
        if (cancelled) return
        setRunData(data)
        setIsLoading(false)

        // If already complete, jump straight to dossier
        if (data.status === 'completed') {
          navigate(`/company/${runId}/dossier`)
          return
        }

        // 2. Open WebSocket (or mock)
        const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000'
        const socket = io(wsUrl, { transports: ['websocket'] })
        socketRef.current = socket

        // Pass the idea text to the mock so its generated messages are idea-specific
        socket._idea = data.idea_text

        socket.emit('join_run', runId)

        socket.on('agent_joined', (event) => { if (!cancelled) setEvents(prev => [...prev, { ...event, type: 'agent_joined' }]) })
        socket.on('agent_posted', (event) => { if (!cancelled) setEvents(prev => [...prev, { ...event, type: 'agent_posted' }]) })
        socket.on('challenge_raised', (event) => { if (!cancelled) setEvents(prev => [...prev, { ...event, type: 'challenge_raised' }]) })
        socket.on('resolution_made', (event) => { if (!cancelled) setEvents(prev => [...prev, { ...event, type: 'resolution_made' }]) })
        socket.on('run_complete', () => {
          if (cancelled) return
          setIsComplete(true)
          // No auto-redirect — user clicks the CTA in LiveBoardroom
        })
        socket.on('error', (err) => {
          console.error('WebSocket error:', err)
          if (!cancelled) setError('Connection error. Please try again.')
        })
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load run.')
          setIsLoading(false)
        }
      }
    }

    init()

    return () => {
      cancelled = true
      socketRef.current?.disconnect()
    }
  }, [runId, navigate])

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-violet-600 mx-auto mb-4" />
          <p className="text-gray-600 text-sm">Loading company session…</p>
        </div>
      </div>
    )
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-sm">
          <p className="text-red-600 mb-5 font-medium">{error}</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Start Over
          </button>
        </div>
      </div>
    )
  }

  // Show the cinematic opening until the first real boardroom message arrives
  const showBoardroom = events.some(e => BOARDROOM_TRIGGER_TYPES.includes(e.type))
  const joinEvents = events.filter(e => e.type === 'agent_joined')

  return (
    <div className="min-h-screen bg-gray-50">
      {!showBoardroom ? (
        <OpeningSequence idea={runData?.idea_text} events={joinEvents} />
      ) : (
        <LiveBoardroom runData={runData} events={events} isComplete={isComplete} onViewDossier={() => navigate(`/company/${runId}/dossier`)} />
      )}
    </div>
  )
}
