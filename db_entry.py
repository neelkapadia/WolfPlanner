from pymongo import MongoClient
from db_connection import db_connect
from datetime import datetime
# from datetime import time
from pprint import pprint as p

db = db_connect('SE')

def db_insert():
	db.student.insert(
		{
			'_id': 200200389,
			'name': "Rohit Naik",
			'tasks': [
			{
				'name':'STDM HW 1', 
				'type':'HW',
				'duration': 6, 
				'deadline': datetime(2018, 02, 15, 0, 0, 0), 
				'number': 1 
			},
			{
				'name':'DBMS HW 1', 
				'type':'HW', 
				'duration': 4, 
				'deadline': datetime(2018, 02, 12, 0, 0, 0), 
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

def db_retrieve():
	x = db.student.find_one(
		{
			'_id': 200199811
		}
		)
	print(x[0])


#db_insert()
db_retrieve()