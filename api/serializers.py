from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.utils.text import slugify
from rest_framework import serializers
from rest_framework.exceptions import ValidationError, AuthenticationFailed
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class MessageSerializer(serializers.Serializer):
    message = serializers.CharField(max_length=200)
    timestamp = serializers.DateTimeField(read_only=True)


def _normalize_email(email: str) -> str:
    return (email or "").strip().lower()


def _generate_unique_username(base_value: str) -> str:
    """Generate a unique username based on provided base value."""
    User = get_user_model()
    base = _normalize_email(base_value)
    # Use email as username; if taken, append -1, -2, ...
    if not User.objects.filter(username=base).exists():
        return base
    idx = 1
    while True:
        candidate = f"{base}-{idx}"
        if not User.objects.filter(username=candidate).exists():
            return candidate
        idx += 1


class RegistrationSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    first_name = serializers.CharField(required=True, allow_blank=False, max_length=150)
    last_name = serializers.CharField(required=True, allow_blank=False, max_length=150)
    password = serializers.CharField(write_only=True, required=True, style={"input_type": "password"})

    class Meta:
        model = get_user_model()
        fields = ["id", "email", "first_name", "last_name", "password"]
        read_only_fields = ["id"]

    def validate_email(self, value: str) -> str:
        User = get_user_model()
        email = _normalize_email(value)
        if User.objects.filter(email__iexact=email).exists():
            raise ValidationError("Пользователь с такой почтой уже существует.")
        return email

    def validate_password(self, value: str) -> str:
        # Optionally use Django's validators for stronger passwords
        try:
            validate_password(value)
        except Exception as exc:  # noqa: BLE001
            raise ValidationError("Пароль не соответствует требованиям безопасности.") from exc
        return value

    def create(self, validated_data):
        User = get_user_model()
        email = _normalize_email(validated_data.get("email"))
        first_name = validated_data.get("first_name", "").strip()
        last_name = validated_data.get("last_name", "").strip()
        password = validated_data.get("password")

        username = _generate_unique_username(email)
        user = User(username=username, email=email, first_name=first_name, last_name=last_name)
        user.set_password(password)
        user.save()
        return user


class ProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)

    class Meta:
        model = get_user_model()
        fields = ["email", "first_name", "last_name"]

    def validate_email(self, value: str) -> str:
        User = get_user_model()
        email = _normalize_email(value)
        user = self.instance
        qs = User.objects.filter(email__iexact=email)
        if user is not None:
            qs = qs.exclude(pk=user.pk)
        if qs.exists():
            raise ValidationError("Эта почта уже используется другим пользователем.")
        return email


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    # Accept email instead of username
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields.pop(self.username_field, None)  # remove default username field if present
        self.fields["email"] = serializers.EmailField()

    def validate(self, attrs):
        User = get_user_model()
        email = _normalize_email(attrs.get("email"))
        password = attrs.get("password")

        if not email or not password:
            raise ValidationError("Необходимо указать почту и пароль.")

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist as exc:  # noqa: F841
            raise AuthenticationFailed("Неверная почта или пароль.")

        # Delegate to parent with username mapped
        data = super().validate({self.username_field: user.get_username(), "password": password})
        # data contains 'access' and 'refresh'
        return data
