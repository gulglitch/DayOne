import BouncingDots from "@/components/BouncingDots";

export default function Loading() {
  return (
    <main className="min-h-screen relative flex items-center justify-center">
      <div className="ledger-grid" aria-hidden />
      <div className="relative flex flex-col items-center gap-5">
        <p className="mono-label text-seal">Opening the office…</p>
        <BouncingDots color="var(--color-seal)" size={8} />
      </div>
    </main>
  );
}
