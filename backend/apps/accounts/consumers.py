from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from django.utils import timezone
from channels_redis.core import RedisChannelLayer
import json
import asyncio

class UserStatusConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        print("WebSocket connect recebido!")
        print(f"Headers: {dict(self.scope['headers'])}")
        print(f"User: {self.scope['user']}")
        print(f"User is anonymous: {self.scope['user'].is_anonymous}")
        
        # Verifica autenticação
        if self.scope["user"].is_anonymous:
            print("Usuário anônimo - Conexão rejeitada")  # Debug
            await self.close()
            return

        print(f"Usuário autenticado: {self.scope['user'].email}")  # Debug
        
        await self.channel_layer.group_add(
            "user_status_updates",
            self.channel_name
        )
        await self.accept()
        
        user_id = self.scope["user"].id
        await self.add_connection(user_id)
        await self.update_user_status(True)
        await self.broadcast_status_update()

    async def disconnect(self, close_code):
        print(f"Desconectando... Código: {close_code}, channel_name={self.channel_name}")
        user_id = getattr(self.scope["user"], "id", None)
        print(f"user_id no disconnect: {user_id}")
        if user_id is None:
            print("user_id está None! Não será possível atualizar status.")
            return

        await self.remove_connection(user_id)
        await self.channel_layer.group_discard(f"user_{user_id}", self.channel_name)

        await asyncio.sleep(3)  # Aguarda conexões restantes

        redis = self.channel_layer.connection(self.channel_layer.consistent_hash(self.channel_name))
        connections = await redis.smembers(f"user_ws_{user_id}")
        print(f"Conexões restantes para user {user_id}: {connections}")  # <-- ADICIONE ISSO
        if not connections:
            print(f"Usuário {user_id} ficará offline!")  # <-- ADICIONE ISSO
            await self.set_user_offline(user_id)
            await self.broadcast_status_update(user_id)

    @database_sync_to_async
    def update_user_status(self, is_online):
        user = self.scope["user"]
        user.is_online = is_online
        user.last_activity = timezone.now()
        user.save(update_fields=['is_online', 'last_activity'])

    @database_sync_to_async
    def set_user_offline(self, user_id):
        from django.contrib.auth import get_user_model
        User = get_user_model()
        try:
            user = User.objects.get(id=user_id)
            user.is_online = False
            user.last_activity = timezone.now()
            user.save(update_fields=['is_online', 'last_activity'])
        except User.DoesNotExist:
            pass

    async def broadcast_status_update(self, user_id=None):
        from django.contrib.auth import get_user_model
        User = get_user_model()
        if user_id is None:
            user_id = self.scope["user"].id
        try:
            user = await database_sync_to_async(User.objects.get)(id=user_id)
            await self.channel_layer.group_send(
                "user_status_updates",
                {
                    "type": "status.update",
                    "user_id": user.id,
                    "is_online": user.is_online,
                    "last_activity": user.last_activity.isoformat()
                }
            )
        except User.DoesNotExist:
            pass

    async def status_update(self, event):
        """
        Handler para mensagens de atualização de status.
        Envia a atualização para o cliente WebSocket.
        """
        print(f"Enviando atualização de status: {event}")  # Debug
        await self.send_json({
            'type': 'status.update',
            'user_id': event['user_id'],
            'is_online': event['is_online'],
            'last_activity': event['last_activity']
        })

    async def receive_json(self, content):
        """
        Handler para mensagens recebidas do cliente WebSocket
        """
        try:
            print(f"Mensagem recebida: {content}")
            message_type = content.get('type', '')
            
            if message_type == 'heartbeat':
                await self.update_user_status(True)
                await self.broadcast_status_update()
            else:
                print(f"Tipo de mensagem desconhecido: {message_type}")
        except Exception as e:
            print(f"Erro ao processar mensagem: {e}")

    async def add_connection(self, user_id):
        print(f"add_connection: user_id={user_id}, channel_name={self.channel_name}")
        redis = self.channel_layer.connection(self.channel_layer.consistent_hash(self.channel_name))
        await redis.sadd(f"user_ws_{user_id}", self.channel_name)

    async def remove_connection(self, user_id):
        print(f"remove_connection: user_id={user_id}, channel_name={self.channel_name}")
        redis = self.channel_layer.connection(self.channel_layer.consistent_hash(self.channel_name))
        await redis.srem(f"user_ws_{user_id}", self.channel_name)