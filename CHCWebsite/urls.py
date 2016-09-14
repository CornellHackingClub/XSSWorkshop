"""CHCWebsite URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic.base import TemplateView
from django.contrib.auth import views

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^', include('home.urls')),
    url(r'^login/', views.login, name='login'),
    url(r'^logout/', views.logout, {'next_page': '/'}, name='logout'),
    url(r'^lectures/', include('lectures.urls')),
    url(r'^writeups/', include('writeups.urls')),
    url(r'^guides/', include('guides.urls')),
    url(r'^lcalc/', TemplateView.as_view(template_name='lcalc.html')),
    url(r'^contact/', include('home.urls')),
    url(r'^about/', include('home.urls')),
    url(r'^sponsorship/', include('home.urls')),
    url(r'^faq/', include('faq.urls')),
    url(r'^tools/', TemplateView.as_view(template_name='tools.html'), name="tools")
]

admin.site.site_header = 'Cornell Hacking Club Admin Page'

# if settings.DEBUG == True:
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

