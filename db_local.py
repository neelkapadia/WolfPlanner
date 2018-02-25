from pymongo import MongoClient
from datetime import datetime
from pprint import pprint


def db_connect(db_name):
	client = MongoClient('localhost', 27017)  # host, port
	db = client[db_name]
	return db

def db_insert(db_name, collection_name):
	db = db_connect(db_name)
	db[collection_name].insert(
		{
			'_id': 200199811,
			'name': "Neel Kapadia",
			# '_id': 200200389,
			# 'name': "Rohit Naik",
			'tasks': [
				{
					'name': 'STDM HW 1',
					'type': 'HW',
					'duration': 6,
					'deadline': datetime(2018, 2, 15, 0, 0, 0),
					'number': 1
				},
				{
					'name': 'DBMS HW 1',
					'type': 'HW',
					'duration': 4,
					'deadline': datetime(2018, 2, 12, 0, 0, 0),
					'number': 1
				}
			],
			'fixedTasks': [
				{
					'name': "SE",
					'_id': "CSC510",
					'startTime': datetime(1, 1, 1, 18, 00, 00),
					'endTime': datetime(1, 1, 1, 19, 15, 00),
					'days': ['2', '4']
				},
				{
					'name': "DBMS",
					'_id': "CSC540",
					'startTime': datetime(1, 1, 1, 13, 30, 00),
					'endTime': datetime(1, 1, 1, 14, 45, 00),
					'days': ['1', '3']
				},
				{
					'name': "STDM",
					'_id': "CSC591-013",
					'startTime': datetime(1, 1, 1, 10, 15, 00),
					'endTime': datetime(1, 1, 1, 11, 30, 00),
					'days': ['1', '3']
				}
			]
		}
	)


def db_retrieve(db_name, collection_name, user_id):
	db = db_connect(db_name)
	record = db[collection_name].find_one(
		{
			'_id': user_id
		}
	)
	return record


def db_update(db_name, collection_name, user_id, record_key, record_val):
	db = db_connect(db_name)

	db[collection_name].update_one({
		'_id': user_id
	},
	{
		'$push':{
			record_key:record_val
		}
	})

if __name__ == '__main__':
	db_insert('SE', 'student')
	# pprint(db_retrieve('SE', 'student', 200200389))
