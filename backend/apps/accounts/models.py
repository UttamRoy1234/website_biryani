import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import gettext_lazy as _

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError(_('The Email must be set'))
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', User.Role.ADMIN)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))

        return self.create_user(email, password, **extra_fields)

class User(AbstractUser):
    class Role(models.TextChoices):
        CUSTOMER = 'CUSTOMER', _('Customer')
        STAFF = 'STAFF', _('Kitchen / Restaurant Staff')
        ADMIN = 'ADMIN', _('Administrator')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = None  # Use email as unique identifier
    email = models.EmailField(_('email address'), unique=True, db_index=True)
    phone = models.CharField(max_length=20, blank=True, null=True, db_index=True)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.CUSTOMER)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    objects = CustomUserManager()

    class Meta:
        verbose_name = _('User')
        verbose_name_plural = _('Users')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.email} ({self.get_role_display()})"

class Address(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='addresses')
    full_name = models.CharField(max_length=150)
    phone = models.CharField(max_length=20)
    address_line = models.CharField(max_length=255)
    locality = models.CharField(max_length=150)
    city = models.CharField(max_length=100, default='Bengaluru')
    postal_code = models.CharField(max_length=10, db_index=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    delivery_instructions = models.TextField(blank=True, null=True)
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = _('Addresses')
        ordering = ['-is_default', '-created_at']

    def __str__(self):
        return f"{self.full_name} - {self.address_line}, {self.locality} ({self.postal_code})"
