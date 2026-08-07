import Reveal from "./Reveal";
import { dossierSections } from "@/lib/data";

export default function DossierGrid() {
  return (
    <section id="dossier" className="py-28 sm:py-36 bg-paper-deep/40">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal>
          <p className="mono-label text-seal mb-5">What You Walk Away With</p>
          <h2 className="font-display text-3xl sm:text-5xl leading-[1.1] max-w-2xl text-ink">
            A founding document, not a wall of markdown.
          </h2>
        </Reveal>

        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {dossierSections.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.05}>
              <div className="h-full rounded-xl border border-ink-faint/25 bg-paper p-7 hover:border-seal transition-colors">
                <span className="mono-label text-seal">
                  Tab {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-xl text-ink mt-3 mb-2">
                  {item.title}
                </h3>
                <p className="text-ink-soft text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
