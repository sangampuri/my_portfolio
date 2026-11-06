// github/demo: null = shows "SOON" button. Never put fake URLs.
// image: path in /public (example "/projects/student.png") or null = built-in illustration.
export const projects = [
  {
    slug: "student-management-system",
    num: "01",
    title: "Student Management System",
    description: "A web application for managing student records with CRUD functionality.",
    tech: ["Python", "Django", "SQLite", "HTML", "CSS"],
    status: "Completed",
    github: null,
    demo: null,
    image: null,
    art: "students",
    accent: "#00D9FF",
  },
  {
    slug: "book-management-system",
    num: "02",
    title: "Book Management System",
    description:
      "A book management application supporting adding, displaying, updating, and deleting book records.",
    tech: ["Python", "Django", "SQLite"],
    status: "Completed",
    github: null,
    demo: null,
    image: null,
    art: "books",
    accent: "#9D4EDD",
  },
  {
    slug: "student-rest-api",
    num: "03",
    title: "Student REST API",
    description:
      "A RESTful API that allows clients to retrieve and manage student information.",
    tech: ["Django REST Framework", "Python", "SQLite"],
    status: "Completed",
    github: null,
    demo: null,
    image: null,
    art: "api",
    accent: "#00F5D4",
  },
  {
    slug: "rani-mahal-banquet",
    num: "04",
    title: "Rani Mahal Banquet Reservation",
    description:
      "A banquet reservation website that allows users to explore halls, menus, and booking options.",
    tech: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"],
    status: "Completed",
    github: null,
    demo: null,
    image: null,
    art: "banquet",
    accent: "#FF2E93",
  },
];