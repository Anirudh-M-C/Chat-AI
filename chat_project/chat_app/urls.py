from django.urls import path
from .views import MessageAPIView

urlpatterns = [
    path('api/messages', MessageAPIView.as_view()),
]
