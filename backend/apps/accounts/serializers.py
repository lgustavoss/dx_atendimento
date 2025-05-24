from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 
            'email', 
            'nome', 
            'is_online',
            'is_active', 
            'is_staff', 
            'is_superuser',
            'last_login',
            'created_at'
        ]
        read_only_fields = ['id', 'last_login', 'created_at']

class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    
    class Meta:
        model = User
        fields = [
            'email', 
            'nome', 
            'password', 
            'password_confirm',
            'is_active', 
            'is_staff', 
            'is_superuser'
        ]

    def validate(self, attrs):
        """
        Valida se as senhas são iguais
        """
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({
                "password": "As senhas não conferem"
            })
        return attrs

    def create(self, validated_data):
        """
        Cria um novo usuário após validação
        """
        # Remove o campo password_confirm antes de criar o usuário
        validated_data.pop('password_confirm', None)
        user = User.objects.create_user(**validated_data)
        return user

class UserSchema(serializers.ModelSerializer):
    is_online = serializers.BooleanField(read_only=True)
    last_activity = serializers.DateTimeField(read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'email', 'nome', 'is_active', 'is_staff', 
            'is_superuser', 'is_online', 'last_activity',
            'created_at', 'updated_at'
        ]