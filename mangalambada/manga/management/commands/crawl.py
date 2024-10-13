from django.core.management.base import BaseCommand, CommandError
from manga.models import Manga
import json
from mangalambada.settings import BASE_DIR
from os.path import join
from manga.utils import is_manga_exist
from datetime import datetime


class Command(BaseCommand):
    help = 'Crawl data from mangal'
    
    def handle(self, *args, **options):
        try:
            data_path = join(BASE_DIR, 'data.json')
            # Open and read the JSON file
            with open(data_path, 'r') as file:
                data = json.load(file)
                chapterList = data['result'][0]['mangal']['chapters']
                metaData = data['result'][0]['mangal']['metadata']
                
                title = data['result'][0]['mangal']['name']
                author = data['result'][0]['mangal']['metadata']['staff']['story'][0]
                description = data['result'][0]['mangal']['metadata']['summary']
                
                # check whether mange exists or not
                if not is_manga_exist(title, author):
                    newManga = Manga(
                        _created=datetime.now(),
                        _updated=datetime.now(),
                        title=title,
                        description=description,
                        author_id=author,
                    )
                    
                    newManga.save()
    
        except Manga.unique_error_message:
            raise CommandError( Manga.unique_error_message)
    
        self.stdout.write(
            self.style.SUCCESS('Successfully insert data')
        )