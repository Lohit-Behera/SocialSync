from django.urls import path
from . import views

urlpatterns = [
    path('room/', views.chat_room, name='room'),
    path('user/list/', views.user_list_inbox, name='user_list_inbox'),
    path('initial/messages/<str:room_name>/', views.get_initial_messages, name='get_initial_messages'),
    path('all/messages/<str:room_name>/', views.get_all_messages, name='get_all_messages'),
]