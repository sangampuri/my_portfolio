// icon = devicon folder name. variant default "original". invert = dark icon on dark bg.
export const skills = {
  frontend: [
    { name: "HTML5", icon: "html5", desc: "Semantic page structure." },
    { name: "CSS3", icon: "css3", desc: "Layouts, animation, styling." },
    { name: "JavaScript", icon: "javascript", desc: "Interactive frontend logic." },
    { name: "React.js", icon: "react", desc: "Component-based interfaces." },
    { name: "Tailwind CSS", icon: "tailwindcss", desc: "Utility-first styling." },
  ],
  backend: [
    { name: "Python", icon: "python", desc: "Main language for backend work." },
    { name: "Django", icon: "django", variant: "plain", invert: true, desc: "Structured, database-driven web apps." },
    { name: "Django REST Framework", icon: "django", variant: "plain", invert: true, desc: "APIs for React frontends." },
    { name: "PHP", icon: "php", desc: "Server-side web pages and forms." },
  ],
  database: [
    { name: "SQLite", icon: "sqlite", desc: "Light DB for development." },
    { name: "MySQL", icon: "mysql", desc: "Relational DB for web projects." },
    { name: "PostgreSQL", icon: "postgresql", desc: "Production-grade relational DB." },
  ],
  tools: [
    { name: "Git", icon: "git", desc: "Version control." },
    { name: "GitHub", icon: "github", invert: true, desc: "Code hosting and collaboration." },
    { name: "VS Code", icon: "vscode", desc: "Daily editor." },
    { name: "Figma", icon: "figma", desc: "Interface design." },
  ],
};