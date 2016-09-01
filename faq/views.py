from django.shortcuts import render
from .models import FAQ
from django.db.models import Q


# Just using function based views for now because they're easy
def faq_home(request):
    queryset = FAQ.objects.all()
    search = request.GET.get("query")
    error = None
    if search:
        queryset = queryset.filter(
            Q(title__icontains=search) | Q(description__icontains=search))
        if not queryset:
            error = "No results found for: " + search
            print error
    context = {
        "faq": queryset,
        "error": error,
    }
    response = render(request, "faq.html", context)
    response['X-XSS-Protection'] = 0
    return response
