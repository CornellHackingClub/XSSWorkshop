from django.shortcuts import render, get_object_or_404
from .models import Writeups


def writeups_home(request):
    queryset = Writeups.objects.all()
    page = request.GET.get("page")
    if not page:
        page = "1"
    error = None
    if page and page != "1":
        error = True
        queryset = None
        page = page
    context = {
        "ctfs": queryset,
        "next" : 2,
        "error" : error,
        "page" : page
    }
    response = render(request, "writeups-main.html", context)
    response['X-XSS-Protection'] = 0
    return response


def writeups_detail(request, id):
    instance = get_object_or_404(Writeups, id=id)
    context = {
        "writeup": instance,
    }
    return render(request, "writeup.html", context)