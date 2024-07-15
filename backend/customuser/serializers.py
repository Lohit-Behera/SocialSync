from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from .models import CustomUser, ContactUs

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'first_name', 'last_name','user_name', 'profile_image','followers', 'following', 'join_date', 'is_staff', 'is_verified','followers', 'following','total_posts']

    def get__id(self, obj):
        return obj.id

class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'first_name', 'last_name', 'profile_image', 'is_staff', 'is_verified', 'join_date','token']

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)
        
class ContactUsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactUs
        fields = '__all__'
        
class PostUserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'first_name', 'last_name', 'user_name', 'profile_image',]
        
class UnknownUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'first_name', 'last_name', 'user_name', 'profile_image', 'followers', 'following',]
        
class UserFollowSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['followers', 'following']
        
class UserFollowingListSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'first_name', 'last_name', 'user_name', 'profile_image',]