import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import AgentMarquee from "@/components/AgentMarquee";
import ProblemSection from "@/components/ProblemSection";
import HowItWorks from "@/components/HowItWorks";
import BoardroomPreview from "@/components/BoardroomPreview";
import DossierGrid from "@/components/DossierGrid";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <div className="grain" aria-hidden />
      <Nav />
      <main>
        <Hero />
        <AgentMarquee />
        <ProblemSection />
        <HowItWorks />
        <BoardroomPreview />
        <DossierGrid />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
