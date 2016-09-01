from django.shortcuts import render
from .models import Guides
from django.db.models import Q

# Just using function based views for now because they're easy
def guides_home(request):
    queryset = Guides.objects.all()
    search = request.GET.get("query")
    error = None
    if search:
        queryset = queryset.filter(
            Q(title__icontains=search) | Q(description__icontains=search))
        if not queryset:
            error = "No results found for: " + search
            print error
    context = {
        "guides": queryset,
         "error" : error,
    }
    response = render(request, "guides.html", context)
    response['X-XSS-Protection'] = 0
    return response