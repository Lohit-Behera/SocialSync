from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination

from django.shortcuts import get_object_or_404
from django.utils import timezone

from io import BytesIO
from django.core.files.uploadedfile import InMemoryUploadedFile

from .models import Post, Like, Comment
from .serializers import PostSerializer, CommentSerializer

from PIL import Image

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 12
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
def create_post(request):
    try:
        data = request.data
        user = request.user
        if data['type'] == 'text':
            post = Post.objects.create(
                user=user,
                content=data['content'],
                type=data['type']
            )
            
        if data['type'] == 'image':
            image = request.FILES.get('image')
            pil_image = Image.open(image)
            
            original_width, original_height = pil_image.size
            aspect_ratio = original_width / original_height
            new_width = min(1440, original_width)
            new_height = int(new_width / aspect_ratio)
            
            if new_height > 1080:
                new_height = 1080
                new_width = int(new_height * aspect_ratio)
            
            resized_image = pil_image.resize((new_width, new_height), Image.LANCZOS)
            
            image_io = BytesIO()
            resized_image.save(image_io, format='JPEG', quality=70)
            image_file = InMemoryUploadedFile(
                image_io, None, 'resized_image.jpg', 'image/jpeg', image_io.tell(), None
            )
            
            post = Post.objects.create(
                user=user,
                image=image_file,
                content=data['content'],
                type=data['type']
            )
            
        if data['type'] == 'video':
            post = Post.objects.create(
                user=user,
                video=data['video'],
                content=data['content'],
                type=data['type']
            )

        serializer = PostSerializer(post, many=False)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        print(e)
        return Response({'message': 'An error occurred while processing your request'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_post(request,pk):
    try:
        post = Post.objects.get(id=pk)
        likes_count = Like.objects.filter(post=post.id).count()
        comment_count = Comment.objects.filter(post=post.id).count()
        post.total_likes = likes_count
        post.total_comments = comment_count
        post.save()
        serializer = PostSerializer(post, many=False)
        return Response(serializer.data)
    except Exception as e:
        print(e)
        return Response({'message': 'An error occurred while processing your request'}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def like_unlike_post(request, pk):
    try:
        user = request.user
        post = get_object_or_404(Post, id=pk)

        like_obj, created = Like.objects.get_or_create(user=user, post=post)

        if not created:
            like_obj.delete()
            return Response({'message': 'Post unliked'}, status=status.HTTP_200_OK)
        else:
            like_obj.like = True
            like_obj.save()
            return Response({'message': 'Post liked'}, status=status.HTTP_200_OK)
    
    except Exception as e:
        print(e)
        return Response({'message': 'An error occurred while processing your request'}, status=status.HTTP_400_BAD_REQUEST)
    
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_posts(request, pk):
    try:
        post = Post.objects.filter(user=pk)
        serializer = PostSerializer(post, many=True)
        return Response(serializer.data)
    except Exception as e:
        print(e)
        return Response({'message': 'An error occurred while processing your request'}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_text_post(request, pk):
    try:
        post = Post.objects.get(id=pk)
        data = request.data
        post.content = data['content']
        post.updated_at = timezone.now()
        post.edited = True
        post.save()
        return Response({'message': 'Post updated successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response({'message': 'An error occurred while processing your request'}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_post(request, pk):
    try:
        post = Post.objects.get(id=pk)
        
        if post.type == 'image':
            post.image.delete(save=False)
        elif post.type == 'video':
            post.video.delete(save=False)
        
        post.delete()
        return Response({'message': 'Post deleted successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response({'message': 'An error occurred while processing your request'}, status=status.HTTP_400_BAD_REQUEST)

    
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def create_comment(request, pk):
    try:
        user = request.user
        post = Post.objects.get(id=pk)
        data = request.data
        
        comment = Comment.objects.create(
            user=user,
            post=post,
            content=data['content']
        )
        return Response({'message': 'Comment created successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response({'message': 'An error occurred while processing your request'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_comments(request, pk):
    try:
        comments = Comment.objects.filter(post=pk).order_by('-created_at')
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)
    except Exception as e:
        print(e)
        return Response({'message': 'An error occurred while processing your request'}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_comment(request, pk):
    try:
        comment = Comment.objects.get(id=pk)
        comment.delete()
        return Response({'message': 'Comment deleted successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response({'message': 'An error occurred while processing your request'}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_comment(request, pk):
    try:
        comment = Comment.objects.get(id=pk)
        data = request.data
        comment.content = data['content']
        comment.save()
        return Response({'message': 'Comment updated successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response({'message': 'An error occurred while processing your request'}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_text_posts(request):
    try:
        text_posts = Post.objects.filter(type='text').order_by('-created_at')
        paginator = StandardResultsSetPagination()
        result_page = paginator.paginate_queryset(text_posts, request)
        serializer = PostSerializer(result_page, many=True)
        response_data = {
                    'total_pages': paginator.page.paginator.num_pages,
                    'current_page': paginator.page.number,
                    'text_posts': serializer.data
                }
        return Response(response_data)
    except Exception as e:
        print(e)
        return Response({'message': 'An error occurred while processing your request'}, status=status.HTTP_400_BAD_REQUEST)    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_video_posts(request):
    video_posts = Post.objects.filter(type='video').order_by('-created_at')
    paginator = StandardResultsSetPagination()
    result_page = paginator.paginate_queryset(video_posts, request)
    serializer = PostSerializer(result_page, many=True)
    response_data = {
                'total_pages': paginator.page.paginator.num_pages,
                'current_page': paginator.page.number,
                'video_posts': serializer.data
            }
    return Response(response_data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_image_posts(request):
    image_posts = Post.objects.filter(type='image').order_by('-created_at')
    paginator = StandardResultsSetPagination()
    result_page = paginator.paginate_queryset(image_posts, request)
    serializer = PostSerializer(result_page, many=True)
    response_data = {
                'total_pages': paginator.page.paginator.num_pages,
                'current_page': paginator.page.number,
                'image_posts': serializer.data
            }
    return Response(response_data)