
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("profile", views.index, name="index"),
    path("following", views.index, name="index"),
    path("users/<str:username>", views.index, name="index"),
    path("api/v1/profile", views.profile, name="profile"),
    path("api/v1/users/<str:username>", views.user, name="user"),
    path("api/v1/users/<str:username>/follow", views.follow, name="follow"),
    path("api/v1/posts", views.posts, name="posts"),
    path("api/v1/posts/following", views.following, name="following"),
    path("api/v1/posts/<int:id>", views.post, name="post"),
    path("api/v1/posts/<int:id>/like", views.like, name="like"),
    path("api/v1/posts/<int:id>/comments", views.comments, name="comments"),
    path("api/v1/posts/<int:id>/comments/<int:comment_id>", views.comment, name="comment"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register")
]
