from pymongo import MongoClient
import urllib.parse

def create_mongo_client():
    username = urllib.parse.quote_plus('master')
    password = urllib.parse.quote_plus('thisisjustatest!')
    client = MongoClient('mongodb://%s:%s@10.211.55.3' % (username, password))

    return client