from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class Language(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    language_code = models.CharField(max_length=255)
    modified_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name}({self.language_code})"


class Project(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=511)
    article_name = models.CharField(max_length=255)
    language_id = models.ForeignKey(Language, on_delete=models.CASCADE)
    is_completed = models.BooleanField(default=False)
    created_by = models.ForeignKey(User, related_name="Owner", on_delete=models.CASCADE)
    annotated_by = models.ForeignKey(
        User, related_name="Annotator", on_delete=models.CASCADE
    )
    modified_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.language_id.name}_{self.name}"


class Sentence(models.Model):
    id = models.AutoField(primary_key=True)
    project_id = models.ForeignKey(Project, on_delete=models.CASCADE)
    original_sentence = models.TextField()
    annotated_sentence = models.TextField()
    modified_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.project_id.language_id.name}_{self.project_id.name}_{self.id}"
