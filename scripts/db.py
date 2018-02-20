from pymongo import MongoClient
from datetime import datetime
import json
from bson import json_util

#uri = "mongodb://rtrgntsg:menzies@ds231758:56789"
#uri = "mongodb://rtrgntsg:menzies@ds231758.mlab.com:31758/se"
#client = MongoClient(uri, connectTimeoutMS=30000, socketTimeoutMS=None, socketKeepAlive=True)

def insert(db):
	json_details = json.dumps(
		{
				'_id': 200199811,
				'name': "Neel Kapadia",
				'tasks': [
					{
						'name': 'STDM HW 1',
						'type': 'HW',
						'duration': 6,
						#'deadline': datetime(2018, 2, 15, 0, 0, 0),
						'number': 1
					},
					{
						'name': 'DBMS HW 1',
						'type': 'HW',
						'duration': 4,
						#'deadline': datetime(2018, 2, 12, 0, 0, 0),
						'number': 1
					}
				],
				'fixedTasks': [
					{
						'name': "SE",
						'_id': "CSC510",
						#'startTime': datetime(1, 1, 1, 18, 00, 00),
						#'endTime': datetime(1, 1, 1, 19, 15, 00)
						'days': ["tuesday", "thursday"]
					},
					{
						'name': "DBMS",
						'_id': "CSC540",
						#'startTime': datetime(1, 1, 1, 13, 30, 00),
						#'endTime': datetime(1, 1, 1, 4, 45, 00)
						'days': ["monday", "wednesday"]
					},
					{
						'name': "STDM",
						'_id': "CSC591-013",
						#'startTime': datetime(1, 1, 1, 10, 15, 00),
						#'endTime': datetime(1, 1, 1, 11, 30, 00)
						'days': ["monday", "wednesday"]
					}
				]
			}, default = json_util.default)


	d = json.loads(json_details)
	db.student.insert_one(d)

def retrieve(db):
	print("Hi")
	query = json.dumps({
    '_id': 200199811})
	query = json.loads(query)
	
	d = db.student.find(query)
	for doc in d:
		print(doc)



client = MongoClient("ds231758.mlab.com", 31758 ,connectTimeoutMS=30000, socketTimeoutMS=None, socketKeepAlive=True)
db = client['se']
user = "rtrgntsg"
password = "menzies"
db.authenticate(user, password)
print("Hi")
retrieve(db)
