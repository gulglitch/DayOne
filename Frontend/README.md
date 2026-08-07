# Day One — Frontend

Next.js 16 (App Router) + TypeScript + Tailwind v4 + Framer Motion + Lenis.

## Run it

```bash
npm install
npm run dev
```

Opens on http://localhost:3000. It expects the backend
(`backend/app/main.py`, uvicorn) running on http://localhost:8000 — set a
different URL in `.env.local` if needed:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Pages

- `/` — landing page (idea intake form → `POST /api/analyze`)
- `/company/[sessionId]` — live boardroom, streams `ws://.../ws/{sessionId}`
- `/company/[sessionId]/dossier` — final report, `GET /api/result/{sessionId}`

## Structure

```
src/
  app/
    page.tsx                          landing page
    company/[sessionId]/page.tsx      live boardroom
    company/[sessionId]/dossier/      final dossier
  components/                         Hero, Nav, BoardroomPreview (landing
                                       mock), LiveMessage, Stamp, etc.
  hooks/useCompanyRun.ts              WebSocket + result-polling logic
  lib/
    api.ts                            fetch helpers, API_URL
    types.ts                          mirrors backend/app/models.py
    data.ts                           landing page copy + agent metadata
```

## Notes for whoever picks this up next

- The backend has no `run_complete` WS event — completion is inferred by
  re-fetching `/api/result/{sessionId}` whenever a `"system"` message
  arrives (see `useCompanyRun.ts`). If you add a real completion event
  server-side, simplify that hook.
- Agent pipeline is sequential (Research → Product → Finance → Legal →
  Marketing → CEO), not parallel, and there's no Design agent — `lib/data.ts`
  and the dossier page are built against the actual `models.py` fields, not
  the original PRD's fuller spec (no brand/architecture output yet).
- Fonts are self-hosted via Fontsource (not `next/font/google`) since the
  sandbox this was built in couldn't reach Google Fonts — safe to switch
  back if that's not an issue for you.
