from django.utils import timezone
from drf_spectacular.utils import extend_schema
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, status, permissions
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import (
    MessageSerializer,
    RegistrationSerializer,
    ProfileSerializer,
    CustomTokenObtainPairSerializer,
)


class HelloView(APIView):
    """
    A simple API endpoint that returns a greeting message.
    """

    @extend_schema(
        responses={200: MessageSerializer}, description="Get a hello world message"
    )
    def get(self, request):
        data = {"message": "Hello!", "timestamp": timezone.now()}
        serializer = MessageSerializer(data)
        return Response(serializer.data)


class RegisterView(generics.CreateAPIView):
    serializer_class = RegistrationSerializer
    permission_classes = [AllowAny]

    @extend_schema(
        request=RegistrationSerializer,
        responses={201: RegistrationSerializer},
        description="Register a new user with email and password",
    )
    def create(self, request, *args, **kwargs):  # POST
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            {"message": "Пользователь успешно зарегистрирован", "user": serializer.data},
            status=status.HTTP_201_CREATED,
            headers=headers,
        )


class CustomTokenObtainPairView(TokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class = CustomTokenObtainPairSerializer


class ProfileMeView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_object(self):
        return self.request.user

    @extend_schema(responses={200: ProfileSerializer})
    def get(self, request, *args, **kwargs):  # GET /me
        return super().retrieve(request, *args, **kwargs)

    @extend_schema(request=ProfileSerializer, responses={200: ProfileSerializer})
    def patch(self, request, *args, **kwargs):  # PATCH /me
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({"message": "Профиль успешно обновлён", "profile": serializer.data}, status=status.HTTP_200_OK)
