"use client";

import { motion } from "framer-motion";

export default function Stamp({
  label,
  color,
  trigger = "inView",
}: {
  label: string;
  color: string;
  /** "inView" for scroll-triggered mock previews, "mount" for live events */
  trigger?: "inView" | "mount";
}) {
  const revealProps =
    trigger === "mount"
      ? { animate: { opacity: 1, scale: 1, rotate: -7 } }
      : {
          whileInView: { opacity: 1, scale: 1, rotate: -7 },
          viewport: { once: true, margin: "-40px" },
        };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 2.4, rotate: -24 }}
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
        className="absolute inset-0 translate-x-[3px] translate-y-[2px] rounded-md opacity-40"
        style={{ border: `3px solid ${color}` }}
        aria-hidden
      />
      <div className="relative rounded-md px-4 py-2" style={{ border: `3px solid ${color}` }}>
        <span className="mono-label font-medium tracking-[0.18em]" style={{ color }}>
          {label}
        </span>
      </div>
    </motion.div>
  );
}
