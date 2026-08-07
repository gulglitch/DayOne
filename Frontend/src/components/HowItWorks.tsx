import Reveal from "./Reveal";
import { howItWorksSteps } from "@/lib/data";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-28 sm:py-36 bg-paper-deep/40">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal>
          <p className="mono-label text-seal mb-5">How The Meeting Runs</p>
          <h2 className="font-display text-3xl sm:text-5xl leading-[1.1] max-w-2xl text-ink">
            One idea. Six agents. One real argument.
          </h2>
        </Reveal>

        <div className="mt-16 max-w-3xl">
          {howItWorksSteps.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.06}>
              <div className="flex gap-6 py-7 border-t border-ink-faint/20 last:border-b">
                <span className="mono-label text-seal shrink-0 pt-1 w-10">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-xl text-ink mb-1.5">
                    {step.title}
                  </h3>
                  <p className="text-ink-soft">{step.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
