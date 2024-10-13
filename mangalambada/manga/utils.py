from manga.models import Manga

def is_manga_exist(title, author):
    try:
        manga = Manga.objects.get(title=title, author_id=author)
        return True
    except Manga.DoesNotExist:
        return False