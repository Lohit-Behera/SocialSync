from channels.db import database_sync_to_async
from asgiref.sync import sync_to_async
from channels.layers import get_channel_layer
from channels.generic.websocket import AsyncWebsocketConsumer
from django.utils import timezone
import json

from customuser.models import CustomUser
from .models import Message

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        if self.scope['user'].is_authenticated:
            await self.update_online_status(True)
            await self.channel_layer.group_add(
                f"user_{self.scope['user'].id}",
                self.channel_name
            )
            await self.accept()
            
            # Notify followers upon connection
            user_list = await self.get_followers()
            if user_list:
                await self.send_connection_notification(user_list)
        else:
            print('User is not authenticated')
            await self.close()
        
    async def disconnect(self, close_code):
        if self.scope['user'].is_authenticated:
            await self.update_online_status(False)
            await self.last_seen()
            user_list = await self.get_followers()
            if user_list:
                await self.send_disconnect_notification(user_list)

    @database_sync_to_async
    def update_online_status(self, is_online):
        self.scope['user'].is_online = is_online
        self.scope['user'].save()
        
    @database_sync_to_async
    def last_seen(self):
        self.scope['user'].last_seen = timezone.now()
        self.scope['user'].save()

    @database_sync_to_async
    def get_followers(self):
        user = CustomUser.objects.get(id=self.scope['user'].id)
        receiver_list = Message.objects.filter(receiver=user).values_list('sender', flat=True).distinct()
        following_list = user.following.all().values_list('id', flat=True)
        combined_ids = set(receiver_list).union(set(following_list))
        user_list = CustomUser.objects.filter(id__in=combined_ids).distinct()
        return list(user_list)
    
    async def send_connection_notification(self, user_list):
        channel_layer = get_channel_layer()
        for user in user_list:
            try:
                await channel_layer.group_send(
                    f"user_{user.id}",
                    {
                        "type": "user_connected",
                        "message": "fetch online users status"
                    }
                )
            except Exception as e:
                print(f"Error sending notification: {e}")

    async def send_disconnect_notification(self, user_list):
        channel_layer = get_channel_layer()
        for user in user_list:
            try:
                await channel_layer.group_send(
                    f"user_{user.id}",
                    {
                        "type": "user_disconnected",
                        "message": "fetch online users status"
                    }
                )
            except Exception as e:
                print(f"Error sending notification: {e}")

    async def user_connected(self, event):
        await self.send(text_data=json.dumps({
            "message": event["message"]
        }))

    async def user_disconnected(self, event):
        await self.send(text_data=json.dumps({
            "message": event["message"]
        }))
