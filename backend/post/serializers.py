from rest_framework import serializers
from .models import Post, Comment

class PostSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    profile_image = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = '__all__'

    def get_user_name(self, obj):
        return obj.user.user_name

    def get_profile_image(self, obj):
        return obj.user.profile_image.url if obj.user.profile_image else None
    
class CommentSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    profile_image = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = '__all__'

    def get_user_name(self, obj):
        return obj.user.user_name

    def get_profile_image(self, obj):
        return obj.user.profile_image.url if obj.user.profile_image else None