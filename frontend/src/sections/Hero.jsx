import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { usePortfolio } from "../context/PortfolioData";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";

const { profile } = usePortfolio();
const [first, ...rest] = profile.name.trim().split(" ");

const HeroScene = lazy(() => import("../three/HeroScene"));

const container = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Hero() {
  const sceneRef = useRef(null);
  const [visible, setVisible] = useState(true);
  const [mobile] = useState(() => window.innerWidth < 768);
  const [reduced] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {
      threshold: 0.05,
    });
    if (sceneRef.current) obs.observe(sceneRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="home" className="relative min-h-[calc(100vh-72px)] px-5 py-12">
      <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-8 items-center min-h-[calc(100vh-72px-6rem)]">
        {/* left */}
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.p variants={item} className="font-mono text-xs sm:text-sm tracking-[0.3em] text-electric mb-4">
            HELLO, WORLD! I'M
          </motion.p>

          <motion.h1
            variants={item}
            className="font-display font-bold uppercase leading-[0.95] text-6xl sm:text-7xl xl:text-8xl"
          >
           {first}
            <br />
            <span className="text-electric">{rest.join(" ")}</span>
          </motion.h1>

          <motion.p variants={item} className="mt-5 font-mono text-xs sm:text-sm text-neon tracking-wider">
            Python Developer | Full-Stack Developer | AI Enthusiast
          </motion.p>

          <motion.p variants={item} className="mt-5 max-w-xl text-muted leading-relaxed">
            I'm a developer passionate about building interactive digital experiences,
            powerful backend systems, and creative web applications.
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-wrap gap-4">
            <a
              href="#projects"
              className="group inline-flex items-center gap-2 bg-electric text-bg font-display font-bold text-sm tracking-widest px-8 py-4 [clip-path:polygon(6%_0,100%_0,94%_100%,0_100%)] hover:bg-cyan transition-colors"
            >
              EXPLORE MY WORK
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center border border-neon text-text font-display font-bold text-sm tracking-widest px-8 py-4 hover:bg-neon/20 hover:shadow-[0_0_24px_rgba(157,78,221,0.5)] transition-all"
            >
              LET'S CONNECT
            </a>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-8 inline-flex items-center gap-3 bg-card border border-white/10 px-4 py-2"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-cyan opacity-75 animate-ping" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan" />
            </span>
            <span className="font-mono text-[11px] tracking-[0.2em] text-muted">
              AVAILABLE FOR OPPORTUNITIES
            </span>
          </motion.div>
        </motion.div>

        {/* right: 3D */}
        <div ref={sceneRef} className="relative h-[380px] sm:h-[480px] lg:h-[620px]">
          <Suspense
            fallback={
              <div className="absolute inset-0 grid place-items-center font-mono text-xs text-muted">
                LOADING WORLD...
              </div>
            }
          >
            <HeroScene mobile={mobile} reduced={reduced} visible={visible} />
          </Suspense>
        </div>
      </div>

      {/* scroll indicator */}
      <a
        href="#about"
        aria-label="Scroll to About"
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 font-mono text-[10px] tracking-[0.3em] text-muted hover:text-electric"
      >
        SCROLL
        <motion.span
          animate={reduced ? {} : { y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6 }}
        >
          <ChevronDown size={18} />
        </motion.span>
      </a>
    </section>
  );
}