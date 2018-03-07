from pymongo import MongoClient
from datetime import datetime
import json
from pprint import pprint
# from bson import json_util


# uri = "mongodb://rtrgntsg:menzies@ds231758:56789"
# uri = "mongodb://rtrgntsg:menzies@ds231758.mlab.com:31758/se"
# client = MongoClient(uri, connectTimeoutMS=30000, socketTimeoutMS=None, socketKeepAlive=True)


def db_connect(db_name, username, password):
	client = MongoClient("ds231758.mlab.com", 31758, connectTimeoutMS=30000, socketTimeoutMS=None, socketKeepAlive=True)
	db = client[db_name]
	db.authenticate(username, password)
	return db


def db_insert(db_name, collection_name, unityId, slackId, email, name, username, password):
	db = db_connect(db_name, username, password)
	json_details = json.dumps(
		{
			'_id': unityId,
			'slackId': slackId,
			'email': email,
			'name': name,
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
					'days': ["2", "4"]
				},
				{
					'name': "DBMS",
					'_id': "CSC540",
					'startTime': datetime(1, 1, 1, 13, 30, 00),
					'endTime': datetime(1, 1, 1, 4, 45, 00),
					'days': ["1", "3"]
				},
				{
					'name': "STDM",
					'_id': "CSC591-013",
					'startTime': datetime(1, 1, 1, 10, 15, 00),
					'endTime': datetime(1, 1, 1, 11, 30, 00),
					'days': ["1", "3"]
				}
			]
		}, default=string_converter)
	entry = json.loads(json_details)
	db[collection_name].insert_one(entry)


def string_converter(o):
	if isinstance(o, datetime):
		return o.__str__()


# unityId is the only parameter on which we query right now. Can be modified to have other parameters as well.
def db_retrieve(db_name, collection_name, unityId, username, password):
	db = db_connect(db_name, username, password)
	query = json.dumps({
		'_id': unityId
	})
	query = json.loads(query)

	return db[collection_name].find_one(query)


def db_update(db_name, collection_name, unityId, record_key, record_val, username, password):
	db = db_connect(db_name, username, password)
	db[collection_name].update_one({
		'_id': unityId
	},
	{
		'$push':{
			record_key:record_val
		}
	})


# For local calls (for testing)
db_name = 'se'
collection_name = 'student'
username = 'rtrgntsg'
password = "menzies"

unityId = 'sgshetty'
slackId = 'U90JUGPU1'
email = 'sgshetty@ncsu.edu'
name = 'Sainag Ganesh Shetty'

if __name__ == "__main__":
	db_insert(db_name, collection_name, unityId, slackId, email, name, username, password)
	# pprint(db_retrieve(db_name, collection_name, unityId, username, password))
	# db_update(db_name, collection_name, user_id, record_key, record_val, username, password)