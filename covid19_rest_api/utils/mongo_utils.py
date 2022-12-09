from pymongo import MongoClient
import urllib.parse

def create_mongo_client():
    username = urllib.parse.quote_plus('username')
    password = urllib.parse.quote_plus('password')
    client = MongoClient('mongodb://%s:%s@<IP_ADDRESS>' % (username, password))

    return client
