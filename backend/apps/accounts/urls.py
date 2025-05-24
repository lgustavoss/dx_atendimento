from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    CustomTokenObtainPairView,
    UserMeAPIView,
    UserCreateAPIView,
    UserListAPIView,
    UserUpdateAPIView,
    logout,
    change_password,
    update_status,
    get_users_status,
    update_user_status,
    check_inactive_users
)

app_name = 'accounts'

urlpatterns = [
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', UserMeAPIView.as_view(), name='me'),
    path('create/', UserCreateAPIView.as_view(), name='create'),
    path('', UserListAPIView.as_view(), name='list'),
    path('logout/', logout, name='logout'),
    path('change-password/', change_password, name='change-password'),
    path('me/status/', update_status, name='update_status'),
    path('status/', get_users_status, name='get_users_status'),
    path('status/', update_user_status, name='update_user_status'),
    path('check-inactive/', check_inactive_users, name='check_inactive_users'),
    path('<int:pk>/', UserUpdateAPIView.as_view(), name='update'),
]