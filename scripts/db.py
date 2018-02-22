from pymongo import MongoClient
from datetime import datetime
import json
from pprint import pprint
from bson import json_util


# uri = "mongodb://rtrgntsg:menzies@ds231758:56789"
# uri = "mongodb://rtrgntsg:menzies@ds231758.mlab.com:31758/se"
# client = MongoClient(uri, connectTimeoutMS=30000, socketTimeoutMS=None, socketKeepAlive=True)

def insert(db):
	json_details = json.dumps(
		{
				'_id': "rtnaik",
				'name': "Rohit Naik",
				'tasks': [
					{
						'name': 'STDM HW 3',
						'type': 'HW',
						'duration': 10,
						'deadline': datetime(2018, 3, 10, 23, 59, 0),
						'number': 1
					},
					{
						'name': 'SE Proj 1',
						'type': 'HW',
						'duration': 40,
						'deadline': datetime(2018, 3, 12, 8, 30, 0),
						'number': 1
					}
				],
				'fixedTasks': [
					{
						'name': "SE",
						'_id': "CSC510",
						'startTime': datetime(1, 1, 1, 18, 00, 00),
						'endTime': datetime(1, 1, 1, 19, 15, 00),
						'days': ["tuesday", "thursday"]
					},
					{
						'name': "DBMS",
						'_id': "CSC540",
						'startTime': datetime(1, 1, 1, 13, 30, 00),
						'endTime': datetime(1, 1, 1, 4, 45, 00),
						'days': ["monday", "wednesday"]
					},
					{
						'name': "STDM",
						'_id': "CSC591-013",
						'startTime': datetime(1, 1, 1, 10, 15, 00),
						'endTime': datetime(1, 1, 1, 11, 30, 00),
						'days': ["monday", "wednesday"]
					}
				]
			}, default=myconverter)
	d = json.loads(json_details)
	db.student.insert_one(d)


def retrieve(db, id):
	query = json.dumps({
		'_id': id})
	query = json.loads(query)

	d = db.student.find(query)
	for doc in d:
		print(doc)

def myconverter(o):
    if isinstance(o, datetime):
        return o.__str__()

client = MongoClient("ds231758.mlab.com", 31758, connectTimeoutMS=30000, socketTimeoutMS=None, socketKeepAlive=True)
db = client['se']
user = "rtrgntsg"
password = "menzies"
db.authenticate(user, password)
insert(db)
retrieve(db, "rtnaik")
