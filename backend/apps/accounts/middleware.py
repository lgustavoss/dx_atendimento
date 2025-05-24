from django.utils import timezone
from datetime import timedelta
from django.conf import settings
from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth import get_user_model
from urllib.parse import parse_qs

User = get_user_model()

class TokenAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        # Extrai o token da query string
        query_string = scope.get('query_string', b'').decode()
        query_params = parse_qs(query_string)
        token_list = query_params.get('token')
        user = AnonymousUser()

        if token_list:
            token = token_list[0]
            try:
                access_token = AccessToken(token)
                user_id = access_token['user_id']
                user = await self.get_user(user_id)
            except Exception:
                user = AnonymousUser()

        scope['user'] = user
        return await super().__call__(scope, receive, send)

    @staticmethod
    async def get_user(user_id):
        try:
            return await User.objects.aget(id=user_id)
        except User.DoesNotExist:
            return AnonymousUser()

class UserActivityMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        
        if request.user.is_authenticated:
            # Atualiza last_activity apenas se já passou mais de 5 minutos
            update_threshold = timezone.now() - timezone.timedelta(minutes=5)
            if not request.user.last_activity or request.user.last_activity < update_threshold:
                request.user.last_activity = timezone.now()
                request.user.save(update_fields=['last_activity'])
        
        return response