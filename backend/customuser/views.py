from django.contrib.auth.hashers import make_password
from django.contrib.sites.shortcuts import get_current_site
from django.core.mail import send_mail
from django.urls import reverse
from django.shortcuts import redirect
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.contrib.auth.tokens import default_token_generator
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.shortcuts import get_object_or_404
from backend.settings import EMAIL_HOST_USER, MEDIA_ROOT, BASE_DIR

from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
import os

from .serializers import UserSerializerWithToken, UserSerializer, ContactUsSerializer, UserFollowSerializer, UserFollowingListSerializer

from .models import CustomUser, EmailVerificationToken, ContactUs

# Create your views here.
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        serializer = UserSerializerWithToken(self.user).data

        for k, v in serializer.items():
            data[k] = v

        return data

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
    
@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def register_user(request):
    data = request.data

    try:
        if CustomUser.objects.filter(email=data['email']).exists():
            return Response({'message': 'User with this email already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        user_name = data['user_name']
        first_name_lower = data['first_name'].lower()
        first_name = first_name_lower.replace(' ', '').capitalize()

        last_name_lower = data['last_name'].lower()
        last_name = last_name_lower.replace(' ', '').capitalize()

        profile_image = request.FILES.get('profile_image')
        email = data['email'].lower()
        user = CustomUser.objects.create(
            user_name=user_name,
            first_name=first_name,
            last_name=last_name,
            email=email,
            password=make_password(data['password']),
            profile_image=profile_image,
        )

        send_verification_email(request, user)

        serializer = UserSerializerWithToken(user, many=False)
        return Response(serializer.data)

    except Exception as e:
        print(e)
        return Response({'message': 'An error occurred while processing your request'}, status=status.HTTP_400_BAD_REQUEST)


def send_verification_email(request, user):
    try:
        token = generate_verification_token(user)
        current_site = get_current_site(request)
        verify_url = reverse('verify_email', args=[token])
        verify_link = f"http://{current_site.domain}{verify_url}"
        template_name = os.path.join(BASE_DIR, 'customuser/templates/customuser/verification_email.html')
        email_context = {
            'user': user,
            'verify_link' : verify_link
                         }
        html_message = render_to_string(
            template_name=template_name,
            context=email_context
            )
        plain_message = strip_tags(html_message)  
        subject = 'Verify Your Email Address'
        
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=EMAIL_HOST_USER,
            recipient_list=[user.email],
            html_message=html_message
            )
    except Exception as e:
        print(e)
        return Response({'massage': 'An error occurred while sending verification email'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def generate_verification_token(user):
    token = default_token_generator.make_token(user)
    EmailVerificationToken.objects.create(user=user, token=token)
    return token

@api_view(['GET'])
def verify_email(request, token):
    try:
        if not EmailVerificationToken.objects.filter(token=token).exists():
            return redirect('/login')
        
        email_verification_token = EmailVerificationToken.objects.get(token=token)
        user = email_verification_token.user
        user.is_verified = True
        user.save()
        email_verification_token.delete()
        return redirect('/login')
    except EmailVerificationToken.DoesNotExist:
        return redirect('/verify-expired')
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_details(request,pk):
    user = CustomUser.objects.get(id=pk)
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_user(request, pk):

    data = request.data
    user = CustomUser.objects.get(id=pk)

    user.email = data['email']
    user.first_name = data['first_name']
    user.last_name = data['last_name']

    profile_image = request.FILES.get('profile_image')
    if profile_image:
        user.profile_image = profile_image

    password = data.get('password')
    if password:
        user.set_password(password)

    user.save()
    return Response({'massage': 'User updated successfully'})

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def edit_user(request, pk):
    user = CustomUser.objects.get(id=pk)
    data = request.data

    user.is_staff = data['is_staff']
    user.save()

    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def remove_admin(request, pk):
    user = CustomUser.objects.get(id=pk)
    data = request.data

    user.is_staff = data['is_staff']
    user.save()

    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_users(request):
    users = CustomUser.objects.all().order_by('email')

    page = request.query_params.get('page')
    paginator = Paginator(users, 10)

    try:
        users = paginator.page(page)
    except PageNotAnInteger:
        users = paginator.page(1)
    except EmptyPage:
        users = paginator.page(paginator.num_pages)

    if page == None:
        page = 1
    
    page = int(page)

    serializer = UserSerializer(users, many=True)
    return Response({'users': serializer.data, 'page': page, 'pages': paginator.num_pages})

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_user(request, pk):
    user = CustomUser.objects.get(id=pk)
    user.delete()
    return Response({'massage': 'User deleted successfully'})

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_all_images(request):
    try:
        users = CustomUser.objects.all()
        profile_images = [user.profile_image for user in users if user.profile_image]

        file_list = []
        for i in profile_images:
            file_list.append(i)
        filenames = [file.name for file in file_list]

        profiles = []
        for i in profile_images:
            filename = os.path.basename(i.name)
            profiles.append(filename)

        excluded_files =  ['profile.png']

        for root, dirs, files in os.walk(MEDIA_ROOT):
            for file in files:
                if file not in profiles and file not in excluded_files:
                    os.remove(os.path.join(root, file))
                        
        return Response({'message': 'All images deleted successfully'}, status=200)
    except:
        return Response({'message': 'An error occurred while deleting images'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
def create_contact_us(request):
    try:
        name = request.data.get('name')
        email = request.data.get('email')
        subject = request.data.get('subject')
        message = request.data.get('massage')
        contact = ContactUs.objects.create(
            name = name,
            email = email,
            subject = subject,
            message = message,
        )
        
        template_name = os.path.join(BASE_DIR, 'customuser/templates/customuser/contact_email.html')
        email_context = {
            'id': contact.id,
            'name': name,
            'email' : email,
            'subject' : subject,
            'message' : message
                         }
        
        html_message = render_to_string(
            template_name=template_name,
            context=email_context
            )
        plain_message = strip_tags(html_message)
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=EMAIL_HOST_USER,
            recipient_list=[email],
            html_message=html_message
            )
        return Response({'detail': 'Contact created successfully'})
    except:
        return Response({'detail': 'An error occurred while processing your request'}, status=status.HTTP_400_BAD_REQUEST)
    
    
@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_all_queries(request):
    
    queries = ContactUs.objects.all().order_by('id')

    page = request.query_params.get('page')
    paginator = Paginator(queries, 10)

    try:
        queries = paginator.page(page)
    except PageNotAnInteger:
        queries = paginator.page(1)
    except EmptyPage:
        queries = paginator.page(paginator.num_pages)

    if page == None:
        page = 1
    
    page = int(page)

    serializer = ContactUsSerializer(queries, many=True)
    return Response({'queries': serializer.data, 'page': page, 'pages': paginator.num_pages})

@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_query(request, pk):
    query = ContactUs.objects.get(id=pk)
    serializer = ContactUsSerializer(query, many=False)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def update_query(request, pk):
    query = ContactUs.objects.get(id=pk)
    query.is_resolved = True
    query.save()
    return Response({'message': 'Query updated successfully'})

@api_view(['GET'])
def get_user_details_unknown(request,pk):
    user = CustomUser.objects.get(id=pk)
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def follow_user(request, user_id):
    try:
        user_to_follow = get_object_or_404(CustomUser, id=user_id)
        if user_to_follow == request.user:
            return Response({"massage": "You cannot follow yourself."}, status=status.HTTP_400_BAD_REQUEST)
        
        if user_to_follow in request.user.following.all():
            request.user.following.remove(user_to_follow)
            user_to_follow.followers.remove(request.user)
            return Response({"massage": f"You are unfollowing {user_to_follow.user_name}."}, status=status.HTTP_200_OK)
        
        request.user.following.add(user_to_follow)
        user_to_follow.followers.add(request.user)
        return Response({"success": f"You are now following {user_to_follow.user_name}"}, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"Error: {e}")
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_follow(request, user_id):
    user = CustomUser.objects.get(id=user_id)
    serializer = UserFollowSerializer(user, many=False)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_following(request):
    user = request.user
    following = user.following.all()
    serializer = UserFollowingListSerializer(following, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def other_user_profile(request, user_id):
    user = CustomUser.objects.get(id=user_id)
    serializer = UserFollowingListSerializer(user, many=False)
    return Response(serializer.data)