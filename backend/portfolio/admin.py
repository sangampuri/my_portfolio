from django.contrib import admin

# Register your models here.
from django.contrib import admin

from .models import Experience, Profile, Project, Skill

admin.site.site_header = "DevPort Admin"
admin.site.site_title = "DevPort"
admin.site.index_title = "Manage portfolio content"


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("name", "role", "email", "location")

    def has_add_permission(self, request):
        return not Profile.objects.exists()  # only one profile


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "display_order", "icon")
    list_filter = ("category",)
    list_editable = ("display_order",)
    search_fields = ("name",)


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("title", "status", "featured", "display_order")
    list_filter = ("status", "featured")
    list_editable = ("featured", "display_order")
    search_fields = ("title", "technologies")
    prepopulated_fields = {"slug": ("title",)}


@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ("title", "date_label", "display_order")
    list_editable = ("display_order",)