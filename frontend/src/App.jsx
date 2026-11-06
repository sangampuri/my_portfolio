import { MotionConfig } from "framer-motion";
import Navbar from "./components/Navbar";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Projects from "./sections/Projects";
import Journey from "./sections/Journey";
import Playground from "./sections/Playground";
import Game from "./sections/Game";
import Stats from "./sections/Stats";
import Contact from "./sections/Contact";
import Footer from "./components/Footer";
import { PortfolioProvider } from "./context/PortfolioData";

export default function App() {
  return (
    <PortfolioProvider>
      <MotionConfig reducedMotion="user">
        <Navbar />
        <main className="pt-[72px]">
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Journey />
          <Playground />
          <Game />
          <Stats />
          <Contact />
        </main>
        <Footer />
      </MotionConfig>
    </PortfolioProvider>
  );
}
