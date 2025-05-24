from django.db.models import Q
from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from .serializers import UserSerializer, UserCreateSerializer
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.password_validation import validate_password
from rest_framework.exceptions import ValidationError
from django.db import transaction
from datetime import datetime, timedelta

User = get_user_model()

class UserListAPIView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get_queryset(self):
        """
        Permite filtrar usuários por múltiplos campos
        """
        queryset = User.objects.all().order_by('-created_at')
        search = self.request.query_params.get('search', None)
        
        if search:
            # Cria um Q object para busca em múltiplos campos
            search_filter = Q()
            search_fields = [
                'email__icontains',
                'nome__icontains',
                'id__icontains',
            ]
            
            # Adiciona cada campo à busca (OR condition)
            for field in search_fields:
                search_filter |= Q(**{field: search})
            
            # Aplica o filtro
            queryset = queryset.filter(search_filter)
            
        return queryset

class UserMeAPIView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

class UserCreateAPIView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    serializer_class = UserCreateSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Retorna os dados do usuário criado
        response_serializer = UserSerializer(user)
        return Response(
            response_serializer.data, 
            status=status.HTTP_201_CREATED
        )

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == status.HTTP_200_OK:
            # Atualiza o status do usuário
            email = request.data.get('email')
            user = User.objects.filter(email=email).first()
            if user:
                # Verifica se já existe outro usuário logado com este e-mail
                # Se existir, não altera o is_online
                user.last_login = timezone.now()
                user.last_activity = timezone.now()
                user.is_online = True
                user.save(update_fields=['is_online', 'last_login', 'last_activity'])
        
        return response

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout(request):
    """
    Endpoint para logout do usuário
    """
    try:
        if request.user.is_authenticated:
            # Atualiza apenas o usuário atual usando select_for_update() para evitar race conditions
            with transaction.atomic():
                user = User.objects.select_for_update().get(id=request.user.id)
                user.is_online = False
                user.save(update_fields=['is_online'])
            return Response(status=status.HTTP_200_OK)
        return Response(
            {'detail': 'Usuário não autenticado'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    except User.DoesNotExist:
        return Response(
            {'detail': 'Usuário não encontrado'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'detail': f'Erro ao fazer logout: {str(e)}'},
            status=status.HTTP_400_BAD_REQUEST
        )

class UserUpdateAPIView(generics.UpdateAPIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    serializer_class = UserSerializer
    queryset = User.objects.all()
    
    def perform_update(self, serializer):
        # Atualiza last_activity
        serializer.save(updated_at=timezone.now())

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def change_password(request):
    """
    Permite que o usuário altere sua própria senha
    """
    user = request.user
    old_password = request.data.get('old_password')
    new_password = request.data.get('new_password')
    
    if not user.check_password(old_password):
        return Response(
            {"detail": "Senha atual incorreta"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        validate_password(new_password, user)
    except ValidationError as e:
        return Response(
            {"detail": str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user.set_password(new_password)
    user.save()
    return Response({"detail": "Senha alterada com sucesso"})

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_users_status(request):
    """
    Retorna o status de todos os usuários
    """
    try:
        users = User.objects.all()
        status_data = [
            {
                'user_id': user.id,
                'nome': user.nome,
                'email': user.email,
                'is_online': user.is_online,
                'last_activity': user.last_activity
            } for user in users
        ]
        return Response(status_data)
    except Exception as e:
        return Response(
            {'detail': f'Erro ao buscar status dos usuários: {str(e)}'},
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def update_status(request):
    """
    Atualiza o status do usuário
    """
    try:
        user = request.user
        if user.is_authenticated:
            user.is_online = True
            user.last_activity = timezone.now()
            user.save(update_fields=['is_online', 'last_activity'])
            
            return Response({
                'user_id': user.id,
                'nome': user.nome,
                'email': user.email,
                'is_online': user.is_online,
                'last_activity': user.last_activity
            })
    except Exception as e:
        return Response(
            {'detail': f'Erro ao atualizar status do usuário: {str(e)}'},
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_user_status(request):
    """
    Atualiza o status do usuário (online/offline)
    """
    try:
        with transaction.atomic():
            user = request.user
            status_type = request.data.get('status', 'online')
            
            user.is_online = status_type == 'online'
            user.last_activity = timezone.now()
            user.save(update_fields=['is_online', 'last_activity'])
            
            return Response({'status': 'success'})
    except Exception as e:
        return Response(
            {'detail': f'Erro ao atualizar status: {str(e)}'},
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['GET'])
def check_inactive_users():
    """
    Verifica e atualiza usuários inativos (executado periodicamente)
    """
    try:
        inactive_threshold = timezone.now() - timedelta(minutes=5)
        with transaction.atomic():
            # Atualiza usuários que não tiveram atividade nos últimos 5 minutos
            User.objects.filter(
                is_online=True,
                last_activity__lt=inactive_threshold
            ).update(
                is_online=False
            )
        return Response({'status': 'success'})
    except Exception as e:
        return Response(
            {'detail': f'Erro ao verificar usuários inativos: {str(e)}'},
            status=status.HTTP_400_BAD_REQUEST
        )