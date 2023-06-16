import os

class Config:
    def __init__(self, host, port):
        self.host = host
        self.port = port
    
    def get_host(self): return self.host
    
    def get_port(self): return self.port

HOST = os.getenv('HTTP_HOST')
if HOST is None:
    HOST = '127.0.0.1'

PORT = os.getenv('HTTP_PORT')
if PORT is None:
    PORT = 5000

DefaultConfig = Config(HOST, PORT)