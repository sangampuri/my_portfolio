import { lazy, Suspense } from "react";
import Navbar from "./components/Navbar";
import SectionHeading from "./components/SectionHeading";

const LiquidBackground = lazy(() => import("./three/LiquidBackground"));

const SECTIONS = [
  { id: "home", num: "00", label: "HELLO WORLD", title: "Hero comes in Phase 3" },
  { id: "about", num: "01", label: "ABOUT", title: "The person behind the code." },
  { id: "skills", num: "02", label: "SKILLS", title: "My technical arsenal." },
  { id: "projects", num: "03", label: "PROJECTS", title: "Things I've built." },
  { id: "journey", num: "04", label: "JOURNEY", title: "My journey through code." },
  { id: "playground", num: "05", label: "PLAYGROUND", title: "Welcome to my digital playground." },
  { id: "game", num: "06", label: "GAME", title: "Cyber Runner: escape the grid." },
  { id: "contact", num: "07", label: "CONTACT", title: "Let's build something extraordinary." },
];

export default function App() {
  return (
    <>
      <Suspense fallback={null}>
        <LiquidBackground />
      </Suspense>
      <Navbar />
      <main className="pt-[72px]">
        {SECTIONS.map((s) => (
          <section key={s.id} id={s.id} className="min-h-screen px-5 py-24">
            <div className="mx-auto max-w-7xl">
              <SectionHeading num={s.num} label={s.label} title={s.title} />
            </div>
          </section>
        ))}
      </main>
    </>
  );
}