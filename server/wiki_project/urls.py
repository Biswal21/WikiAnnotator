from rest_framework import routers
from .views import ProjectViewSet, LanguageViewSet, SentenceViewSet
from .user_views import UserViewSet

router = routers.DefaultRouter()
router.register(r"project", ProjectViewSet, basename="project")
router.register(r"language", LanguageViewSet, basename="language")
router.register(r"sentence", SentenceViewSet, basename="sentence")
router.register(r"user", UserViewSet, basename="user")

urlpatterns = router.urls
