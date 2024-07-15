from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.create_post, name='create_post'),
    path('get/all/text/', views.get_all_text_posts, name='get_text_posts'),
    path('get/all/video/', views.get_all_video_posts, name='get_all_video_posts'),
    path('get/all/images/', views.get_all_image_posts, name='get_all_image_posts'),
    
    path('get/post/<str:pk>/', views.get_post, name='get_posts'),
    path('like/<str:pk>/', views.like_unlike_post, name='like_unlike_post'),
    path('get/user/<str:pk>/', views.get_user_posts, name='get_user_posts'),
    path('edit/text/<str:pk>/', views.edit_text_post, name='edit_text_post'),
    path('delete/<str:pk>/', views.delete_post, name='delete_post'),
    
    path('create/comment/<str:pk>/', views.create_comment, name='create_comment'),
    path('get/comments/<str:pk>/', views.get_comments, name='get_comment'),
    path('delete/comment/<str:pk>/', views.delete_comment, name='delete_comment'),
    path('edit/comment/<str:pk>/', views.edit_comment, name='edit_comment'),
]