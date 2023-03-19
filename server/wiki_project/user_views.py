from django.contrib.auth.models import User
from .user_serializers import (
    # UserSerializer,
    AuthenticationSuccessSerializer,
    LoginSerializer,
    RefreshTokenSerializer,
    TokenSerializer,
)
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from drf_spectacular.utils import extend_schema
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer,
)

from rest_framework_simplejwt.tokens import RefreshToken, AccessToken

# from drf_spectacular.types import OpenApiTypes


class UserViewSet(viewsets.ViewSet):
    # @extend_schema(
    #     request=UserSerializer,
    #     responses={201: TokenObtainPairSerializer},
    # )
    # @action(
    #     detail=False,
    #     methods=["post"],
    #     url_path="signup",
    #     permission_classes=[
    #         AllowAny,
    #     ],
    # )
    # def signup_verification(self, request):
    #     if request.user.is_authenticated:
    #         return Response(
    #             {"error": "You are already logged in"},
    #             status=status.HTTP_405_METHOD_NOT_ALLOWED,
    #         )
    #     serialized = UserSerializer(data=request.data)
    #     if serialized.is_valid():
    #         serialized.save()
    #         token_serializer = TokenObtainPairSerializer(
    #             data={
    #                 "username": request.data["username"],
    #                 "password": request.data["password"],
    #             }
    #         )
    #         if token_serializer.is_valid():
    #             token = TokenObtainPairView.as_view()(request=request)._data
    #             response = AuthenticationSuccessSerializer(
    #                 data={
    #                     "access_token": token["access"],
    #                     "refresh_token": token["refresh"],
    #                     "groups": [],
    #                 }
    #             )
    #             return Response(response, status=status.HTTP_201_CREATED)
    #         else:
    #             return Response(
    #                 token_serializer.errors, status=status.HTTP_400_BAD_REQUEST
    #             )
    #     else:
    #         return Response(serialized.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        request=LoginSerializer,
        responses={200: AuthenticationSuccessSerializer},
    )
    @action(
        detail=False,
        methods=["post"],
        url_path="login",
        permission_classes=[
            AllowAny,
        ],
        throttle_classes=[],
    )
    def login_verification(self, request):
        if request.user.is_authenticated:
            return Response(
                {"error": "You are already logged in"},
                status=status.HTTP_405_METHOD_NOT_ALLOWED,
            )
        serializer = TokenObtainPairSerializer(data=request.data)
        # print(serializer.user)
        if serializer.is_valid():
            user = serializer.user
            refresh = RefreshToken.for_user(user)
            groups = user.groups.values_list("name", flat=True)
            response = AuthenticationSuccessSerializer(
                data={
                    "access_token": str(serializer.validated_data["access"]),
                    "refresh_token": str(refresh),
                    "groups": list(groups),
                }
            )
            if response.is_valid():
                return Response(response.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        request=RefreshTokenSerializer, responses={200: AuthenticationSuccessSerializer}
    )
    @action(
        detail=False,
        methods=["post"],
        url_path="refresh",
        permission_classes=[
            AllowAny,
        ],
    )
    def refresh_token(self, request):
        serialized_refresh_token = RefreshTokenSerializer(data=request.data)

        if serialized_refresh_token.is_valid():
            try:
                refresh = RefreshToken(
                    serialized_refresh_token.validated_data["refresh_token"]
                )
                access = refresh.access_token
                # groups = refresh.user.groups.values_list("name", flat=True)
                try:
                    access_token_body = AccessToken(str(access))
                except Exception:
                    return Response(
                        {"error": "Internal server error"},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    )
                user_id = access_token_body["user_id"]
                user = User.objects.get(id=user_id)
                groups = user.groups.values_list("name", flat=True)

                print(groups)
                response = AuthenticationSuccessSerializer(
                    data={
                        "refresh_token": str(refresh),
                        "access_token": str(access),
                        "groups": list(groups),
                    }
                )
                if response.is_valid():
                    return Response(response.data, status=status.HTTP_200_OK)
                return Response(response.errors, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response(
                    {"error": str(e)},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        return Response(
            serialized_refresh_token.errors, status=status.HTTP_400_BAD_REQUEST
        )

    @extend_schema(request=TokenSerializer, responses={200})
    @action(
        detail=False,
        methods=["post"],
        url_path="logout",
        permission_classes=[
            AllowAny,
        ],
    )
    def logout(self, request):
        token = TokenSerializer(data=request.data)
        if token.is_valid():
            try:
                refresh = RefreshToken(token.validated_data["refresh_token"])
            except Exception:
                refresh = None
            try:
                access = RefreshToken(token.validated_data["access_token"])
            except Exception:
                access = None
            if refresh:
                refresh.blacklist()
            elif access:
                access.blacklist()
            else:
                return Response(
                    {"error": "Invalid token"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            return Response(
                {"success": "User logged out successfully."},
                status=status.HTTP_200_OK,
            )
        return Response(token.errors, status=status.HTTP_400_BAD_REQUEST)
