from django.contrib.auth.models import User
from django.shortcuts import render
from .models import FAQ
from django.db.models import Q
from selenium import webdriver

# Just using function based views for now because they're easy
def faq_home(request):
    user = request.user



    if request.method == 'POST' and request.user.is_authenticated:
        question = request.POST['query']
        newQ = FAQ.objects.create(title=question, user=str(user))
        newQ.save()
        newQ.id

        print "Created with id" + str(newQ.id)

        driver = webdriver.PhantomJS()  # or add to your PATH
        driver.get('http://127.0.0.1:8000/login/')
        username = driver.find_element_by_name("username")
        password = driver.find_element_by_name("password")
        username.send_keys("admin")
        password.send_keys("CHCL33t")
        username.submit();
        driver.get('http://127.0.0.1:8000/faq/?id=' + str(newQ.id))
        driver.save_screenshot('screen.png')

    queryset = FAQ.objects.all()

    error = None

    print user

    if str(user) != 'admin':
        queryset = queryset.filter(Q(user__exact=str(user)) | Q(user__exact='admin'))
    else:
        if "id" in request.GET:
            idToCheck = request.GET["id"]
            queryset = queryset.filter(Q(id__exact=idToCheck))

    context = {
        "questions": queryset,
        "username": user,
        "error": error
    }

    response = render(request, "faq.html", context)
    response['X-XSS-Protection'] = 0
    return response