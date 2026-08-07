import BouncingDots from "@/components/BouncingDots";

export default function Loading() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-5">
        <p className="mono-label text-seal">Compiling the dossier…</p>
        <BouncingDots color="var(--color-seal)" size={8} />
      </div>
    </main>
  );
}
