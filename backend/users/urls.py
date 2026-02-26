from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, PasswordResetRequestView, PasswordResetConfirmView

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password-reset'),
    path('reset-password/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
]