from django.db import models


class GameScore(models.Model):
    player_name = models.CharField(max_length=16)
    score = models.PositiveIntegerField()
    duration = models.PositiveIntegerField(help_text="Run length in seconds")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-score", "created_at"]

    def __str__(self):
        return f"{self.player_name}: {self.score}"