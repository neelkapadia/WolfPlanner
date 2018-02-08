from pymongo import MongoClient
from datetime import datetime
from pprint import pprint


def db_connect(db_name):
	client = MongoClient('localhost', 27017)  # host, port
	db = client[db_name]
	return db

def db_insert(db_name):
	db = db_connect(db_name)
	db.student.insert(
		{
			'_id': 200199811,
			'name': "Neel Kapadia",
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
		}
	)


def db_retrieve(db_name, user_id):
	db = db_connect(db_name)
	record = db.student.find_one(
		{
			'_id': user_id
		}
	)
	pprint(record)


# db_insert('SE')
db_retrieve('SE', 200200389)
