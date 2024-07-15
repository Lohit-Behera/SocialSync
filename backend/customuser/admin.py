from django.contrib import admin

# Register your models here.
from .models import CustomUser, ContactUs

admin.site.register(CustomUser)
admin.site.register(ContactUs)