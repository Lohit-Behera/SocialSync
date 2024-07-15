from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import ChatRoom, Message
from customuser.models import CustomUser as User
import json

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'
        self.room, created = await self.get_or_create_room(self.room_name)

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        sender_id = text_data_json['sender_id']
        receiver_id = text_data_json['receiver_id']
        
        sender = await self.get_user(sender_id)
        receiver = await self.get_user(receiver_id)
        
        is_participant = await self.is_participant(sender, receiver)
        
        if not is_participant:
            return
        
        new_message = await self.save_message(sender, receiver, message)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'sender': str(sender.id),
                'receiver': str(receiver.id),
                'timestamp': new_message.timestamp.isoformat(),
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'sender': event['sender'],
            'receiver': event['receiver'],
            'timestamp': event['timestamp'],
        }))

    @database_sync_to_async
    def get_user(self, user_id):
        return User.objects.get(id=user_id)

    @database_sync_to_async
    def save_message(self, sender, receiver, message):
        return Message.objects.create(room=self.room, sender=sender, receiver=receiver, message=message)

    @database_sync_to_async
    def get_or_create_room(self, room_name):
        return ChatRoom.objects.get_or_create(name=room_name)
    
    @database_sync_to_async
    def is_participant(self, sender, receiver):
        return self.room.participants.filter(id=sender.id).exists() and self.room.participants.filter(id=receiver.id).exists()
