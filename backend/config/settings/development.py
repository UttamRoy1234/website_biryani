"""
Development settings for Dum & Co. Django backend.
"""
from .base import *

DEBUG = True

ALLOWED_HOSTS = ['*']

# Database: PostgreSQL if DATABASE_URL or defaults to sqlite3 for lightweight tests
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# In dev, allow Next.js frontends on standard ports
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
