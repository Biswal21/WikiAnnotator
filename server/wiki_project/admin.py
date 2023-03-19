from django.contrib import admin

# Register your models here.
from .models import Language, Project, Sentence

admin.site.register(Language)
admin.site.register(Project)
admin.site.register(Sentence)
