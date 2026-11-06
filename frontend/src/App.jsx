import { MotionConfig } from "framer-motion";
import Navbar from "./components/Navbar";
import SectionHeading from "./components/SectionHeading";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Projects from "./sections/Projects";
import Journey from "./sections/Journey";
import Stats from "./sections/Stats";
import Contact from "./sections/Contact";
import Footer from "./components/Footer";
import Playground from "./sections/Playground";
import { PlayCircle } from "lucide-react";


const PLACEHOLDERS = [
  { id: "playground", num: "05", label: "PLAYGROUND", title: "Welcome to my digital playground." },
  { id: "game", num: "06", label: "GAME", title: "Cyber Runner: escape the grid." },
  { id: "contact", num: "07", label: "CONTACT", title: "Let's build something extraordinary." },
   { id: "playground", num: "05", label: "PLAYGROUND", title: "Welcome to my digital playground." },
  { id: "game", num: "06", label: "GAME", title: "Cyber Runner: escape the grid." },
  { id: "game", num: "06", label: "GAME", title: "Cyber Runner: escape the grid." },
  
];

export default function App() {
  return (
 <MotionConfig reducedMotion="user">
  <Navbar />
  <main className="pt-[72px]">
    <Hero />
    <About />
    <Skills />
    <Projects />
    <Journey />
    <Playground/>
    {PLACEHOLDERS.map((s) => (
      <section key={s.id} id={s.id} className="min-h-screen px-5 py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading num={s.num} label={s.label} title={s.title} />
        </div>
      </section>
    ))}
    <Stats />
    <Contact />
  </main>
  <Footer />
</MotionConfig>
  );
}