// shape: box | stack | atom | monitor. position = [x, y, z] in the scene.
export const playgroundItems = [
  {
    id: "python", name: "Python", shape: "box", text: "PY", color: "#00D9FF",
    position: [-2, 0.9, 1],
    fact: "Python is one of my favorite tools for backend development.",
  },
  {
    id: "django", name: "Django", shape: "box", text: "DJ", color: "#00F5D4",
    position: [0, 0.9, 1.2],
    fact: "I use Django to build structured and database-driven web applications.",
  },
  {
    id: "javascript", name: "JavaScript", shape: "box", text: "JS", color: "#FFD43B",
    position: [2, 0.9, 1],
    fact: "JavaScript helps me create interactive frontend experiences.",
  },
  {
    id: "database", name: "Databases", shape: "stack", color: "#9D4EDD",
    position: [-0.8, 0.9, -1.2],
    fact: "SQLite, MySQL and PostgreSQL store the data behind my projects.",
  },
  {
    id: "react", name: "React", shape: "atom", color: "#7DF9FF",
    position: [-3.5, 2.1, -2.5],
    fact: "React lets me build interfaces out of small, reusable components.",
  },
  {
    id: "terminal", name: "Terminal", shape: "monitor", color: "#FF2E93",
    position: [3.5, 2.7, -2],
    fact: "Much of my work happens in a terminal and a code editor.",
  },
];