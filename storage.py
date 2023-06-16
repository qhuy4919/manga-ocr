import os
import uuid

"""
    File Storage class
"""
class FileStorage:
    def __init__(self, store_url):
        super().__init__()
        self.store_url = store_url
        self.DEFAULT_FILE_NAME = "noname.jpg"

    def __get_path_to_file(self, fname):
        return os.path.join(self.store_url, fname)
    
    def __generate_name_from_file(self, file):
        random_uuid = uuid.uuid4()
        random_uuid_str = str(random_uuid)

        filename = file.filename
        if filename is None:
            filename = self.DEFAULT_FILE_NAME

        return f'{random_uuid_str}_{filename}'

    def save_file(self, file):
        file_name = self.__generate_name_from_file(file)
        file_path = self.__get_path_to_file(file_name)
        file.save(file_path)
        try:
            file.close()
        except:
            pass
        return file_name

    def get_file_url(self, file_name):
        return self.__get_path_to_file(file_name)

    def does_file_name_exist(self, file_name):
        file_url = self.__get_path_to_file(file_name)
        return os.path.exists(file_url)

    def delete_file(self, file_name):
        file_url = self.__get_path_to_file(file_name)
        try:
            os.remove(file_url)
            return True
        except:
            return False