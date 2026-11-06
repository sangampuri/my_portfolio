from django.http import Http404
from rest_framework import generics

from .models import Experience, Profile, Project, Skill
from .serializers import (
    ExperienceSerializer, ProfileSerializer, ProjectSerializer, SkillSerializer,
)


class ProfileView(generics.RetrieveAPIView):
    serializer_class = ProfileSerializer

    def get_object(self):
        profile = Profile.objects.first()
        if profile is None:
            raise Http404("Profile not set up yet.")
        return profile


class SkillListView(generics.ListAPIView):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    pagination_class = None


class ProjectListView(generics.ListAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    pagination_class = None


class FeaturedProjectListView(ProjectListView):
    queryset = Project.objects.filter(featured=True)


class ExperienceListView(generics.ListAPIView):
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer
    pagination_class = None