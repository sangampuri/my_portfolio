from rest_framework import serializers

from .models import Experience, Profile, Project, Skill


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = [
            "name", "role", "introduction", "about", "email", "location",
            "github_url", "github_username", "linkedin_url", "profile_image",
        ]


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = [
            "id", "name", "category", "description",
            "icon", "icon_variant", "invert_icon", "proficiency",
        ]


class ProjectSerializer(serializers.ModelSerializer):
    technologies = serializers.ListField(source="tech_list", read_only=True)

    class Meta:
        model = Project
        fields = [
            "id", "title", "slug", "description", "technologies", "image",
            "art", "accent", "status", "github_url", "live_demo_url", "featured",
        ]


class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = ["id", "title", "description", "date_label", "icon"]