// → src/app/company/[sessionId]/page.tsx
"use client";

import { use, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCompanyRun } from "@/hooks/useCompanyRun";
import LiveMessage from "@/components/LiveMessage";
import BouncingDots from "@/components/BouncingDots";
import PipelineBlueprint from "@/components/PipelineBlueprint";
import { pipelineAgents, agentLabel } from "@/lib/data";
import { API_URL } from "@/lib/api";

export default function CompanyRunPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = use(params);
  const { messages, result, connection, apiReachable } = useCompanyRun(sessionId);
  const bottomRef = useRef<HTMLDivElement>(null);

  const connectionMeta = {
    connecting: { label: "Connecting…", color: "var(--color-seal)", glow: false },
    open: { label: "Live", color: "var(--color-live)", glow: true },
    reconnecting: { label: "Reconnecting…", color: "var(--color-seal)", glow: false },
    failed: { label: "Disconnected", color: "var(--color-stamp-red)", glow: false },
  }[connection];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  const spokenAgents = new Set(messages.map((m) => m.agent));
  const status = result?.status ?? "running";
  const idea = result?.dossier?.idea;
  const lastSpeaker = [...messages].reverse().find((m) => m.agent !== "system");
  const isThinking = status === "running";

  return (
    <main className="min-h-screen relative pt-28 pb-24">
      <div className="ledger-grid" aria-hidden />
      <PipelineBlueprint />

      <div className="relative max-w-3xl mx-auto px-6 z-10">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="mono-label text-ink-faint hover:text-seal transition-colors"
          >
            ← New idea
          </Link>
          <div className="flex items-center gap-4">
            <span className="mono-label flex items-center gap-2 font-medium" style={{ color: connectionMeta.color }}>
              <span
                className={`h-2 w-2 rounded-full ${connectionMeta.glow ? "live-dot" : ""}`}
                style={{ background: connectionMeta.color }}
                aria-hidden
              />
              {connectionMeta.label}
            </span>
            <span className="mono-label text-ink-faint">
              Session {sessionId.slice(0, 8)}
            </span>
          </div>
        </div>

        <p className="mono-label text-seal mb-4">The Boardroom — Live</p>
        <h1 className="font-display text-3xl sm:text-4xl text-ink leading-tight mb-3">
          {idea ? `\u201c${idea}\u201d` : "Your founding team is in session."}
        </h1>

        {!apiReachable && (
          <div
            className="mt-6 rounded-lg border px-4 py-3 mono-label"
            style={{
              borderColor: "var(--color-stamp-red)",
              color: "var(--color-stamp-red)",
            }}
          >
            Can&rsquo;t reach the Day One API at {API_URL}. Make sure the
            backend is running.
          </div>
        )}

        {connection === "failed" && status !== "completed" && (
          <div
            className="mt-6 rounded-lg border px-4 py-3 mono-label"
            style={{ borderColor: "var(--color-stamp-red)", color: "var(--color-stamp-red)" }}
          >
            Lost the live connection before this run finished. Check the
            backend&rsquo;s still running (open its terminal — you should see
            a WebSocket accepted there), then{" "}
            <button onClick={() => window.location.reload()} className="underline">
              reload this page
            </button>
            .
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-2">
          {pipelineAgents.map((a) => {
            const spoken = spokenAgents.has(a.id);
            return (
              <span
                key={a.id}
                className="mono-label px-3 py-1.5 rounded-full border transition-colors"
                style={
                  spoken
                    ? { borderColor: "var(--color-seal)", color: "var(--color-seal)" }
                    : {
                        borderColor: "var(--color-ink-faint)",
                        color: "var(--color-ink-faint)",
                        opacity: 0.45,
                      }
                }
              >
                {a.label}
              </span>
            );
          })}
        </div>

        <div className="mt-10 rounded-[1.4rem] border-2 border-ink bg-paper p-2 sm:p-3">
          <div className="rounded-2xl bg-paper-deep/40 p-6 sm:p-9 min-h-[240px]">
            {messages.length === 0 && (
              <p className="mono-label text-ink-faint text-center pb-8 pt-4">
                Opening the office…
              </p>
            )}

            {messages.map((m, i) => (
              <LiveMessage key={i} msg={m} />
            ))}

            {isThinking && (
              <div className="flex items-start gap-3 py-2">
                <div
                  className="mono-label shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-[0.58rem]"
                  style={{
                    background: "var(--color-paper)",
                    color: "var(--color-ink-faint)",
                    border: "1.5px solid var(--color-ink-faint)",
                  }}
                  aria-hidden
                >
                  {lastSpeaker ? agentLabel(lastSpeaker.agent).slice(0, 2).toUpperCase() : "··"}
                </div>
                <div className="rounded-2xl rounded-tl-sm px-4 py-3" style={{ background: "var(--color-paper-deep)" }}>
                  <BouncingDots color="var(--color-ink-faint)" />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>

        {status === "completed" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 text-center"
          >
            <Link
              href={`/company/${sessionId}/dossier`}
              className="mono-label inline-block bg-ink text-paper px-8 py-4 rounded-full hover:bg-seal transition-colors"
            >
              View your dossier →
            </Link>
          </motion.div>
        )}

        {status === "error" && (
          <div
            className="mt-10 rounded-lg border px-5 py-4 text-center mono-label"
            style={{
              borderColor: "var(--color-stamp-red)",
              color: "var(--color-stamp-red)",
            }}
          >
            The pipeline hit an error. Check the backend logs, then{" "}
            <Link href="/" className="underline">
              start a new company
            </Link>
            .
          </div>
        )}
      </div>
    </main>
  );
}