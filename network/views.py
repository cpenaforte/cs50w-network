from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from django.views.decorators.csrf import csrf_exempt
import json

from .models import User, Post, Comment


def index(request, username = None):
    if request.path == "/profile":
        return render(request, "network/index.html", {
            "path": "/profile"
        })
    if request.path == "/following":
        return render(request, "network/index.html", {
            "path": "/following"
        })
    if request.path.startswith("/users/"):
        return render(request, "network/index.html", {
            "path": request.path
        })
    return render(request, "network/index.html", {
        "path": "/"
    })

@csrf_exempt
@login_required
def post(request, id):
    if request.method == "PUT":
        data = json.loads(request.body)

        post = None
        try:
            post = Post.objects.get(id=id)
        except Post.DoesNotExist:
            return JsonResponse({"error": "Post not found."}, status=404)
        
        if post.user.id != request.user.id:
            return JsonResponse({"error": "You can't edit other people's posts."}, status=403)

        post.content = data.get("content")
        post.save()
        return JsonResponse(post.serialize(request), safe=False, status=200)
    
    if request.method == "DELETE":
        try:
            post = Post.objects.get(id=id)
        except Post.DoesNotExist:
            return JsonResponse({"error": "Post not found."}, status=404)
        
        if post.user.id != request.user.id:
            print(post.user.id, request.user.id)
            return JsonResponse({"error": "You can't delete other people's posts."}, status=403)

        post.delete()
        return HttpResponse(status=204)

    post = Post.objects.get(id=id)
    return JsonResponse(post.serialize(request), safe=False, status=200)

@csrf_exempt
@login_required
def posts(request):
    if request.method == "POST":
        data = json.loads(request.body)
        content = data.get("content")

        post = Post(user=request.user, content=content)
        post.save()
        return JsonResponse(post.serialize(request), safe=False, status=201)
    
    

    posts = Post.objects.order_by("-timestamp").all()
    
    try:
        per_page = int(request.GET.get("per_page", 10))
        page_number = int(request.GET.get("page", 1))
        paginator = Paginator(posts, per_page)
        page = paginator.get_page(page_number)
        return JsonResponse({ 
            "posts": [post.serialize(request) for post in page.object_list],
            "has_next": page.has_next(),
            "has_previous": page.has_previous(),
            "page": page.number,
            "total_pages": paginator.num_pages,
            "total_posts": paginator.count,
        }, safe=False, status=200)
    except (ValueError, TypeError):
        return JsonResponse([post.serialize(request) for post in posts], safe=False, status=200)

@csrf_exempt
@login_required
def like(request, id):
    if request.method == "PUT":
        data = json.loads(request.body)

        post = None
        try:
            post = Post.objects.get(id=id)
        except Post.DoesNotExist:
            return JsonResponse({"error": "Post not found."}, status=404)

        if data.get("like"):
            post.likes.add(request.user)
        else:
            post.likes.remove(request.user)

        post.save()
        return JsonResponse(post.serialize(request), safe=False, status=200)

    return JsonResponse({"error": "PUT request required."}, status=400)

@csrf_exempt
@login_required
def comments(request, id):
    if request.method == "POST":
        data = json.loads(request.body)
        content = data.get("content")

        post = None
        try:
            post = Post.objects.get(id=id)
        except Post.DoesNotExist:
            return JsonResponse({"error": "Post not found."}, status=404)

        comment = Comment(user=request.user, post=post, content=content)
        comment.save()
        return JsonResponse(comment.serialize(), safe=False, status=201)
    
    return JsonResponse({"error": "POST request required."}, status=400)

@csrf_exempt
@login_required
def comment(request, id, comment_id):
    if request.method == "PUT":
        data = json.loads(request.body)

        comment = None
        try:
            comment = Comment.objects.get(id=comment_id)
        except Comment.DoesNotExist:
            return JsonResponse({"error": "Comment not found."}, status=404)
        
        if comment.user.id != request.user.id:
            return JsonResponse({"error": "You can't edit other people's comments."}, status=403)

        comment.content = data.get("content")
        comment.save()
        return JsonResponse(comment.serialize(), safe=False, status=200)
    
    if request.method == "DELETE":
        try:
            comment = Comment.objects.get(id=comment_id)
        except Comment.DoesNotExist:
            return JsonResponse({"error": "Comment not found."}, status=404)
        
        if comment.user.id != request.user.id:
            return JsonResponse({"error": "You can't delete other people's comments."}, status=403)

        comment.delete()
        return HttpResponse(status=204)

    comment = Comment.objects.get(id=comment_id)
    return JsonResponse(comment.serialize(), safe=False, status=200)

@login_required
def profile(request):
    try:
        per_page = int(request.GET.get("per_page", 10))
        page_number = int(request.GET.get("page", 1))
        paginator = Paginator(request.user.posts.order_by("-timestamp").all(), per_page)
        page = paginator.get_page(page_number)
        return JsonResponse({ 
            "user": request.user.serialize(request, page.object_list),
            "has_next": page.has_next(),
            "has_previous": page.has_previous(),
            "page": page.number,
            "total_pages": paginator.num_pages,
            "total_posts": paginator.count,
        }, safe=False, status=200)
    except (ValueError, TypeError):
        return JsonResponse(request.user.serialize(request), safe=False, status=200)

@login_required
def user(request, username):
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found."}, status=404)

    try:
        per_page = int(request.GET.get("per_page", 10))
        page_number = int(request.GET.get("page", 1))
        paginator = Paginator(user.posts.order_by("-timestamp").all(), per_page)
        page = paginator.get_page(page_number)
        return JsonResponse({ 
            "user": user.serialize(request, page.object_list),
            "has_next": page.has_next(),
            "has_previous": page.has_previous(),
            "page": page.number,
            "total_pages": paginator.num_pages,
            "total_posts": paginator.count,
        }, safe=False, status=200)
    except (ValueError, TypeError):
        return JsonResponse(user.serialize(request), safe=False, status=200)

@csrf_exempt
@login_required
def follow(request, username):
    if request.method == "PUT":
        data = json.loads(request.body)

        user = None
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return JsonResponse({"error": "User not found."}, status=404)

        if user.id == request.user.id:
            return JsonResponse({"error": "You can't follow yourself."}, status=403)
            
        if data.get("follow"):
            user.followers.add(request.user)
        else:
            user.followers.remove(request.user)

        user.save()
        return JsonResponse(user.serialize(request), safe=False, status=200)

    return JsonResponse({"error": "PUT request required."}, status=400)

@login_required
def following(request):
    # Get following users posts
    posts = []
    following_users = User.objects.get(id=request.user.id).following.all()

    for user in following_users:
        posts += user.posts.all()
    
    posts.sort(key=lambda post: post.timestamp, reverse=True)
    
    try:
        per_page = int(request.GET.get("per_page", 10))
        page_number = int(request.GET.get("page", 1))
        paginator = Paginator(posts, per_page)
        page = paginator.get_page(page_number)
        return JsonResponse({ 
            "posts": [post.serialize(request) for post in page.object_list],
            "has_next": page.has_next(),
            "has_previous": page.has_previous(),
            "page": page.number,
            "total_pages": paginator.num_pages,
            "total_posts": paginator.count,
        }, safe=False, status=200)
    except (ValueError, TypeError):
        return JsonResponse([post.serialize(request) for post in posts], safe=False, status=200)

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
