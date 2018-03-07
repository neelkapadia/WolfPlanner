import bisect
import json
from collections import defaultdict
from datetime import datetime
from dateutil.relativedelta import relativedelta
from pprint import pprint

import db_scripts


def string_to_datetime(datetime_str):
	return datetime.strptime(datetime_str, '%Y-%m-%d %H:%M:%S')


def call_query(db_name, username, password, unityId):
	db = db_scripts.db_connect(db_name, username, password)
	query = json.dumps({
		'_id': unityId
	})
	print('Query -\n', query, '\n')

	query = json.loads(query)
	return db.student.find_one(query)


def generate_free_time(student_record):
	free_time = defaultdict(list)
	# Set the entire day window for every day from 8AM to 10PM
	# Since days are stored from 1 to 7 - 1 being Monday and 7 being Sunday
	for day in '1234567':
		free_time[day].append(datetime(1, 1, 1, 8, 0, 0))
		free_time[day].append(datetime(1, 1, 1, 22, 0, 0))

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
			free_time[day].insert(pos + 1, end_time)

		##new change
		# Would be implemented already when the fixedTasks will be added from nodeJS
		##algorithm
		# insert start times as 30 mins earlier than stated and end time as 30 mins later than stated (for buffer)
		# for example, if start time of STDM is 10:15 then insert 9:45 and if end time is 11:30 then insert 12
		# keep buffer in free time array

	## new change (enhancement)
	# password and username from file
	db_scripts.db_update(db_name, collection_name, student_record['_id'], 'freeTime', free_time, username, password)


