# backend/watertrack/urls.py

from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from rest_framework.routers import DefaultRouter
from watertrack_app.views import *
from django.conf import settings
from django.conf.urls.static import static


def health_check(request):
    return JsonResponse({"status": "ok"})


router = DefaultRouter()
router.register(r'villages', VillageViewSet)
router.register(r'water-sources', WaterSourceViewSet)
router.register(r'damage-reports', DamageReportViewSet)
router.register(r'quality-reports', QualityReportViewSet)
router.register(r'alerts', AlertViewSet)
router.register(r'users', UserViewSet)
router.register(r'messages', MessageViewSet)

urlpatterns = [
    path('', health_check, name='health-check'),
    path('health/', health_check, name='health'),
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/predict-demand/', predict_water_demand, name='predict-demand'),
    path('api/auth/login/', custom_login, name='custom-login'),
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)