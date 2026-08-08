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
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/gulglitch/DayOne"
            target="_blank"
            rel="noopener noreferrer"
            className="mono-label text-ink-soft hover:text-seal transition-colors hidden sm:inline-flex items-center gap-1.5"
            aria-label="View source on GitHub"
          >
            <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
              <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.34-1.28-1.7-1.28-1.7-1.04-.72.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.77.11 3.06.74.8 1.19 1.83 1.19 3.09 0 4.42-2.69 5.4-5.25 5.68.41.36.78 1.08.78 2.17 0 1.57-.01 2.83-.01 3.22 0 .3.2.66.79.55A10.52 10.52 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
            </svg>
            GitHub
          </a>
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
        </div>
      </nav>
    </motion.header>
  );
}
