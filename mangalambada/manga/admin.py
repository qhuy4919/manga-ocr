from django.contrib import admin
from .models import (
    Author,
    Manga, 
    Chapter, 
    Page,MangaGenre, 
    Genre
)
# Register your models here.
admin.site.register([
    Author,
    Manga, 
    Chapter, 
    Page,MangaGenre, 
    Genre
])