# backend/watertrack/urls.py

from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse, FileResponse
from rest_framework.routers import DefaultRouter
from watertrack_app.views import *
from django.conf import settings
from django.conf.urls.static import static
import os


def health_check(request):
    return JsonResponse({"status": "ok"})


def serve_frontend(request, path=""):
    frontend_path = os.path.join(settings.STATIC_ROOT, "frontend", "index.html")
    if os.path.exists(frontend_path):
        return FileResponse(open(frontend_path, "rb"))
    return JsonResponse({"error": "Frontend not built"}, status=404)


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
    path('api/health/', health_check, name='api-health'),
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/model-insights/', model_insights, name='model-insights'),
    path('api/predict-demand/', predict_water_demand, name='predict-demand'),
    path('api/auth/login/', custom_login, name='custom-login'),
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),
]

# Serve React frontend for all non-API routes
if os.path.exists(os.path.join(settings.STATIC_ROOT, "frontend", "index.html")):
    urlpatterns += [
        path("<path:path>", serve_frontend),
    ]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)