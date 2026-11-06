import re

from rest_framework import serializers

from .models import ContactMessage

URL_RE = re.compile(r"https?://|www\.", re.IGNORECASE)


class ContactSerializer(serializers.ModelSerializer):
    # honeypot: real users never fill this
    website = serializers.CharField(required=False, allow_blank=True, write_only=True)

    class Meta:
        model = ContactMessage
        fields = ["name", "email", "subject", "message", "website"]

    def validate_name(self, v):
        v = v.strip()
        if len(v) < 2:
            raise serializers.ValidationError("Name needs 2+ characters.")
        return v

    def validate_subject(self, v):
        v = v.strip()
        if len(v) < 3:
            raise serializers.ValidationError("Subject needs 3+ characters.")
        return v

    def validate_message(self, v):
        v = v.strip()
        if len(v) < 10:
            raise serializers.ValidationError("Message needs 10+ characters.")
        if len(URL_RE.findall(v)) > 3:
            raise serializers.ValidationError("Too many links.")
        return v

    def validate_website(self, v):
        if v:
            raise serializers.ValidationError("Spam detected.")
        return v

    def create(self, validated_data):
        validated_data.pop("website", None)
        return super().create(validated_data)