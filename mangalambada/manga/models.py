from django.db import models
from django.utils.translation import gettext_lazy as _
import uuid

class MangaStatus(models.TextChoices):
    ONGOING = 'OG', 'Ongoing'
    COMPLETED = 'CP', 'Completed'
    FINISHED = 'FN', 'Finished'
    CANCELLED = 'CN', 'Cancelled'   
    
     
# Base model for reusable fields
class BaseModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    _created = models.DateTimeField(auto_now_add=True)
    _updated = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
    
class Author(BaseModel):
    name = models.CharField(max_length=255)
    bio = models.TextField(blank=True)
    profile_image_id = models.UUIDField(blank=True)
    
    def __str__(self):
        return f"{self.name}"
    
class Genre(BaseModel):
    name = models.CharField(max_length=255, unique=True)
    
    def __str__(self):
        return f"{self.name}"
    
class Manga(BaseModel):
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    cover_image_id = models.UUIDField()
    author_id = models.ForeignKey(Author, on_delete=models.CASCADE, related_name='manga')
    genre = models.ManyToManyField(Genre, through='MangaGenre', related_name='mangas')
    status = models.CharField(
        max_length=2,
        choices=MangaStatus.choices,
    )

    def __str__(self):
        return f"{self.title}" 
    
class MangaGenre(BaseModel):
    manga_id = models.ForeignKey(Manga, on_delete=models.CASCADE)
    genre_id = models.ForeignKey(Genre, on_delete=models.CASCADE) 
    
    class Meta:
        unique_together = (('manga_id', 'genre_id'),)
    
class Chapter(BaseModel):
    chapter_number = models.IntegerField()  
    manga_id = models.ForeignKey(Manga, on_delete=models.CASCADE, related_name='chapters')
    title = models.CharField(max_length=255)
    
    class Meta:
        unique_together = ('chapter_number', 'manga_id'),
    
    def __str__(self):
        return f"{self.manga_id}-{self.title}"
    
class Page(BaseModel):
    chapter_id = models.ForeignKey(Chapter, on_delete=models.CASCADE, related_name='pages')
    image_id = models.UUIDField()
    
    def __str__(self):
        return f"{self.chapter_id}"


    
    