from scripts import db_scripts
from pprint import pprint
from datetime import datetime
from collections import defaultdict
import bisect
from pymongo import MongoClient
import json

def string_to_datetime(datetime_str):
	return datetime.strptime(datetime_str, '%Y-%m-%d %H:%M:%S')


def generate_free_time(student_record):
	free_time = defaultdict(list)
	# Set the entire day window for every day from 8AM to 10PM
	# Since days are stored from 1 to 7 - 1 being Monday and 7 being Sunday
	
	for day in '1234567':
		free_time[day].append(datetime(1,1,1,8,0,0))
		free_time[day].append(datetime(1,1,1,22,0,0))

	# Adding fixed tasks to each day to find free time
	for record in student_record['fixedTasks']:
		# Converting string datetimes (for JSON storing) to datetime objects
		start_time = string_to_datetime(record['startTime'])
		end_time = string_to_datetime(record['endTime'])
		# Keeping as a loop for now (Can be changed to make more efficient)
		for day in record['days']:
			# bisect_right since even if there is an endTime inside the array which corresponds to the startTime exactly,
			# the startTime we are inserting should be to the right of this already present endTime
			# Assumption - Distance Education courses (if any) have also been allotted a non-conflicting slot
			pos = bisect.bisect_right(free_time[day], start_time)
			# Debugging -
			# Only need to find the correct position of startTime. endTime to be inserted will ALWAYS be after that.
			free_time[day].insert(pos, start_time)
			free_time[day].insert(pos+1, end_time)

	pprint(free_time)
	# Update the student record with the free time slot
	# db_scripts.db_update(db_name, collection_name, unityId, 'freeTime', free_time, username, password)

def generate_schedule(student_record):
	if not 'freeTime' in student_record:
		generate_free_time(student_record)
		query = json.dumps({'_id': unityId})
		query = json.loads(query)
		student_record = db.student.find_one(query)

	# Generate schedule using freeTime here

	# print(student_record['name'])
	list = student_record['tasks']
	pprint(list)
	# return schedule or student_record
	return

# mlab DB details
db_name = 'se'
collection_name = 'student'
username = 'rtrgntsg'
password = "menzies"


# Details about temporary entries

# unityId = 'rgchanda'
# slackId = 'U912NK72P'
# email = 'rgchanda@ncsu.edu'
# name = 'Rohan Chandavarkar'

# unityId = 'rtnaik'
# slackId = 'U921S9WF8'
# email = 'rtnaik@ncsu.edu'
# name = 'Rohit Tushar Naik'

unityId = 'sgshetty'
slackId = 'U90JUGPU1'
email = 'sgshetty@ncsu.edu'
name = 'Sainag Ganesh Shetty'

if __name__ == "__main__":
	db = db_scripts.db_connect(db_name, username, password)

	query = json.dumps({
		'_id': unityId
	})
	query = json.loads(query)
	student_record = db.student.find_one(query)
	schedule = generate_schedule(student_record)
