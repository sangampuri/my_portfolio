import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/Reveal";
import { usePortfolio } from "../context/PortfolioData";

function Counter({ to }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      ref.current.textContent = to;
      return;
    }
    const controls = animate(0, to, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = Math.round(v);
      },
    });
    return () => controls.stop();
  }, [inView, to]);

  return <span ref={ref}>0</span>;
}

export default function Stats() {
  const { profile, projects, skills, journey } = usePortfolio();
  const [repos, setRepos] = useState(null);
  const user = profile.github_username;

  useEffect(() => {
    if (!user) return;
    const ctrl = new AbortController();
    fetch(`https://api.github.com/users/${user}`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => setRepos(d.public_repos))
      .catch(() => {});
    return () => ctrl.abort();
  }, [user]);

  const stats = [
    { label: "projects_completed", value: projects.filter((p) => p.status === "Completed").length },
    { label: "technologies_explored", value: Object.values(skills).flat().length },
    { label: "learning_milestones", value: journey.length },
  ];
  if (user && repos != null) stats.push({ label: "github_repositories", value: repos });

  return (
    <section id="stats" className="px-5 py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeading num="07" label="STATS" title="BEHIND THE TERMINAL." />
        <Reveal>
          <div className="grid grid-cols-2 lg:grid-flow-col lg:auto-cols-fr gap-y-10 border-y border-white/10 py-10">
            {stats.map((s, i) => (
              <div key={s.label} className={`px-6 ${i > 0 ? "lg:border-l lg:border-white/10" : ""}`}>
                <p className="font-tech text-6xl md:text-7xl font-extrabold bg-gradient-to-br from-electric to-neon bg-clip-text text-transparent">
                  <Counter to={s.value} />
                </p>
                <p className="mt-3 font-mono text-xs tracking-wider text-muted">&gt; {s.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}