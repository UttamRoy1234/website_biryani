from rest_framework import permissions
from .models import User

class IsOwnerOrStaff(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object or restaurant staff to view or edit it.
    """
    def has_object_permission(self, request, view, obj):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.user.role in [User.Role.STAFF, User.Role.ADMIN] or request.user.is_staff:
            return True
        # For objects with 'user' attribute
        if hasattr(obj, 'user'):
            return obj.user == request.user
        # For User model itself
        return obj == request.user

class IsStaffUser(permissions.BasePermission):
    """
    Allows access only to restaurant kitchen staff or administrators.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            (request.user.role in [User.Role.STAFF, User.Role.ADMIN] or request.user.is_staff)
        )
