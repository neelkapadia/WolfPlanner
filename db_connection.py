from pymongo import MongoClient

def db_connect():
    client = MongoClient('localhost', 27017)  #host, port
    db = client.SE
    return db

db_connect()