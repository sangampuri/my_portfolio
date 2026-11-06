from rest_framework import serializers

from .models import GameScore

MAX_SCORE = 200_000
MAX_SCORE_PER_SECOND = 100  # tune after game is built
MIN_DURATION = 3


class ScoreSubmitSerializer(serializers.ModelSerializer):
    player_name = serializers.RegexField(
        r"^[A-Za-z0-9_]{3,16}$",
        error_messages={"invalid": "Nickname: 3-16 letters, numbers or underscore."},
    )
    score = serializers.IntegerField(min_value=0, max_value=MAX_SCORE)
    duration = serializers.IntegerField(min_value=MIN_DURATION, max_value=3600)

    class Meta:
        model = GameScore
        fields = ["player_name", "score", "duration"]

    def validate(self, attrs):
        if attrs["score"] > attrs["duration"] * MAX_SCORE_PER_SECOND + 50:
            raise serializers.ValidationError({"score": "Score not plausible for this run."})
        return attrs


class LeaderboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameScore
        fields = ["player_name", "score", "created_at"]