import { motion } from "framer-motion";
import { ExternalLink, GitBranch } from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/Reveal";
import ProjectArt from "../components/ProjectArt";
import useTilt from "../hooks/useTilt";
import { projects } from "../data/projects";

function LinkButton({ href, icon: Icon, label, accent }) {
  if (!href) {
    return (
      <span
        title="Add URL in src/data/projects.js"
        className="inline-flex items-center gap-2 font-mono text-[11px] tracking-widest text-muted/60 border border-dashed border-white/15 px-4 py-2 cursor-not-allowed"
      >
        <Icon size={14} /> {label} · SOON
      </span>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{ borderColor: accent, color: accent }}
      className="inline-flex items-center gap-2 font-mono text-[11px] tracking-widest border px-4 py-2 hover:bg-white/5 transition-colors"
    >
      <Icon size={14} /> {label}
    </a>
  );
}

function Visual({ p }) {
  const tilt = useTilt(6);
  return (
    <div
      {...tilt}
      className="group relative overflow-hidden aspect-[3/2] bg-card border transition-transform duration-150"
      style={{
        borderColor: `${p.accent}66`,
        boxShadow: `0 30px 60px rgba(0,0,0,.6), 0 0 40px ${p.accent}22`,
      }}
    >
      <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-110">
        {p.image ? (
          <img src={p.image} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <ProjectArt name={p.art} />
        )}
      </div>
      <span className="absolute top-3 left-3 font-mono text-[10px] tracking-[0.25em] px-2 py-1 bg-bg" style={{ color: p.accent }}>
        PROJECT_{p.num}
      </span>
    </div>
  );
}

function Project({ p, flip }) {
  return (
    <article className="grid lg:grid-cols-12 gap-8 items-center">
      <div className={`lg:col-span-7 ${flip ? "lg:order-2" : ""}`}>
        <Reveal>
          <Visual p={p} />
        </Reveal>
      </div>

      <div
        className={`lg:col-span-5 relative z-10 ${
          flip ? "lg:order-1 lg:-mr-20" : "lg:-ml-20"
        } ${flip ? "" : "lg:translate-y-8"}`}
      >
        <Reveal delay={0.1} y={40}>
          <div className="bg-bg2 border border-white/10 p-6 lg:p-8 shadow-[0_24px_48px_rgba(0,0,0,0.6)]">
            <motion.span
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="block font-tech text-6xl font-extrabold text-transparent leading-none mb-3"
              style={{ WebkitTextStroke: `1px ${p.accent}` }}
            >
              {p.num}
            </motion.span>

            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-[10px] tracking-[0.25em] px-2 py-1 border border-cyan/50 text-cyan">
                {p.status.toUpperCase()}
              </span>
            </div>

            <h3 className="font-display font-bold text-2xl md:text-3xl leading-tight">{p.title}</h3>
            <p className="mt-3 text-muted leading-relaxed">{p.description}</p>

            <div className="mt-5 flex flex-wrap gap-2">
              {p.tech.map((t) => (
                <span key={t} className="font-mono text-[11px] px-2.5 py-1 bg-card border border-white/10 text-electric">
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <LinkButton href={p.github} icon={GitBranch} label="CODE" accent={p.accent} />
              <LinkButton href={p.demo} icon={ExternalLink} label="LIVE DEMO" accent={p.accent} />
            </div>
          </div>
        </Reveal>
      </div>
    </article>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="px-5 py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <SectionHeading num="03" label="PROJECTS" title="THINGS I'VE BUILT." />
        <div className="space-y-24 lg:space-y-32">
          {projects.map((p, i) => (
            <Project key={p.slug} p={p} flip={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}