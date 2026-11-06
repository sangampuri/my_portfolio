import { createContext, useContext, useEffect, useState } from "react";
import { getProfile, getSkills, getProjects, getExperience } from "../services/api";
import { groupSkills, normalizeProjects, normalizeJourney } from "../services/normalize";
import { fallbackProfile } from "../data/profile";
import { skills as fallbackSkills } from "../data/skills";
import { projects as fallbackProjects } from "../data/projects";
import { journey as fallbackJourney } from "../data/journey";

const Ctx = createContext(null);

export function PortfolioProvider({ children }) {
  // start with local data, so page never shows empty
  const [data, setData] = useState({
    profile: fallbackProfile,
    skills: fallbackSkills,
    projects: fallbackProjects,
    journey: fallbackJourney,
  });

  useEffect(() => {
    const ctrl = new AbortController();
    const { signal } = ctrl;

    Promise.allSettled([
      getProfile(signal),
      getSkills(signal),
      getProjects(signal),
      getExperience(signal),
    ]).then(([p, s, pr, e]) => {
      if (signal.aborted) return;
      setData((prev) => ({
        profile: p.status === "fulfilled" ? { ...prev.profile, ...p.value } : prev.profile,
        skills:
          s.status === "fulfilled" && s.value.length ? groupSkills(s.value) : prev.skills,
        projects:
          pr.status === "fulfilled" && pr.value.length
            ? normalizeProjects(pr.value)
            : prev.projects,
        journey:
          e.status === "fulfilled" && e.value.length
            ? normalizeJourney(e.value)
            : prev.journey,
      }));
    });

    return () => ctrl.abort();
  }, []);

  return <Ctx.Provider value={data}>{children}</Ctx.Provider>;
}

export function usePortfolio() {
  const v = useContext(Ctx);
  if (!v) throw new Error("usePortfolio must be used inside PortfolioProvider");
  return v;
}