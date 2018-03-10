from pymongo import MongoClient
from datetime import datetime
import json

# uri = "mongodb://rtrgntsg:menzies@ds231758:56789"
# uri = "mongodb://rtrgntsg:menzies@ds231758.mlab.com:31758/se"
# client = MongoClient(uri, connectTimeoutMS=30000, socketTimeoutMS=None, socketKeepAlive=True)


def db_connect(db_name, username, password):
	#get connection object to the server space
	client = MongoClient("ds231758.mlab.com", 31758, connectTimeoutMS=30000, socketTimeoutMS=None, socketKeepAlive=True)
	#select the database name which you want to work on
	db = client[db_name]
	#authenticate connection to the database. Without this your object won't be able to read/write from/to the database
	try:
		db.authenticate(username, password)
		print("Authentication Successful.")
		#return the authenticated database handle
		return db
	except:
		print("Authentication failed. You must try again.")
	


def db_insert(db_name, collection_name, unityId, slackId, email, name, username, password):
	#connect to the database
	db = db_connect(db_name, username, password)
	#dumps function converts the parameter into JSON object
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
	try:
		#insert the object in the database
		db[collection_name].insert_one(entry)
		print("Insertion Successful")
	except:
		print("Sorry we encountered some error in inserting.")


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

	try:
		data = db[collection_name].find_one(query)
		print("Successfully Retrieved")
		return data
	except:
		print("Sorry we encountered some error in retrieving.")

def db_update(db_name, collection_name, unityId, record_key, record_val, username, password):
	db = db_connect(db_name, username, password)
	try:
		db[collection_name].update_one({
			'_id': unityId
		},
		{
			'$set':{
				record_key:record_val
			}
		})
		print("Update Successful")
	except:
		print("Sorry we encountered some error in updating.")

if __name__ == '__main__':
	db_connect('se', 'rtrgntsg', 'menzies')
	#db_insert('se', 'student', 'ntkapadi', 'Y1279HXQ1', 'ntkapadi@ncsu.edu', 'Neel Kapadia', 'rtrgntsg', 'menzies')
	#print(db_retrieve('se','student','ntkapadi','rtrgntsg','menzies'))
	#db_update('se', 'student', 'ntkapadi', 'tasks', '{"name": "STDM HW 3","type": "HW","duration": 10,"deadline": "2018-03-10 23:59:00","number": 4},{"name": "SE Proj 2","type": "HW","duration": 20,"deadline": "2018-03-12 08:30:00","number": 1}', 'rtrgntsg', 'menzies')