from rest_framework import serializers
from .models import Project, Language, Sentence


class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = ["id", "name", "language_code", "modified_at", "created_at"]


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = [
            "id",
            "name",
            "article_name",
            "language_id",
            "is_completed",
            "created_by",
            "annotated_by",
            "modified_at",
            "created_at",
        ]


class SentenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sentence
        fields = [
            "id",
            "project_id",
            "original_sentence",
            "annotated_sentence",
            "modified_at",
            "created_at",
        ]
