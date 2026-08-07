"use client";

import { motion } from "framer-motion";
import Stamp from "./Stamp";
import { agentLabel, cleanMessage } from "@/lib/data";
import type { AgentMessage } from "@/lib/types";

export default function LiveMessage({ msg }: { msg: AgentMessage }) {
  if (msg.agent === "system") {
    return (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mono-label text-ink-faint text-center py-3"
      >
        {msg.message}
      </motion.p>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-6 py-4 border-b border-ink-faint/10 last:border-b-0"
    >
      <span className="mono-label text-ink-faint shrink-0 sm:w-28 pt-1">
        {agentLabel(msg.agent)}
      </span>

      {msg.type === "resolution" ? (
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Stamp label="Ruling" color="var(--color-stamp-green)" trigger="mount" />
          <p className="font-display text-lg sm:text-xl text-ink italic">
            {cleanMessage(msg.message, msg.type)}
          </p>
        </div>
      ) : msg.type === "challenge" ? (
        <p className="text-ink-soft flex-1">
          <span
            className="mono-label mr-2 inline-block -rotate-2 px-1.5 py-0.5 rounded"
            style={{
              color: "var(--color-stamp-red)",
              border: "1.5px solid var(--color-stamp-red)",
            }}
          >
            Objection
          </span>
          {cleanMessage(msg.message, msg.type)}
        </p>
      ) : msg.type === "error" ? (
        <p className="flex-1 font-medium" style={{ color: "var(--color-stamp-red)" }}>
          {msg.message}
        </p>
      ) : (
        <p className="text-ink-soft flex-1">{msg.message}</p>
      )}
    </motion.div>
  );
}
