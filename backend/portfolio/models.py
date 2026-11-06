from django.core.validators import MaxValueValidator
from django.db import models
from django.utils.text import slugify


class Profile(models.Model):
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=200)
    introduction = models.TextField()
    about = models.TextField(blank=True)
    email = models.EmailField(blank=True)
    location = models.CharField(max_length=100, blank=True)
    github_url = models.URLField(blank=True)
    github_username = models.CharField(max_length=39, blank=True)
    linkedin_url = models.URLField(blank=True)
    profile_image = models.ImageField(upload_to="profile/", blank=True, null=True)

    def __str__(self):
        return self.name


class Skill(models.Model):
    class Category(models.TextChoices):
        FRONTEND = "frontend", "Frontend development"
        BACKEND = "backend", "Backend development"
        DATABASE = "database", "Database"
        TOOLS = "tools", "Development tools"

    name = models.CharField(max_length=80)
    category = models.CharField(max_length=20, choices=Category.choices)
    description = models.CharField(max_length=200, blank=True)
    icon = models.CharField(max_length=60, blank=True, help_text="Devicon folder name, e.g. python")
    icon_variant = models.CharField(max_length=30, default="original")
    invert_icon = models.BooleanField(default=False, help_text="Tick for dark icons on dark background")
    proficiency = models.PositiveSmallIntegerField(
        null=True, blank=True, validators=[MaxValueValidator(100)],
        help_text="Optional, 0-100. Leave empty to hide.",
    )
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["category", "display_order", "name"]

    def __str__(self):
        return f"{self.name} ({self.category})"


class Project(models.Model):
    class Status(models.TextChoices):
        COMPLETED = "Completed", "Completed"
        IN_PROGRESS = "In progress", "In progress"
        PLANNED = "Planned", "Planned"

    title = models.CharField(max_length=150)
    slug = models.SlugField(max_length=160, unique=True, blank=True)
    description = models.TextField()
    technologies = models.CharField(max_length=300, help_text="Comma separated: Python, Django, SQLite")
    image = models.ImageField(upload_to="projects/", blank=True, null=True)
    art = models.CharField(max_length=30, blank=True, help_text="Fallback illustration: students, books, api, banquet")
    accent = models.CharField(max_length=7, default="#00D9FF", help_text="Hex colour")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.COMPLETED)
    github_url = models.URLField(blank=True)
    live_demo_url = models.URLField(blank=True)
    featured = models.BooleanField(default=False)
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["display_order", "id"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    @property
    def tech_list(self):
        return [t.strip() for t in self.technologies.split(",") if t.strip()]

    def __str__(self):
        return self.title


class Experience(models.Model):
    title = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    date_label = models.CharField(max_length=50, blank=True, help_text="Optional, e.g. 2024")
    icon = models.CharField(max_length=40, blank=True, help_text="Lucide icon name, e.g. Terminal")
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["display_order", "id"]
        verbose_name_plural = "Journey milestones"

    def __str__(self):
        return self.title