from rest_framework import views, permissions, status
from rest_framework.response import Response
from apps.accounts.permissions import IsStaffUser
from .models import RestaurantSettings
from .serializers import RestaurantSettingsSerializer

class RestaurantSettingsView(views.APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [IsStaffUser()]

    def get(self, request):
        settings, _ = RestaurantSettings.objects.get_or_create(id__isnull=False)
        return Response(RestaurantSettingsSerializer(settings).data)

    def patch(self, request):
        settings, _ = RestaurantSettings.objects.get_or_create(id__isnull=False)
        serializer = RestaurantSettingsSerializer(settings, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
