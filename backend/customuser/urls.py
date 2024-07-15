from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register/', views.register_user, name='register'),
    path('allusers/', views.get_users, name='get_users'),
    path('list/following/', views.list_following, name='list_following'),
    
    path('contactus/', views.create_contact_us, name='contact_us'),
    path('get/all/contactus/', views.get_all_queries, name='get_all_queries'),
    path('admin/delete/images/', views.delete_all_images, name='delete_images'),
    
    path('verify/<str:token>/', views.verify_email, name='verify_email'),
    path('details/<str:pk>/', views.get_user_details, name='get_user_details'),
    path('update/<str:pk>/', views.update_user, name='update_use'),
    path('useredit/<str:pk>/', views.edit_user, name='edit_user'),
    path('removeadmin/<str:pk>/', views.remove_admin, name='remove_admin'),
    path('userdelete/<str:pk>/', views.delete_user, name='delete_user'),
    path('contactus/<str:pk>/', views.get_query, name='get_query'),
    path('contactus/update/<str:pk>/', views.update_query, name='update_query'),
    path('details/unknown/<str:pk>/', views.get_user_details_unknown, name='get_user_details_unknown'),
    
    path('follow/<uuid:user_id>/', views.follow_user, name='follow_user'),
    path('list/follow/<uuid:user_id>/', views.list_follow, name='list_follow'),
    path('others/profile/<uuid:user_id>/', views.other_user_profile, name='other_user_profile'),
]