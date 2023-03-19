from rest_framework import serializers
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "password"]
        extra_kwargs = {"password": {"write_only": True}, "email": {"required": True}}

    def validate(self, data):
        username = data.pop("username", None)
        email = data.pop("email", None)
        password = data.pop("password", None)
        if not username or not email or not password:
            raise serializers.ValidationError(
                "Must include `username`, `email`, and `password`."
            )
        return super().validate(data)

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        user = super(UserSerializer, self).create(validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        user = super(UserSerializer, self).update(instance, validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()


# class RefreshTokenSerializer(serializers.Serializer):
#     refresh_token = serializers.CharField()


# class AccessTokenSerializer(serializers.Serializer):
#     access_token = serializers.CharField()


class AuthenticationSuccessSerializer(serializers.Serializer):
    refresh_token = serializers.CharField()
    access_token = serializers.CharField()
    groups = serializers.ListField(child=serializers.CharField())