# Date
# Should return the student_record with schedule updated
def generate_schedule(student_record, unityId, day_date):
	if not 'freeTime' in student_record:
		generate_free_time(student_record)

		# query = json.dumps({'_id': unityId})
		# query = json.loads(query)
		# student_record = db.student.find_one(query)

		# Above query replaced by the following query.
		student_record = db_scripts.db_retrieve(db_name, collection_name, unityId, username, password)

	tasks = student_record['tasks']

	# Defining variables to be used in the algorithm

	# schedule should be the free time array for the ith day. CHECK!!!
	# Initially free_time is the same as the original. As tasks get added, free_time reduces.
	free_time = student_record['freeTime']
	# The smallest quantum of time in which the student is willing to work
	window_size = 1
	# The schedule entry to be added to the student_record
	schedule = defaultdict(list)

	pprint(student_record)

	# ALGORITHM STARTS HERE -
	# sort tasks based on deadline and if conflicting then select the one with lesser hours.
	# String form of dates (deadlines) can directly be compared for inequality to order the tasks by deadlines.
	sorted_tasks = sorted(tasks, key=lambda task: task['deadline'])

	# add a completed = false attribute in task
	# CHECK!!!!!
	# db_scripts.db_update(db_name, collection_name, unityId, 'completed', False, username, password)

	##design doubt: if l = [1,2,5,6,7], can I add [3,4] in between the current list? -> l = [1,2,3,4,5,6,7]??
	##If yes then we just have to add the start time and end time of the time slice provided to the task in the schedule array.

	# new change
	for task in sorted_tasks:
		# rem_time = relativedelta()
		# rem_time.hours = task['duration']
		rem_time = task['duration']

		# curr_date = datetime.now()
		# check format of free time for days, check for monday and if monday is over then go to tuesday!
		# I guess we will need 3 for loops
		# 1 to 7

		# # Debugging
		# print(rem_time, curr_date, task)
		# return

		# for i in range(0, len(schedule) - 1):
		for day in '1234567':
			# Mostly == 0, but safe side <= 0 is added
			if rem_time == 0:
				# Go to next task
				break

			# current day should be the day for which we are scheduling
			# curr_day = day

			# If the deadline - sunday's date is less than the day you are on (i.e. day), then abort
			# This is so because in this case, we are already past the deadline
			if day_date[day] > task['deadline']:
				# abort task scheduling and tell the user that he has to finish it in the whatever time slice has been assigned
				# (i.e. if duration = 4 hrs but after assigning a time slice of 2 the deadline is crossed,
				# then tell him to do it in 2)
				print("Sorry! Cannot be scheduled. You will have to complete the task in ", task['duration']-rem_time, " hours!")
				break

			# One more for loop. Traversing each and every row of free time
			# Difference between two consecutive values. If difference > 1 -> assign in that timeframe

			print()

			for idx in range(0, len(free_time[0][day]), 2):
				if rem_time == 0:
					# Go to next task
					break
				start_time = free_time[0][day][idx]
				end_time = free_time[0][day][idx + 1]
				# Difference between two consecutive datetime objects (in seconds)
				# diff = relativedelta(end_time, start_time)
				avail = end_time - start_time
				time_avail = avail.seconds/3600
				# If the number of available hours for this window is more than the window_size
				# if diff.hours >= window_size:
				if time_avail >= window_size:
					# If the amount of time available is greater than equal to remaining needed amount of time
					# if diff.hours >= rem_time:
					if time_avail >= rem_time:
						# Add the duration of remaining time to the free_time
						# end_time (date) should be start_time (date) + rem_time (float)
						end_hours = start_time.hour + int(rem_time)
						extra_minutes = int((rem_time - int(rem_time))*60)
						# print('EXTRA MINUTESS!!!! ', extra_minutes)
						end_minutes = start_time.minute + extra_minutes

						if end_minutes >= 60:
							end_minutes -= 60
							end_hours += 1

						end_time = datetime(start_time.year, start_time.month, start_time.day, end_hours, end_minutes)
						# end_time = free_time[idx + 1]

						# add the task to the schedule
						rem_time = 0
						# mark task as completed
						# break till the next task
					# If the amount of time available is less than the total time required
					else:
						rem_time -= time_avail

					pos = idx + 1
					free_time[0][day].insert(pos, start_time)
					free_time[0][day].insert(pos + 1, end_time)
					schedule[day].append([start_time, end_time, task['name']])
		print('TASK and REMAINING TIME')
		print(task['name'], rem_time)
	pprint(schedule)
	return schedule
						# rem_time.hours -= diff.hours
						# if rem_time.minutes >= diff.minutes:
						# 	rem_time.minutes -= diff.minutes
						# else:
						# 	rem_time.minutes = diff.minutes - rem_time.minutes
						# 	rem_time.hours -= 1

			# if task['startTime'] < schedule[day + 1]:
			# 	##check how to take difference in dates
			# 	diff = schedule[idx + 1] - schedule[idx]
			# 	if diff >= 1:
			# 		if diff >= rem:
			# 			pass
			# 			##add task in this time frame
			# 			##mark task as completed
			# 			# break till the next task
			# 		else:
			# 			rem = rem - diff

					##add task in this time frame
					##do not mark task as completed

					##Suggestion: if we reach the deadline and the task is not getting completed, we can try scheduling again
					##by reducing the buffer to 15 mins/0 mins (this is optimization i guess. can be ignored for now)

					# ATTRIBUTE
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

# dummy day_date variable for testing (till input received from bot)
day_date = {
	'1': '2018-03-05',
	'2': '2018-03-06',
	'3': '2018-03-07',
	'4': '2018-03-08',
	'5': '2018-03-09',
	'6': '2018-03-10',
	'7': '2018-03-11'
}

if __name__ == "__main__":
	# db = db_scripts.db_connect(db_name, username, password)
	#
	# query = json.dumps({
	# 	'_id': unityId
	# })
	# pprint('Query is -\n', query)
	# query = json.loads(query)

	# unityId is the only parameter on which we query right now. Can be modified to have other parameters as well.
	student_record = db_scripts.db_retrieve(db_name, collection_name, unityId, username, password)

	updated_student_record = generate_schedule(student_record, unityId, day_date)
