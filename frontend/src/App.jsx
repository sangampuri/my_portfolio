import { MotionConfig } from "framer-motion";
import Navbar from "./components/Navbar";
import SectionHeading from "./components/SectionHeading";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Skills from "./sections/Skills";


const PLACEHOLDERS = [
  { id: "projects", num: "03", label: "PROJECTS", title: "Things I've built." },
  { id: "journey", num: "04", label: "JOURNEY", title: "My journey through code." },
  { id: "playground", num: "05", label: "PLAYGROUND", title: "Welcome to my digital playground." },
  { id: "game", num: "06", label: "GAME", title: "Cyber Runner: escape the grid." },
  { id: "contact", num: "07", label: "CONTACT", title: "Let's build something extraordinary." },
];

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Navbar />
      <main className="pt-[72px]">
        <Hero />
        <About />
        <Skills />
        {PLACEHOLDERS.map((s) => (
          <section key={s.id} id={s.id} className="min-h-screen px-5 py-24">
            <div className="mx-auto max-w-7xl">
              <SectionHeading num={s.num} label={s.label} title={s.title} />
            </div>
          </section>
        ))}
      </main>
    </MotionConfig>
  );
}