import bisect
import json
from collections import defaultdict
from datetime import datetime
from pprint import pprint

import db_scripts


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

			##new change
			##algorithm
			#insert start times as 30 mins earlier than stated and end time as 30 mins later than stated (for buffer)
			#for example, if start time of STDM is 10:15 then insert 9:45 and if end time is 11:30 then insert 12
			#keep buffer in free time array

	##new change
	db_update('SE', 'student', student_record['_id'], 'freeTime', free_time, 'rtrgntsg', 'menzies')


##new change
def generate_schedule(student_record):
	if not 'freeTime' in student_record:
		generate_free_time(student_record)
		query = json.dumps({'_id': "sgshetty"})
		query = json.loads(query)
		student_record = db.student.find(query)
	
	tasks = student_record['tasks']
	schedule = student_record['freeTime']



	##algorithm
	#sort tasks based on deadline and if conflicting then select the one with lesser hours
	#tasks = sorted(tasks)
	##add a completed = false attribute in task

	##design doubt: if l = [1,2,5,6,7], can i add [3,4] in betwwen the current list? -> l = [1,2,3,4,5,6,7]?? 
	##If yes then we just have to add the start time and end time of the time slice provided to the task in the schedule array.
	##If no then it will be better to implement free_time as a linked list

	##new change
	for task in tasks:
		rem = task['duration']
		curr_date = datetime.now()
		##check format of free time for days, check for monday and if monday if over then go to tuesday! I guess we will need 3 for loops
		for i in range(0,len(schedule) - 1):
			curr_date = schedule[i]
			if curr_date > task['deadline']:
				##abort task scheduling and tell the user that he has to finish it in the whatever time slice has been assigned 
				##(i.e. if duration = 4 hrs but after assigning a time slice of 2, the deadline is crossed then tell him to do it in 2
			if task['startTime'] < schedule[i+1] :
				##check how to take difference in dates
				diff = schedule[i-1] - schedule[i]
				if diff >= 1:
					if diff >= rem:
						##add task in this time frame
						##mark task as completed
					else:
						rem = rem - diff
						##add task in this time frame
						##do not mark task as completed

	##Suggestion: if we reach the deadline and the task is not getting completed, we can try scheduling again
	##by reducing the buffer to 15 mins/0 mins (this is optimization i guess. can be ignored for now)

	##schedule now contains all the tasks and fixed_tasks scheduled according to the time slots
	##print the schedule and we are done!


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
