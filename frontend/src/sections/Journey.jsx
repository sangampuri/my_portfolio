import { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import { Terminal, Code, Layers, Database, Lock, Server, Boxes, Sparkles } from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import { usePortfolio } from "../context/PortfolioData";

const ICONS = { Terminal, Code, Layers, Database, Lock, Server, Boxes, Sparkles };

function Milestone({ m, index }) {
  const Icon = ICONS[m.icon] ?? Code;
  const right = index % 2 === 0; // card on left side (desktop)
  const accents = ["#00D9FF", "#9D4EDD", "#FF2E93", "#00F5D4"];
  const accent = accents[index % accents.length];

  return (
    <motion.li
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className={`relative pl-14 lg:pl-0 lg:w-1/2 ${
        right ? "lg:pr-14" : "lg:pl-14 lg:ml-[50%]"
      }`}
    >
      {/* node on the line */}
      <span
        className={`absolute top-8 left-4 -translate-x-1/2 w-4 h-4 rotate-45 bg-bg border-2 ${
          right ? "lg:left-auto lg:right-0 lg:translate-x-1/2" : "lg:left-0"
        }`}
        style={{ borderColor: accent, boxShadow: `0 0 14px ${accent}` }}
      />

      <div
        className="relative bg-card border border-white/10 p-6 shadow-[0_20px_40px_rgba(0,0,0,0.55)] overflow-hidden"
        style={{ borderTop: `2px solid ${accent}` }}
      >
        <span className="absolute -top-2 right-3 font-tech text-7xl font-extrabold text-white/[0.05] select-none">
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className={`flex items-center gap-4 mb-3 ${right ? "lg:flex-row-reverse" : ""}`}>
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 3 + index * 0.2, ease: "easeInOut" }}
            className="w-11 h-11 grid place-items-center bg-bg2 border"
            style={{ borderColor: accent, color: accent }}
          >
            <Icon size={20} />
          </motion.div>
          {m.date && <span className="font-mono text-xs tracking-widest text-muted">{m.date}</span>}
        </div>

        <h3 className={`font-display font-bold text-xl ${right ? "lg:text-right" : ""}`}>{m.title}</h3>
        <p className={`mt-1 text-sm text-muted ${right ? "lg:text-right" : ""}`}>{m.desc}</p>
      </div>
    </motion.li>
  );
}

export default function Journey() {
    const { journey } = usePortfolio();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 70%", "end 60%"],
  });

  return (
    <section id="journey" className="px-5 py-24">
      <div className="mx-auto max-w-5xl">
        <SectionHeading num="04" label="JOURNEY" title="MY JOURNEY THROUGH CODE." />

        <div ref={ref} className="relative">
          {/* base line */}
          <div className="absolute top-0 bottom-0 left-4 lg:left-1/2 w-px -translate-x-1/2 bg-white/10" />
          {/* neon progress line, draws on scroll */}
          <motion.div
            style={{ scaleY: scrollYProgress }}
            className="absolute top-0 bottom-0 left-4 lg:left-1/2 w-[2px] -translate-x-1/2 origin-top bg-gradient-to-b from-electric via-neon to-hot"
          />

          <ol className="space-y-10 lg:space-y-14">
            {journey.map((m, i) => (
              <Milestone key={m.title} m={m} index={i} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}