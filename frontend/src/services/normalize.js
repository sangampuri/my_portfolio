export function groupSkills(list) {
  const out = { frontend: [], backend: [], database: [], tools: [] };
  list.forEach((s) => {
    if (!out[s.category]) return;
    out[s.category].push({
      name: s.name,
      icon: s.icon,
      variant: s.icon_variant,
      invert: s.invert_icon,
      desc: s.description,
    });
  });
  return out;
}

export const normalizeProjects = (list) =>
  list.map((p, i) => ({
    slug: p.slug,
    num: String(i + 1).padStart(2, "0"),
    title: p.title,
    description: p.description,
    tech: Array.isArray(p.technologies)
      ? p.technologies
      : typeof p.technologies === "string"
      ? p.technologies.split(",").map((s) => s.trim()).filter(Boolean)
      : [],
    status: p.status,
    github: p.github_url || null,
    demo: p.live_demo_url || null,
    image: p.image || null,
    art: p.art,
    accent: p.accent || "#00D9FF",
  }));

export const normalizeJourney = (list) =>
  list.map((e) => ({
    title: e.title,
    desc: e.description,
    date: e.date_label || "",
    icon: e.icon || "Code",
  }));