from django.contrib.auth.models import User
from django.shortcuts import render
from .models import FAQ
from django.db.models import Q


# Just using function based views for now because they're easy
def faq_home(request):
    user = request.user

    if request.method == 'POST' and user is not None:
        question = request.POST['query']
        FAQ.objects.create(title=question, user=user)

    queryset = FAQ.objects.all()

    error = None

    queryset = queryset.filter(Q(user__exact=user) | Q(user__exact='admin'))
    context = {
        "questions": queryset,
        "username": user,
        "error": error
    }
    response = render(request, "faq.html", context)
    response['X-XSS-Protection'] = 0
    return response

