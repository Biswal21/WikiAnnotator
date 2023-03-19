from .user_serializers import (
    # UserSerializer,
    AuthenticationSuccessSerializer,
    LoginSerializer,
)
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from drf_spectacular.utils import extend_schema
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer,
    TokenRefreshSerializer,
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

from rest_framework_simplejwt.tokens import RefreshToken

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
        if serializer.is_valid():
            user = serializer.validated_data["user"]
            token = TokenObtainPairView.as_view()(request=request)._data
            groups = user.groups.values_list("name", flat=True)
            response = AuthenticationSuccessSerializer(
                data={
                    "access_token": token["access"],
                    "refresh_token": token["refresh"],
                    "groups": list(groups),
                }
            )
            return Response(response, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        request=TokenRefreshSerializer, responses={200: AuthenticationSuccessSerializer}
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
        serialized_token = TokenRefreshSerializer(data=request.data)

        if serialized_token.is_valid():
            try:
                refresh = RefreshToken(serialized_token.validated_data["refresh"])
                groups = refresh.user.groups.values_list("name", flat=True)
                print(groups)
                token = TokenRefreshView.as_view()(request=request)._data
                response = AuthenticationSuccessSerializer(
                    data={
                        "access_token": token["access"],
                        "refresh_token": token["refresh"],
                        "groups": list(groups),
                    }
                )
                return Response(response, status=status.HTTP_200_OK)
            except Exception:
                return Response(
                    {"error": "Invalid token"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        return Response(serialized_token.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(request=TokenObtainPairSerializer, responses={200})
    @action(
        detail=False,
        methods=["post"],
        url_path="logout",
        permission_classes=[
            AllowAny,
        ],
    )
    def logout(self, request):
        access_token = request.data.get("access_token")
        refresh_token = request.data.get("refresh_token")

        if not access_token and not refresh_token:
            return Response(
                {"error": "Please provide an access token or a refresh token."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        verify_view = TokenVerifyView.as_view()
        verify_response = verify_view(request=request)

        if verify_response.status_code == status.HTTP_200_OK:
            if refresh_token:
                blacklist_token = {"refresh": refresh_token}
                blacklist_view = TokenRefreshView.as_view()
            else:
                blacklist_token = {"access": access_token}
                blacklist_view = TokenObtainPairView.as_view()

            blacklist_response = blacklist_view(request=request, data=blacklist_token)

            if blacklist_response.status_code == 204:
                return Response(
                    {"success": "User logged out successfully."},
                    status=status.HTTP_200_OK,
                )

        return Response(
            {"error": "Unable to log out user."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
