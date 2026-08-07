"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { sampleIdeas } from "@/lib/data";
import { startAnalysis } from "@/lib/api";

const headlineWords = "Every company starts with an idea.".split(" ");

export default function Hero() {
  const router = useRouter();
  const [ideaIndex, setIdeaIndex] = useState(0);
  const [idea, setIdea] = useState("");
  const [targetMarket, setTargetMarket] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => {
      setIdeaIndex((i) => (i + 1) % sampleIdeas.length);
    }, 3200);
    return () => clearInterval(id);
  }, [reduceMotion]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!idea.trim() || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await startAnalysis(idea.trim(), targetMarket.trim());
      router.push(`/company/${res.session_id}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? `${err.message} Is the backend running?`
          : "Something went wrong reaching the API."
      );
      setSubmitting(false);
    }
  }

  return (
    <section
      id="top"
      className="relative overflow-hidden min-h-[100svh] flex flex-col justify-center pt-24 pb-16"
    >
      <div className="ledger-grid" aria-hidden />
      <div
        className="pointer-events-none absolute -top-40 right-[-10%] h-[520px] w-[520px] rounded-full opacity-[0.16] blur-3xl"
        style={{ background: "var(--color-seal)" }}
        aria-hidden
      />

      <div className="relative max-w-5xl mx-auto px-6 w-full">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mono-label text-seal mb-6"
        >
          Articles of Incorporation
        </motion.p>

        <h1 className="font-display text-[2.6rem] leading-[1.08] sm:text-6xl sm:leading-[1.05] lg:text-7xl lg:leading-[1.03] text-ink max-w-4xl">
          {headlineWords.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="inline-block mr-[0.28em]"
            >
              {word === "idea." ? (
                <span className="italic text-seal">{word}</span>
              ) : (
                word
              )}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="mt-6 max-w-xl text-lg text-ink-soft"
        >
          Most startups die from too little agreement — not too much. Day One
          is a founding team of six AI agents that research, argue, and build
          a real startup plan while you watch it happen.
        </motion.p>

        <motion.form
          id="start"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.85 }}
          className="mt-12 max-w-2xl"
        >
          <label htmlFor="idea" className="mono-label text-ink-faint block mb-3">
            Article I — The Idea
          </label>
          <div className="relative border-b-2 border-ink pb-3 focus-within:border-seal transition-colors">
            <input
              id="idea"
              name="idea"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              autoComplete="off"
              required
              disabled={submitting}
              className="w-full bg-transparent font-display text-xl sm:text-2xl text-ink placeholder:text-ink-faint/60 outline-none disabled:opacity-60"
              placeholder=" "
            />
            {idea.length === 0 && (
              <div className="pointer-events-none absolute inset-0 flex items-center overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={ideaIndex}
                    initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: reduceMotion ? 0 : -10 }}
                    transition={{ duration: 0.45 }}
                    className="font-display text-xl sm:text-2xl text-ink-faint/60 truncate"
                  >
                    e.g. {sampleIdeas[ideaIndex]}
                  </motion.span>
                </AnimatePresence>
              </div>
            )}
          </div>

          <div className="mt-4">
            <label htmlFor="targetMarket" className="mono-label text-ink-faint/70 block mb-2 text-[0.65rem]">
              Article I(a) — Target market, optional
            </label>
            <input
              id="targetMarket"
              name="targetMarket"
              value={targetMarket}
              onChange={(e) => setTargetMarket(e.target.value)}
              autoComplete="off"
              disabled={submitting}
              placeholder="e.g. B2B, college students, small clinics…"
              className="w-full bg-transparent border-b border-ink-faint/30 pb-2 text-sm text-ink-soft placeholder:text-ink-faint/50 outline-none focus:border-seal transition-colors disabled:opacity-60"
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="mono-label bg-ink text-paper px-6 py-3.5 rounded-full hover:bg-seal transition-colors disabled:opacity-50 disabled:hover:bg-ink"
            >
              {submitting ? "Opening the office…" : "Open the office →"}
            </button>
            <span className="mono-label text-ink-faint">
              Six agents, one real argument
            </span>
          </div>

          {error && (
            <p
              className="mt-4 mono-label"
              style={{ color: "var(--color-stamp-red)" }}
            >
              {error}
            </p>
          )}
        </motion.form>
      </div>
    </section>
  );
}
