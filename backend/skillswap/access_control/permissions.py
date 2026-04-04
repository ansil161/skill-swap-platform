from rest_framework.permissions import BasePermission
from .constants import ROLE_ADMIN,ROLE_RECRUITER,ROLE_USER




class IsUser(BasePermission):
    def has_permission(self, request, view):
        print('hai iam ',request.user)
        return request.user.is_authenticated and request.user.role == ROLE_USER


class IsRecruiter(BasePermission):
    def has_permission(self, request, view):

        return request.user.is_authenticated and request.user.role == ROLE_RECRUITER


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == ROLE_ADMIN


class IsAdminOrRecruiter(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.role in [ROLE_ADMIN, ROLE_RECRUITER]
        )