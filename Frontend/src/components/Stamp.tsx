"use client";

import { motion } from "framer-motion";

export default function Stamp({
  label,
  color,
  trigger = "inView",
  compact = false,
}: {
  label: string;
  color: string;
  /** "inView" for scroll-triggered mock previews, "mount" for live events */
  trigger?: "inView" | "mount";
  /** smaller footprint for use inline inside a chat bubble row */
  compact?: boolean;
}) {
  const revealProps =
    trigger === "mount"
      ? { animate: { opacity: 1, scale: 1, rotate: -6 } }
      : {
          whileInView: { opacity: 1, scale: 1, rotate: -7 },
          viewport: { once: true, margin: "-40px" },
        };

  return (
    <motion.div
      initial={{ opacity: 0, scale: compact ? 1.8 : 2.4, rotate: -22 }}
      {...revealProps}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 14,
        delay: trigger === "mount" ? 0.15 : 0.3,
      }}
      className="relative inline-block shrink-0"
    >
      <div
        className={`absolute inset-0 rounded-md opacity-40 ${compact ? "translate-x-[2px] translate-y-[1px]" : "translate-x-[3px] translate-y-[2px]"}`}
        style={{ border: `${compact ? 2 : 3}px solid ${color}` }}
        aria-hidden
      />
      <div
        className={`relative rounded-md ${compact ? "px-2.5 py-1" : "px-4 py-2"}`}
        style={{ border: `${compact ? 2 : 3}px solid ${color}` }}
      >
        <span
          className={`mono-label font-medium tracking-[0.16em] ${compact ? "text-[0.58rem]" : ""}`}
          style={{ color }}
        >
          {label}
        </span>
      </div>
    </motion.div>
  );
}
