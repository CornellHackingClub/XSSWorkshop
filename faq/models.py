from __future__ import unicode_literals

from django.db import models

# Create your models here.
class FAQ(models.Model):
    title = models.CharField(max_length=125)
    user = models.CharField(max_length=125)
    session = models.CharField(max_length=125,blank=True)

    def __unicode__(self):
        # This is the title of the lecture that will display in the admin page
        return self.title