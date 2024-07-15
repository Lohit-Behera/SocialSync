from django.db import models
import uuid
# Create your models here.

class Post(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    image = models.ImageField(upload_to='images/', null=True, blank=True)
    video = models.FileField(upload_to='videos/', null=True, blank=True)
    content = models.TextField(null=False, blank=False)
    type = models.CharField(max_length=100,default="text", null=False, blank=False)
    total_likes = models.IntegerField(default=0)
    total_comments = models.IntegerField(default=0)
    total_shares = models.IntegerField(default=0)
    edited = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey('customuser.CustomUser', on_delete=models.CASCADE, related_name='text_posts')
    

    def __str__(self):
        return self.content[:20]
    
    @property
    def user_name(self):
        return self.user.user_name
    
    @property
    def profile_image(self):
        return self.user.profile_image
    
class Like(models.Model):
    user = models.ForeignKey('customuser.CustomUser', on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='likes')
    like = models.BooleanField(default=False)

    class Meta:
        unique_together = ('user', 'post')

class Share(models.Model):
    user = models.ForeignKey('customuser.CustomUser', on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='shares')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'post')
    
class Comment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    content = models.TextField(null=False, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey('customuser.CustomUser', on_delete=models.CASCADE, related_name='user_comments')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='post_comments')

    def __str__(self):
        return self.content[:20]
    
    @property
    def user_name(self):
        return self.user.user_name
    
    @property
    def profile_image(self):
        return self.user.profile_image
    
class CommentLike(models.Model):
    user = models.ForeignKey('customuser.CustomUser', on_delete=models.CASCADE)
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name='likes')
    comment_like = models.BooleanField(default=False)


    class Meta:
        unique_together = ('user', 'comment')
