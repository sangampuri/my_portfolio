from django.urls import path

from . import views

urlpatterns = [
    path("profile/", views.ProfileView.as_view()),
    path("skills/", views.SkillListView.as_view()),
    path("projects/", views.ProjectListView.as_view()),
    path("projects/featured/", views.FeaturedProjectListView.as_view()),
    path("experience/", views.ExperienceListView.as_view()),
]