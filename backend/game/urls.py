from django.urls import path

from . import views

urlpatterns = [
    path("leaderboard/", views.LeaderboardView.as_view()),
    path("scores/", views.ScoreCreateView.as_view()),
]