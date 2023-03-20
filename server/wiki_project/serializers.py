from rest_framework import serializers
from .models import Project, Language, Sentence


class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = ["id", "name", "language_code", "modified_at", "created_at"]


class ProjectSerializer(serializers.ModelSerializer):
    is_completed = serializers.BooleanField(default=False)

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
        extra_kwargs = {
            "created_by": {"required": False},
        }


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


class DeleteSerializer(serializers.Serializer):
    ids = serializers.ListField(child=serializers.IntegerField())


class ProjectResponseSerializer(serializers.ModelSerializer):
    language_id = serializers.SerializerMethodField("get_language")
    is_completed = serializers.BooleanField()
    sentences = serializers.SerializerMethodField("get_sentences")
    created_by = serializers.SerializerMethodField("get_created_by")
    annotated_by = serializers.SerializerMethodField("get_annotated_by")

    def get_language(self, obj):
        serialized = LanguageSerializer(instance=obj.language_id)
        return serialized.data

    def get_sentences(self, obj):
        serialized = SentenceSerializer(
            instance=Sentence.objects.filter(project_id=obj).order_by("id"), many=True
        )
        return serialized.data

    def get_created_by(self, obj):
        serilized = UserResponseSerializer(instance=obj.created_by)
        return serilized.data

    def get_annotated_by(self, obj):
        serilized = UserResponseSerializer(instance=obj.annotated_by)
        return serilized.data

    class Meta:
        model = Project
        fields = [
            "id",
            "name",
            "article_name",
            "language_id",
            "sentences",
            "is_completed",
            "created_by",
            "annotated_by",
            "modified_at",
            "created_at",
        ]


class UserResponseSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    username = serializers.CharField()
    email = serializers.EmailField(allow_blank=True, allow_null=True)
    first_name = serializers.CharField(allow_blank=True, allow_null=True)
    last_name = serializers.CharField(allow_blank=True, allow_null=True)


class ProjecListResponseSerializer(serializers.ModelSerializer):
    language_id = serializers.SerializerMethodField("get_language")
    is_completed = serializers.BooleanField(default=False)
    created_by = serializers.SerializerMethodField("get_created_by")
    annotated_by = serializers.SerializerMethodField("get_annotated_by")

    def get_language(self, obj):
        serialized = LanguageSerializer(instance=obj.language_id)
        return serialized.data

    def get_created_by(self, obj):
        serilized = UserResponseSerializer(instance=obj.created_by)
        return serilized.data

    def get_annotated_by(self, obj):
        serilized = UserResponseSerializer(instance=obj.annotated_by)
        return serilized.data

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
