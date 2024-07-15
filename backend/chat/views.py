from django.shortcuts import get_object_or_404
from django.db.models import Q
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework import status
from .models import ChatRoom, Message
from .serializers import ChatRoomSerializer, MessageSerializer
from customuser.models import CustomUser as User
from customuser.serializers import UserFollowingListSerializer

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 15
    page_size_query_param = 'page_size'
    max_page_size = 100
    
    def get_paginated_response(self, data):
        return Response({
            'total_pages': self.page.paginator.num_pages,
            'current_page': self.page.number,
            'results': data
        })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def chat_room(request):
    sender = request.user
    receiver_id = request.data.get('receiver_id')
    receiver = get_object_or_404(User, id=receiver_id)
    
    room_name = f"{min(sender.id, receiver.id)}_{max(sender.id, receiver.id)}"
    room, created = ChatRoom.objects.get_or_create(name=room_name)
    
    if created:
        room.participants.add(sender, receiver)
    
    serializer = ChatRoomSerializer(room)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_initial_messages(request, room_name):
    room = get_object_or_404(ChatRoom, name=room_name)
    messages = Message.objects.filter(room=room).order_by('-timestamp')[:15]
    serializer = MessageSerializer(messages, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def get_all_messages(request, room_name):
    try:
        room = get_object_or_404(ChatRoom, name=room_name)
        paginator = StandardResultsSetPagination()
        messages = Message.objects.filter(room=room).order_by('-timestamp')
        result_page = paginator.paginate_queryset(messages, request)
        serializer = MessageSerializer(result_page, many=True)
        
        response_data = {
                'total_pages': paginator.page.paginator.num_pages,
                'current_page': paginator.page.number,
                'massages': serializer.data
            }
        return Response(response_data, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response({"details": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])    
def user_list_inbox(request):
    user = request.user
    receiver_list = Message.objects.filter(receiver = user).values_list('sender', flat=True).distinct()
    following_list = user.following.all().values_list('id', flat=True)
    combined_ids = set(receiver_list).union(set(following_list))
    user_list = User.objects.filter(id__in=combined_ids).distinct()
    serializer = UserFollowingListSerializer(user_list, many=True)
    return Response(serializer.data)
    
    
     