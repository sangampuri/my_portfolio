import { motion } from "framer-motion";
import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/Reveal";
import SkillIcon from "../components/SkillIcon";
import useTilt from "../hooks/useTilt";
import { usePortfolio } from "../context/PortfolioData";

function CategoryLabel({ index, title, accent }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <span className="font-tech text-3xl font-extrabold" style={{ color: accent }}>{index}</span>
      <h3 className="font-mono text-xs tracking-[0.3em] text-muted uppercase">{title}</h3>
      <span className="flex-1 h-px bg-white/10" />
    </div>
  );
}

/* FRONTEND: staggered tilt cards */
function TiltCard({ skill }) {
  const tilt = useTilt(12);
  return (
    <div
      {...tilt}
      className="group relative bg-card border border-white/10 p-6 transition-[transform,box-shadow,border-color] duration-150 hover:border-electric hover:shadow-[0_20px_40px_rgba(0,0,0,0.6),0_0_24px_rgba(0,217,255,0.25)] [clip-path:polygon(0_0,92%_0,100%_8%,100%_100%,0_100%)]"
    >
      <div className="mb-4 h-12 flex items-center">
        <SkillIcon skill={skill} size={44} />
      </div>
      <p className="font-display font-bold text-lg">{skill.name}</p>
      <p className="mt-1 text-sm text-muted">{skill.desc}</p>
      <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-electric transition-all duration-300 group-hover:w-full" />
    </div>
  );
}

function Frontend({items}) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
      {items.map((s, i) => (
        <Reveal key={s.name} delay={i * 0.07} className={i % 2 ? "lg:mt-10" : ""}>
          <TiltCard skill={s} />
        </Reveal>
      ))}
    </div>
  );
}

/* BACKEND: wide numbered rows */
function Backend({items}) {
  return (
    <div className="grid gap-4">
      {items.map((s, i) => (
        <Reveal key={s.name} delay={i * 0.08}>
          <div className="group flex items-center gap-5 bg-card border-l-4 border-neon px-5 py-5 hover:border-hot hover:translate-x-2 transition-all shadow-[0_12px_28px_rgba(0,0,0,0.5)]">
            <span className="hidden sm:block font-tech text-4xl font-extrabold text-white/10 group-hover:text-hot/40 transition-colors w-16">
              {String(i + 1).padStart(2, "0")}
            </span>
            <SkillIcon skill={s} size={40} />
            <div>
              <p className="font-display font-bold text-xl">{s.name}</p>
              <p className="text-sm text-muted">{s.desc}</p>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/* DATABASE: terminal window */
function Database({items}) {
  return (
    <Reveal>
      <div className="bg-[#0b0d16] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10 bg-bg2">
          <span className="w-2.5 h-2.5 rounded-full bg-hot" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFD43B]" />
          <span className="w-2.5 h-2.5 rounded-full bg-cyan" />
          <span className="ml-3 font-mono text-[11px] text-muted">psql — databases</span>
        </div>
        <div className="p-5 font-mono text-sm">
          <p className="text-cyan mb-4">$ SELECT * FROM databases;</p>
          {items.map((s) => (
            <div
              key={s.name}
              className="flex items-center gap-4 py-3 px-3 -mx-3 border-b border-white/5 hover:bg-electric/10 transition-colors"
            >
              <SkillIcon skill={s} size={28} />
              <span className="text-electric w-28 shrink-0">{s.name}</span>
              <span className="text-muted">{s.desc}</span>
            </div>
          ))}
          <p className="mt-4 text-neon">{items.length} rows<span className="animate-pulse">_</span></p>
        </div>
      </div>
    </Reveal>
  );
}

/* TOOLS: floating chips */
function Tools({items}) {
  return (
    <div className="flex flex-wrap gap-5">
      {items.map((s, i) => (
        <motion.div
          key={s.name}
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 3 + i * 0.4, ease: "easeInOut" }}
          className="flex items-center gap-4 bg-card border border-white/10 px-5 py-4 hover:border-cyan hover:shadow-[0_0_24px_rgba(0,245,212,0.3)] transition-all"
        >
          <SkillIcon skill={s} size={32} />
          <div>
            <p className="font-display font-bold">{s.name}</p>
            <p className="text-xs text-muted">{s.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default function Skills() {
  const { skills } = usePortfolio();

  return (
    <section id="skills" className="px-5 py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeading num="02" label="SKILLS" title="MY TECHNICAL ARSENAL." />

        <div className="space-y-20">
          <div>
            <CategoryLabel index="01" title="Frontend development" accent="#00D9FF" />
            <Frontend items={skills.frontend} />
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <CategoryLabel index="02" title="Backend development" accent="#9D4EDD" />
              <Backend items={skills.backend} />
            </div>
            <div>
              <CategoryLabel index="03" title="Database" accent="#00F5D4" />
              <Database items={skills.database} />
            </div>
          </div>

          <div>
            <CategoryLabel index="04" title="Development tools" accent="#FF2E93" />
            <Tools items={skills.tools} />
          </div>
        </div>
      </div>
    </section>
  );
}