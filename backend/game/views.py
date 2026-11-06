from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle

from .models import GameScore
from .serializers import LeaderboardSerializer, ScoreSubmitSerializer


class LeaderboardView(generics.ListAPIView):
    serializer_class = LeaderboardSerializer
    pagination_class = None

    def get_queryset(self):
        return GameScore.objects.all()[:10]


class ScoreCreateView(generics.CreateAPIView):
    serializer_class = ScoreSubmitSerializer
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "score"

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        obj = serializer.save()
        rank = GameScore.objects.filter(score__gt=obj.score).count() + 1
        return Response(
            {"player_name": obj.player_name, "score": obj.score, "rank": rank},
            status=status.HTTP_201_CREATED,
        )