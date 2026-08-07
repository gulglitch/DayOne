"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { getResult } from "@/lib/api";
import type { SessionResult } from "@/lib/types";

function Chips({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {items.map((item) => (
        <span
          key={item}
          className="mono-label px-3 py-1.5 rounded-full border border-ink-faint/30 text-ink-soft"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function Section({
  tab,
  title,
  children,
}: {
  tab: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal className="border-t border-ink-faint/20 py-10 first:border-t-0 first:pt-0">
      <span className="mono-label text-seal">{tab}</span>
      <h2 className="font-display text-2xl text-ink mt-2 mb-4">{title}</h2>
      {children}
    </Reveal>
  );
}

export default function DossierPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = use(params);
  const [result, setResult] = useState<SessionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getResult(sessionId)
      .then((r) => {
        if (!cancelled) setResult(r);
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load the dossier.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <p className="mono-label" style={{ color: "var(--color-stamp-red)" }}>
            {error}
          </p>
          <Link href="/" className="mono-label text-seal mt-4 inline-block">
            ← Start over
          </Link>
        </div>
      </main>
    );
  }

  if (!result) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <p className="mono-label text-ink-faint animate-pulse">
          Loading the dossier…
        </p>
      </main>
    );
  }

  if (result.status !== "completed" || !result.dossier) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 text-center">
        <div>
          <p className="mono-label text-ink-faint mb-4">
            {result.status === "error"
              ? "This run hit an error."
              : "This company is still in session."}
          </p>
          <Link href={`/company/${sessionId}`} className="mono-label text-seal">
            ← Back to the boardroom
          </Link>
        </div>
      </main>
    );
  }

  const d = result.dossier;

  async function copyPitch() {
    await navigator.clipboard.writeText(d.elevator_pitch);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main className="min-h-screen pt-28 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        <div className="flex items-center justify-between mb-10">
          <Link
            href="/"
            className="mono-label text-ink-faint hover:text-seal transition-colors"
          >
            ← New idea
          </Link>
          <Link
            href={`/company/${sessionId}`}
            className="mono-label text-ink-faint hover:text-seal transition-colors"
          >
            View transcript
          </Link>
        </div>

        <p className="mono-label text-seal mb-4">The Dossier</p>
        <h1 className="font-display italic text-3xl sm:text-4xl text-ink leading-tight mb-14">
          &ldquo;{d.idea}&rdquo;
        </h1>

        <Section tab="Tab 01" title="Problem & Audience">
          <p className="text-ink-soft">{d.problem_statement}</p>
          <p className="text-ink-soft mt-3">
            <span className="text-ink-faint">Audience — </span>
            {d.target_audience}
          </p>
        </Section>

        <Section tab="Tab 02" title="Competitors & the Edge">
          <Chips items={d.competitors} />
          <p className="text-ink-soft mt-4">{d.unique_value_prop}</p>
        </Section>

        <Section tab="Tab 03" title="MVP & Tech Stack">
          <ul className="space-y-2">
            {d.mvp_scope.map((item) => (
              <li key={item} className="text-ink-soft flex gap-2">
                <span className="text-seal">—</span>
                {item}
              </li>
            ))}
          </ul>
          <Chips items={d.tech_stack} />
        </Section>

        <Section tab="Tab 04" title="Finance & Legal">
          <p className="text-ink-soft">{d.revenue_model}</p>
          <p className="text-ink-soft mt-3">
            <span className="text-ink-faint">Structure — </span>
            {d.legal_structure}
          </p>
          <Chips items={d.compliance_requirements} />
        </Section>

        <Section tab="Tab 05" title="Go-to-Market">
          <p className="text-ink-soft">{d.marketing_strategy}</p>
          <Chips items={d.target_channels} />
        </Section>

        {d.challenges.length > 0 && (
          <Section tab="Tab 06" title="The Boardroom Record">
            <div className="space-y-6">
              {d.challenges.map((c, i) => (
                <div key={i} className="rounded-xl border border-ink-faint/20 p-5">
                  <p className="mono-label text-ink-faint mb-2">
                    {c.raised_by} → {c.target}
                  </p>
                  <p className="text-ink-soft">{c.reason}</p>
                  {c.resolution && (
                    <p className="mt-3 font-display italic text-ink">
                      Ruling — {c.resolution}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        <Section tab="Tab 07" title="The Elevator Pitch">
          <p className="font-display italic text-2xl leading-relaxed text-ink">
            &ldquo;{d.elevator_pitch}&rdquo;
          </p>
          <button
            onClick={copyPitch}
            className="mono-label mt-6 border border-ink px-5 py-2.5 rounded-full hover:bg-ink hover:text-paper transition-colors"
          >
            {copied ? "Copied ✓" : "Copy pitch"}
          </button>
        </Section>
      </div>
    </main>
  );
}
