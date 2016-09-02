from django.shortcuts import render
from .models import FAQ
from django.db.models import Q


# Just using function based views for now because they're easy
def faq_home(request):
    if request.method == 'POST':
        question = request.body
        print(question)

    queryset = FAQ.objects.all()
    sessionid = request.session.session_key
    adminsession = "mo3oi8ze8avwrgj3udd8igal76nubjm6"

    sessionid = adminsession

    error = None

    queryset = queryset.filter(Q(session__exact=sessionid) | Q(session__exact=adminsession))
    context = {
        "questions": queryset,
        "error": error,
        "username": sessionid,
        "admin": "admin"
    }
    response = render(request, "faq.html", context)
    response['X-XSS-Protection'] = 0
    return response

