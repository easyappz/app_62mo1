from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    HelloView,
    RegisterView,
    CustomTokenObtainPairView,
    ProfileMeView,
)

urlpatterns = [
    path("hello/", HelloView.as_view(), name="hello"),
    # Auth
    path("auth/register", RegisterView.as_view(), name="auth-register"),
    path("auth/login", CustomTokenObtainPairView.as_view(), name="auth-login"),
    path("auth/refresh", TokenRefreshView.as_view(), name="auth-refresh"),
    # Profile
    path("profile/me", ProfileMeView.as_view(), name="profile-me"),
]
