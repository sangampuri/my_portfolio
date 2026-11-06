from django.core.management.base import BaseCommand
from django.utils.text import slugify

from portfolio.models import Experience, Profile, Project, Skill

# (name, icon, variant, invert, description)
SKILLS = {
    "frontend": [
        ("HTML5", "html5", "original", False, "Semantic page structure."),
        ("CSS3", "css3", "original", False, "Layouts, animation, styling."),
        ("JavaScript", "javascript", "original", False, "Interactive frontend logic."),
        ("React.js", "react", "original", False, "Component-based interfaces."),
        ("Tailwind CSS", "tailwindcss", "original", False, "Utility-first styling."),
    ],
    "backend": [
        ("Python", "python", "original", False, "Main language for backend work."),
        ("Django", "django", "plain", True, "Structured, database-driven web apps."),
        ("Django REST Framework", "django", "plain", True, "APIs for React frontends."),
        ("PHP", "php", "original", False, "Server-side web pages and forms."),
    ],
    "database": [
        ("SQLite", "sqlite", "original", False, "Light DB for development."),
        ("MySQL", "mysql", "original", False, "Relational DB for web projects."),
        ("PostgreSQL", "postgresql", "original", False, "Production-grade relational DB."),
    ],
    "tools": [
        ("Git", "git", "original", False, "Version control."),
        ("GitHub", "github", "original", True, "Code hosting and collaboration."),
        ("VS Code", "vscode", "original", False, "Daily editor."),
        ("Figma", "figma", "original", False, "Interface design."),
    ],
}

# (title, description, technologies, art, accent)
PROJECTS = [
    ("Student Management System",
     "A web application for managing student records with CRUD functionality.",
     "Python, Django, SQLite, HTML, CSS", "students", "#00D9FF"),
    ("Book Management System",
     "A book management application supporting adding, displaying, updating, and deleting book records.",
     "Python, Django, SQLite", "books", "#9D4EDD"),
    ("Student REST API",
     "A RESTful API that allows clients to retrieve and manage student information.",
     "Django REST Framework, Python, SQLite", "api", "#00F5D4"),
    ("Rani Mahal Banquet Reservation",
     "A banquet reservation website that allows users to explore halls, menus, and booking options.",
     "HTML, CSS, JavaScript, PHP, MySQL", "banquet", "#FF2E93"),
]

# (title, description, icon)
JOURNEY = [
    ("Started learning programming", "First steps into code and problem solving.", "Terminal"),
    ("Completed Python fundamentals", "Syntax, data structures, functions, OOP basics.", "Code"),
    ("Learned Django fundamentals", "Models, views, templates, URL routing.", "Layers"),
    ("Built CRUD applications", "Student and book management systems.", "Database"),
    ("Explored Django authentication", "Login, logout, permissions.", "Lock"),
    ("Learned Django REST Framework", "Serializers, viewsets, API design.", "Server"),
    ("Started building full-stack apps", "React frontends talking to Django backends.", "Boxes"),
    ("Exploring creative web development", "3D, animation, interactive experiences.", "Sparkles"),
]


class Command(BaseCommand):
    help = "Load starter portfolio content (safe to run more than once)."

    def handle(self, *args, **options):
        if not Profile.objects.exists():
            Profile.objects.create(
                name="Sangam Puri",
                role="Python Developer | Full-Stack Developer | AI Enthusiast",
                introduction=(
                    "I'm a developer passionate about building interactive digital "
                    "experiences, powerful backend systems, and creative web applications."
                ),
                about=(
                    "I'm Sangam, a developer from Nepal who loves turning ideas into working "
                    "software. Python and Django are my home base, and I enjoy wrapping them "
                    "in creative, interactive frontends."
                ),
                location="Nepal",
            )
            self.stdout.write("Created profile")

        for category, items in SKILLS.items():
            for order, (name, icon, variant, invert, desc) in enumerate(items):
                Skill.objects.update_or_create(
                    name=name,
                    category=category,
                    defaults={
                        "icon": icon,
                        "icon_variant": variant,
                        "invert_icon": invert,
                        "description": desc,
                        "display_order": order,
                    },
                )

        for order, (title, desc, tech, art, accent) in enumerate(PROJECTS):
            Project.objects.update_or_create(
                slug=slugify(title),
                defaults={
                    "title": title,
                    "description": desc,
                    "technologies": tech,
                    "art": art,
                    "accent": accent,
                    "status": "Completed",
                    "featured": True,
                    "display_order": order,
                },
            )

        for order, (title, desc, icon) in enumerate(JOURNEY):
            Experience.objects.update_or_create(
                title=title,
                defaults={"description": desc, "icon": icon, "display_order": order},
            )

        self.stdout.write(self.style.SUCCESS("Seed done."))