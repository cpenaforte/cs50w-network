from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    username = models.CharField(max_length=16, unique=True)
    followers = models.ManyToManyField("self", blank=True, symmetrical=False, related_name="following")

    def serialize(self, request, base_posts = None):
        posts = base_posts if base_posts else self.posts.order_by("-timestamp").all()

        return {
            "id": self.id,
            "username": self.username,
            "email": self.email if self.email else "",
            "is_owner": self.id == request.user.id,
            "followers": [follower.username for follower in self.followers.all()],
            "following": [following.username for following in self.following.all()],
            "posts":  [post.serialize(request) for post in posts]
        }

class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(User, related_name="liked_posts")

    def serialize(self, request):
        return {
            "id": self.id,
            "user": self.user.username,
            "content": self.content,
            "timestamp": self.timestamp.strftime("%b %-d %Y, %-I:%M %p"),
            "comments": [comment.serialize() for comment in self.comments.order_by("-timestamp").all()],
            "likes": self.likes.count(),
            "is_owner": self.user.id == request.user.id,
            "liked": self.likes.filter(id=request.user.id).exists()
        }

class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments")
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def serialize(self):
        return {
            "id": self.id,
            "user": self.user.username,
            "content": self.content,
            "timestamp": self.timestamp.strftime("%b %-d %Y, %-I:%M %p")
        }
