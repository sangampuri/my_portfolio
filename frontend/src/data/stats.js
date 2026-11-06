import { projects } from "./projects";
import { skills } from "./skills";
import { journey } from "./journey";

// Put your GitHub username to show real public repo count. null = hidden.
export const githubUser = null;

export const baseStats = [
  {
    label: "projects_completed",
    value: projects.filter((p) => p.status === "Completed").length,
  },
  { label: "technologies_explored", value: Object.values(skills).flat().length },
  { label: "learning_milestones", value: journey.length },
];