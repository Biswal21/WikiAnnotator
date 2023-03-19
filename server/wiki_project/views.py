from django.db.models import Q
from .serializers import (
    ProjectSerializer,
    LanguageSerializer,
    SentenceSerializer,
    DeleteSerializer,
    ProjectResponseSerializer,
)
from .models import Project, Language, Sentence
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes

from wikipediaapi import Wikipedia
from pysbd import Segmenter

# Create your views here.


# Language ViewSet
class LanguageViewSet(viewsets.ViewSet):
    @extend_schema(
        request=LanguageSerializer,
        responses={201: LanguageSerializer},
    )
    @action(
        detail=False, methods=["post"], url_path="create", permission_classes=[AllowAny]
    )
    def add_languuage(self, request):
        serialized = LanguageSerializer(data=request.data, many=True)
        if serialized.is_valid():
            serialized.save()
            return Response(data=serialized.data, status=status.HTTP_201_CREATED)
        return Response(data=serialized.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        parameters=[OpenApiParameter("id", OpenApiTypes.INT, OpenApiParameter.PATH)],
        responses={200: LanguageSerializer},
    )
    @action(detail=True, methods=["get"], url_path="read")
    def get_language_name(self, request, pk=None):
        try:
            language = Language.objects.get(id=pk)
        except Language.DoesNotExist:
            return Response(
                data={"message": "Language does not exist"},
                status=status.HTTP_404_NOT_FOUND,
            )
        serialized = LanguageSerializer(instance=language)
        return Response(data=serialized.data, status=status.HTTP_200_OK)

    @extend_schema(
        responses={200: LanguageSerializer(many=True)},
    )
    @action(detail=False, methods=["get"], url_path="read")
    def get_all_languages(self, request):
        queryset = Language.objects.all()

        try:
            serialized = LanguageSerializer(instance=queryset, many=True)
        except Exception:
            return Response(
                {"detail": "Serializer Error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        return Response(data=serialized.data, status=status.HTTP_200_OK)

    @extend_schema(
        request=LanguageSerializer,
        responses={200: LanguageSerializer},
    )
    @action(detail=True, methods=["put"], url_path="update")
    def update_language(self, request):
        try:
            lang_id = request.data["id"]
        except KeyError:
            return Response(
                data={"message": "Language id is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            language = Language.objects.get(id=lang_id)
        except Language.DoesNotExist:
            return Response(
                data={"message": "Language does not exist"},
                status=status.HTTP_404_NOT_FOUND,
            )
        serialized = LanguageSerializer(instance=language, data=request.data)
        if serialized.is_valid():
            serialized.save()
            return Response(data=serialized.data, status=status.HTTP_200_OK)
        return Response(data=serialized.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        request=DeleteSerializer,
        responses={204: DeleteSerializer},
    )
    @action(detail=False, methods=["delete"], url_path="delete")
    def delete_languages(self, request):
        serialized = DeleteSerializer(data=request.data)

        if serialized.is_valid():
            listings = Language.objects.filter(id__in=request.data["ids"])

            try:
                listings.delete()
            except Exception:
                return Response(
                    {"message": "Internal Server Error"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

            return Response(data=request.data, status=status.HTTP_204_NO_CONTENT)
        return Response(data=serialized.errors, status=status.HTTP_400_BAD_REQUEST)


# Sentence ViewSet
class SentenceViewSet(viewsets.ViewSet):
    @extend_schema(
        request=SentenceSerializer,
        responses={201: SentenceSerializer},
    )
    @action(
        detail=False, methods=["post"], url_path="create", permission_classes=[AllowAny]
    )
    def add_sentence(self, request):
        serialized = SentenceSerializer(data=request.data, many=True)
        if serialized.is_valid():
            serialized.save()
            return Response(data=serialized.data, status=status.HTTP_201_CREATED)
        return Response(data=serialized.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        responses={200: SentenceSerializer},
    )
    @action(detail=True, methods=["get"], url_path="read")
    def get_sentence(self, request, pk=None):
        try:
            sentence_obj = Sentence.objects.get(id=pk)
        except Sentence.DoesNotExist:
            return Response(
                data={"message": "Sentence does not exist"},
                status=status.HTTP_404_NOT_FOUND,
            )
        serialized = SentenceSerializer(instance=sentence_obj)
        return Response(data=serialized.data, status=status.HTTP_200_OK)

    @extend_schema(
        responses={200: LanguageSerializer(many=True)},
    )
    @action(detail=False, methods=["get"], url_path="read")
    def get_all_sentences(self, request):
        queryset = Sentence.objects.all()

        try:
            serialized = SentenceSerializer(instance=queryset, many=True)
        except Exception:
            return Response(
                {"detail": "Serializer Error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        return Response(data=serialized.data, status=status.HTTP_200_OK)

    @extend_schema(
        request=SentenceSerializer,
        responses={200: SentenceSerializer},
    )
    @action(detail=True, methods=["put"], url_path="update")
    def update_language(self, request):
        try:
            sentence_id = request.data["id"]
        except KeyError:
            return Response(
                data={"message": "Sentence id is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            language = Language.objects.get(id=sentence_id)
        except Language.DoesNotExist:
            return Response(
                data={"message": "Sentence does not exist"},
                status=status.HTTP_404_NOT_FOUND,
            )
        serialized = SentenceSerializer(instance=language, data=request.data)
        if serialized.is_valid():
            serialized.save()
            return Response(data=serialized.data, status=status.HTTP_200_OK)
        return Response(data=serialized.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        request=DeleteSerializer,
        responses={204: DeleteSerializer},
    )
    @action(detail=False, methods=["delete"], url_path="delete")
    def delete_sentences(self, request):
        serialized = DeleteSerializer(data=request.data)

        if serialized.is_valid():
            listings = Sentence.objects.filter(id__in=request.data["ids"])

            try:
                listings.delete()
            except Exception:
                return Response(
                    {"message": "Internal Server Error"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

            return Response(data=request.data, status=status.HTTP_204_NO_CONTENT)
        return Response(data=serialized.errors, status=status.HTTP_400_BAD_REQUEST)


# Project ViewSet
class ProjectViewSet(viewsets.ViewSet):
    @extend_schema(
        request=ProjectSerializer,
        responses={201: ProjectSerializer},
    )
    @action(
        detail=False, methods=["post"], url_path="create", permission_classes=[AllowAny]
    )
    def add_project(self, request):
        user = request.user
        print("User from request:=======", user)

        try:
            allowed = user.groups.filter(name="Manager").exists()
        except Exception:
            return Response(
                {"message": "Internal Server Error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        if allowed:
            # Todo; is user or user.id
            request.data["created_by"] = user.id
            serialized = ProjectSerializer(data=request.data, many=True)
            if serialized.is_valid():
                project = serialized.save()
                try:
                    page = Wikipedia("en").page(request.data["article_name"])
                except Exception:
                    return Response(
                        {"error": "Cannot find the article"},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    )

                if page.exists():
                    summary = page.summary
                else:
                    return Response(
                        {"error": "Article does not exist"},
                        status=status.HTTP_404_NOT_FOUND,
                    )
                print("Summary:============", summary)
                try:
                    segmenter = Segmenter(language="en", clean=False)
                    summary = segmenter.segment(summary)
                except Exception:
                    return Response(
                        {"error": "Cannot summarize the article"},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    )
                print("Segmented summary:============", summary)
                for sentence in summary:
                    if sentence == "":
                        sentence_serialized = SentenceSerializer(
                            data={"original_sentence": sentence, "project_id": project}
                        )
                        if sentence_serialized.is_valid():
                            sentence_serialized.save()
                        else:
                            return Response(
                                data=sentence_serialized.errors,
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            )
                return Response(data=serialized.data, status=status.HTTP_201_CREATED)
            return Response(data=serialized.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(
                {"error": "forbidden"},
                status=status.HTTP_403_FORBIDDEN,
            )

    @extend_schema(
        parameters=[OpenApiParameter("id", OpenApiTypes.INT, OpenApiParameter.PATH)],
        responses={200: ProjectResponseSerializer},
    )
    @action(
        detail=True,
        methods=["get"],
        url_path="read",
        permission_classes=[
            AllowAny,
        ],
    )
    def get_project_by_id(self, request, pk=None):
        try:
            project = Project.objects.get(id=pk)
            if (
                project.created_by == request.user
                or project.annotated_by == request.user
            ):
                pass
            else:
                return Response(
                    {"error": "forbidden"},
                    status=status.HTTP_403_FORBIDDEN,
                )
        except Project.DoesNotExist:
            return Response(
                data={"message": "Project does not exist"},
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            sentences = Sentence.objects.filter(project_id=pk)
        except Exception:
            return Response(
                {"message": "Internal Server Error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        sentence_serialized = SentenceSerializer(instance=sentences, many=True)

        serialized = ProjectSerializer(instance=project)
        serialized.data["sentences"] = sentence_serialized.data
        return Response(data=serialized.data, status=status.HTTP_200_OK)

    @extend_schema(
        responses={200: ProjectSerializer(many=True)},
    )
    @action(
        detail=False,
        methods=["get"],
        url_path="read",
        permission_classes=[
            AllowAny,
        ],
    )
    def get_all_projects(self, request):
        queryset = Project.objects.filter(
            Q(created_by=request.user) | Q(annotated_by=request.user)
        )

        try:
            serialized = ProjectSerializer(instance=queryset, many=True)
        except Exception:
            return Response(
                {"detail": "Serializer Error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        return Response(data=serialized.data, status=status.HTTP_200_OK)

    @extend_schema(
        request=ProjectSerializer,
        responses={200: ProjectSerializer},
    )
    @action(detail=True, methods=["put"], url_path="update")
    def update_project(self, request):
        try:
            project_id = request.data["id"]
        except KeyError:
            return Response(
                data={"message": "Project id is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            project = Project.objects.get(id=project_id)
        except Language.DoesNotExist:
            return Response(
                data={"message": "Project does not exist"},
                status=status.HTTP_404_NOT_FOUND,
            )
        if project.created_by != request.user:
            return Response(
                {"error": "forbidden"},
                status=status.HTTP_403_FORBIDDEN,
            )
        serialized = ProjectSerializer(instance=project, data=request.data)
        if serialized.is_valid():
            serialized.save()
            return Response(data=serialized.data, status=status.HTTP_200_OK)
        return Response(data=serialized.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        request=DeleteSerializer,
        responses={204: DeleteSerializer},
    )
    @action(detail=False, methods=["delete"], url_path="delete")
    def delete_projects(self, request):
        if request.user.groups.filter(name="Manager").exists():
            pass
        else:
            return Response(
                {"error": "forbidden"},
                status=status.HTTP_403_FORBIDDEN,
            )
        serialized = DeleteSerializer(data=request.data)

        if serialized.is_valid():
            listings = Language.objects.filter(id__in=request.data["ids"])

            try:
                listings.delete()
            except Exception:
                return Response(
                    {"message": "Internal Server Error"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

            return Response(data=request.data, status=status.HTTP_204_NO_CONTENT)
        return Response(data=serialized.errors, status=status.HTTP_400_BAD_REQUEST)
