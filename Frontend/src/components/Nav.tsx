"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export default function Nav() {
  const { scrollY } = useScroll();
  const borderOpacity = useTransform(scrollY, [0, 120], [0, 1]);
  const bg = useTransform(
    scrollY,
    [0, 120],
    ["rgba(247,243,236,0)", "rgba(247,243,236,0.85)"]
  );

  return (
    <motion.header
      style={{ backgroundColor: bg }}
      className="fixed top-0 inset-x-0 z-50 backdrop-blur-sm"
    >
      <motion.div
        style={{ opacity: borderOpacity }}
        className="absolute bottom-0 inset-x-0 h-px bg-ink-faint"
      />
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2">
          <span className="font-display italic text-lg text-ink">Day One</span>
          <span className="mono-label text-ink-faint hidden sm:inline">
            No. 001
          </span>
        </a>
        <div className="hidden md:flex items-center gap-8 mono-label text-ink-soft">
          <a href="#how-it-works" className="hover:text-seal transition-colors">
            How it works
          </a>
          <a href="#boardroom" className="hover:text-seal transition-colors">
            The boardroom
          </a>
          <a href="#dossier" className="hover:text-seal transition-colors">
            The dossier
          </a>
        </div>
        <button
          onClick={() => {
            const input = document.getElementById('idea');
            if (input) {
              input.focus();
              input.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }}
          className="mono-label border border-ink bg-ink text-paper px-4 py-2 rounded-full hover:opacity-90 transition-opacity cursor-pointer"
        >
          Start a company
        </button>
      </nav>
    </motion.header>
  );
}
