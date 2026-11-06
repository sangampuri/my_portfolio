import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/Reveal";
import { about } from "../data/about";

function Cube({ x, y, s = 1, glow }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} strokeLinejoin="round">
      <path d="M-60 30 L0 60 L0 120 L-60 90 Z" fill="#10121c" stroke="#9D4EDD" strokeWidth={2 / s} />
      <path d="M60 30 L0 60 L0 120 L60 90 Z" fill="#0b0d16" stroke="#9D4EDD" strokeWidth={2 / s} />
      <path
        d="M0 0 L60 30 L0 60 L-60 30 Z"
        fill="#171a26"
        stroke={glow ?? "#00D9FF"}
        strokeWidth={2.5 / s}
      />
    </g>
  );
}

function IsoIllustration() {
  const float = (d) => ({
    animate: { y: [0, -8, 0] },
    transition: { repeat: Infinity, duration: 4, delay: d, ease: "easeInOut" },
  });
  return (
    <svg viewBox="0 0 400 420" className="w-full max-w-md mx-auto" role="img" aria-label="Isometric stack of cubes">
      <ellipse cx="200" cy="370" rx="150" ry="28" fill="#9D4EDD" opacity="0.15" />
      <Cube x={200} y={170} s={1.5} />
      <motion.g {...float(0.3)}>
        <Cube x={200} y={95} s={1} glow="#FF2E93" />
      </motion.g>
      <motion.g {...float(0.6)}>
        <Cube x={200} y={53} s={0.6} glow="#00F5D4" />
      </motion.g>
      <g fontFamily="JetBrains Mono, monospace" fontSize="12" fill="#A5A8B5">
        <line x1="40" y1="120" x2="150" y2="150" stroke="#00D9FF" strokeDasharray="4 4" />
        <text x="10" y="112">PYTHON</text>
        <line x1="360" y1="190" x2="260" y2="210" stroke="#FF2E93" strokeDasharray="4 4" />
        <text x="318" y="182">DJANGO</text>
        <line x1="40" y1="300" x2="130" y2="290" stroke="#00F5D4" strokeDasharray="4 4" />
        <text x="10" y="292">REACT</text>
      </g>
    </svg>
  );
}

export default function About() {
  const [open, setOpen] = useState(false);

  return (
    <section id="about" className="relative px-5 py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          <SectionHeading num="01" label="ABOUT" title={about.headline} />

          <Reveal>
            <p className="text-xl md:text-2xl leading-relaxed text-text/90 max-w-2xl">
              {about.intro}
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-10 grid grid-cols-3 gap-4 max-w-xl">
            {about.facts.map((f) => (
              <div key={f.label} className="border-t border-electric/60 pt-3">
                <p className="font-mono text-[10px] tracking-[0.25em] text-muted">{f.label}</p>
                <p className="font-display text-sm sm:text-base font-semibold mt-1">{f.value}</p>
              </div>
            ))}
          </Reveal>

          <Reveal delay={0.15} className="mt-8 flex flex-wrap gap-2">
            {about.interests.map((t) => (
              <span
                key={t}
                className="font-mono text-xs px-3 py-1.5 bg-card border border-white/10 text-neon"
              >
                #{t.replace(/\s+/g, "")}
              </span>
            ))}
          </Reveal>

          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-8 grid gap-6 max-w-2xl">
                  {about.more.map((m) => (
                    <div key={m.label} className="pl-4 border-l-2 border-hot">
                      <p className="font-mono text-[11px] tracking-[0.25em] text-hot">{m.label}</p>
                      <p className="mt-1 text-muted leading-relaxed">{m.text}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className="mt-8 font-mono text-xs tracking-[0.3em] text-electric border-b border-electric pb-1 hover:text-cyan hover:border-cyan transition-colors"
          >
            {open ? "READ LESS −" : "READ MORE +"}
          </button>
        </div>

        <Reveal className="lg:col-span-5 lg:mt-28 self-center" y={48}>
          <IsoIllustration />
        </Reveal>
      </div>
    </section>
  );
}