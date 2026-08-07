export default function Footer() {
  return (
    <footer className="border-t border-ink-faint/20 py-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-display italic text-ink">Day One</span>
        <span className="mono-label text-ink-faint">
          Six agents. One founding document. © 2026
        </span>
      </div>
    </footer>
  );
}
