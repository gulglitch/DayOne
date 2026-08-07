"use client";

import { motion } from "framer-motion";
import Stamp from "./Stamp";
import { agentLabel, cleanMessage } from "@/lib/data";
import type { AgentMessage } from "@/lib/types";

const TYPE_ACCENT: Record<string, string> = {
  info: "var(--color-ink-faint)",
  challenge: "var(--color-stamp-red)",
  resolution: "var(--color-stamp-green)",
  error: "var(--color-stamp-red)",
};

function initials(label: string) {
  return label.slice(0, 2).toUpperCase();
}

export default function LiveMessage({ msg }: { msg: AgentMessage }) {
  if (msg.agent === "system") {
    return (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mono-label text-ink-faint text-center py-3 text-[0.62rem]"
      >
        {cleanMessage(msg.message)}
      </motion.p>
    );
  }

  const accent = TYPE_ACCENT[msg.type] ?? TYPE_ACCENT.info;
  const label = agentLabel(msg.agent);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-start gap-3 py-2"
    >
      <div
        className="mono-label shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-[0.58rem]"
        style={{ background: "var(--color-paper)", color: accent, border: `1.5px solid ${accent}` }}
        aria-hidden
      >
        {initials(label)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="mono-label text-ink-faint text-[0.62rem]">{label}</span>
          {msg.type === "challenge" && (
            <span
              className="mono-label text-[0.56rem] px-1.5 py-0.5 rounded"
              style={{ color: accent, border: `1px solid ${accent}` }}
            >
              Objection
            </span>
          )}
          {msg.type === "resolution" && <Stamp label="Ruling" color={accent} trigger="mount" compact />}
        </div>

        <div
          className="rounded-2xl rounded-tl-sm px-4 py-2.5 text-[0.92rem] leading-relaxed"
          style={{
            background: "var(--color-paper-deep)",
            borderLeft: msg.type !== "info" ? `3px solid ${accent}` : undefined,
            color: msg.type === "error" ? accent : "var(--color-ink-soft)",
          }}
        >
          {cleanMessage(msg.message, msg.type)}
        </div>
      </div>
    </motion.div>
  );
}
