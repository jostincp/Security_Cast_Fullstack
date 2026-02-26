from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from .serializers import UserSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.mail import send_mail
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi 

from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    """
    CRUD viewset for User model.
    Requires authentication.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
class PasswordResetRequestView(APIView):
    permission_classes = [] 

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'email': openapi.Schema(type=openapi.TYPE_STRING, description='Correo electrónico del usuario')
            },
            required=['email']
        ),
        responses={200: 'Si el correo existe, se ha enviado un enlace de recuperación.'}
    )
    def post(self, request):
        email = request.data.get('email')
        try:
            user = User.objects.get(email=email)
            
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            
            link = f"http://127.0.0.1:8000/api/reset-password/?uid={uid}&token={token}"
            
            send_mail(
                'Recuperación de contraseña - Security Cast',
                f'Hola {user.full_name},\n\nUsa este enlace para recuperar tu contraseña: {link}\n\nSi no solicitaste este cambio, ignora este correo.',
                'jostinvcp@gmail.com',
                [email],
                fail_silently=False,
            )
            return Response({"msg": "Si el correo existe, se ha enviado un enlace de recuperación."})
            
        except User.DoesNotExist:
            return Response({"msg": "Si el correo existe, se ha enviado un enlace de recuperación."})

class PasswordResetConfirmView(APIView):
    permission_classes = [] 

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'password': openapi.Schema(type=openapi.TYPE_STRING, description='Nueva contraseña')
            },
            required=['password']
        ),
        responses={200: 'Contraseña actualizada exitosamente', 400: 'Token o enlace inválido'}
    )
    def post(self, request):
        uid = request.query_params.get('uid')
        token = request.query_params.get('token')
        new_password = request.data.get('password')
        
        if uid and token and new_password:
            try:
                user_id = force_str(urlsafe_base64_decode(uid))
                user = User.objects.get(pk=user_id)
            except (TypeError, ValueError, OverflowError, User.DoesNotExist):
                user = None

            if user is not None and default_token_generator.check_token(user, token):
                user.set_password(new_password)
                user.save()
                return Response({"msg": "Contraseña actualizada exitosamente."})
        
        return Response({"msg": "Token o enlace inválido."}, status=400)