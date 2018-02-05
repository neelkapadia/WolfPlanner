from pymongo import MongoClient

def db_connect(db_name):
    client = MongoClient('localhost', 27017)  #host, port
    db = client[db_name]
    return db

print(db_connect('SE'))