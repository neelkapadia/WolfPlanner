import ast
import bisect
import pickle
import sys
from collections import defaultdict
from datetime import datetime
from pprint import pprint
import db_scripts
from datetime import timedelta
import _random

def __init__(self, priority, name):
	self.priority	=	priority
	self.name	=	name.replace("\n", "")
#self.id =	int(random()  * 10000)

# Kepping the same format.
def string_to_datetime(datetime_str):
	return datetime.strptime(datetime_str, '%Y-%m-%d %H:%M:%S')

#Handling cases with past deadlines.
def past_deadline(_student_record):
	today = datetime.now()
	tasks = _student_record['tasks']
	new_tasks = tasks[:]
	for task in tasks:
		if string_to_datetime(task['deadline']) < today:
			new_tasks.remove(task)

	# Update tasks to the new_tasks (i.e. removing those which have been scheduled successfully)
	db_scripts.db_update(db_name, collection_name, _student_record['uid'], 'tasks', new_tasks, username, password)
	
def priority_cmp(self, other):
	if self.priority 	< 	other.priority:
		return -1
	elif self.priority > other.priority:
		return 1
	return 0

#Deadline monotonic comparison
def tasktype_cmp(self, other):
	if self.deadline < other.deadline:
		return -1
	if self.deadline > other.deadline:
		return 1
	return 0

def generate_free_time(_student_record, buffer_time, day_date):
	free_time = defaultdict(list)
	# Set the entire day window for every day from 8AM to 12PM
	# Since days are stored from 1 to 7 - 1 being Monday and 7 being Sunday
	for day in '1234567':
		date = day_date[day]

		stime = ':'.join(['08', '00', '00'])
		start_time = string_to_datetime(date + ' ' + stime)

		etime = ':'.join(['00', '00', '00'])
		end_time = string_to_datetime(date + ' ' + etime)

		free_time[day].append(start_time)
		free_time[day].append(end_time)

	# Adding fixed tasks to each day to find free time
	for record in _student_record['fixedTasks']:
		# Converting string datetimes (for JSON storing) to datetime objects
		start_time = string_to_datetime(record['startTime'])
		end_time = string_to_datetime(record['endTime'])

		# Adding buffer time to start time
		if start_time.minute < buffer_time:
			new_minutes = 60 - (buffer_time - start_time.minute)
			new_hours = start_time.hour - 1
		else:
			new_minutes = start_time.minute - buffer_time
			new_hours = start_time.hour
		start_time = datetime(start_time.year, start_time.month, start_time.day, new_hours, new_minutes, start_time.second)

		# Adding buffer time to end time
		if end_time.minute + buffer_time >= 60:
			new_minutes = buffer_time + end_time.minute - 60
			new_hours = end_time.hour + 1
		else:
			new_minutes = end_time.minute + buffer_time
			new_hours = end_time.hour
		end_time = datetime(end_time.year, end_time.month, end_time.day, new_hours, new_minutes, end_time.second)

		for day in record['days']:
			# bisect_right since even if there is an endTime inside the array which corresponds to the startTime exactly such that the startTime we are inserting should be to the right of this already present endTime
			date = day_date[day]
			stime = ':'.join([str(start_time.hour), str(start_time.minute), str(start_time.second)])
			etime = ':'.join([str(end_time.hour), str(end_time.minute), str(end_time.second)])

			start_time = string_to_datetime(date + ' ' + stime)
			end_time = string_to_datetime(date + ' ' + etime)

			pos = bisect.bisect_right(free_time[day], start_time)

			# Only need to find the correct position of startTime. endTime to be inserted will ALWAYS be after that.
			free_time[day].insert(pos, start_time)
			free_time[day].insert(pos + 1, end_time)

	db_scripts.db_update(db_name, collection_name, _student_record['uid'], 'freeTime', free_time, username, password)


def generate_schedule(unityId, day_date, _student_record, buffer_time):
	past_deadline(_student_record)
	if not 'freeTime' in _student_record:
		# print("inside if")
		generate_free_time(_student_record, buffer_time, day_date)
		# Above query replaced by the following query.
		_student_record = db_scripts.db_retrieve(db_name, collection_name, unityId, username, password)

	tasks = _student_record['tasks']

	# Initially free_time is the same as the original. As tasks get added, free_time reduces.
	free_time = _student_record['freeTime']

	# The smallest quantum of time in which the student is willing to work
	window_size = 1
	# The schedule entry to be added to the student_record
	schedule = defaultdict(list)
	sorted_tasks = sorted(tasks, key=lambda task: (task['priority'], task['deadline']))

	for task in sorted_tasks:
		rem_time = float(task['duration'])

		for day in '1234567':
			if rem_time == 0:
				# Go to next task
				break

			if day_date[day] > task['deadline']:
				# abort task scheduler and tell the user that he has to finish it in the whatever time slice has been assigned
				# (i.e. if duration = 4 hrs but after assigning a time slice of 2 the deadline is crossed,
				# then tell them to do it in 2)
				print("Sorry! The task", task['name'], "cannot be scheduled completely. You will have to complete the task in",
				      task['duration']-rem_time, "hours instead of", task['duration'], "hours!")
				break

			idx = 0
			while idx < len(free_time[day]):
				if rem_time == 0:
					break
				start_time = free_time[day][idx]
				end_time = free_time[day][idx + 1]
				# Difference between two consecutive datetime objects (in seconds)
				avail = end_time - start_time
				time_avail = avail.seconds/3600
				# If the number of available hours for this window is more than the window_size
				# if diff.hours >= window_size:
				if time_avail >= window_size:
					if time_avail >= rem_time:
						# Add the duration of remaining time to the free_time
						# end_time (date) should be start_time (date) + rem_time (float)
						end_hours = start_time.hour + int(rem_time)
						extra_minutes = int((rem_time - int(rem_time))*60)
						end_minutes = start_time.minute + extra_minutes

						if end_minutes >= 60:
							end_minutes -= 60
							end_hours += 1

						end_time = datetime(start_time.year, start_time.month, start_time.day, end_hours, end_minutes)
						rem_time = 0
					# If the amount of time available is less than the total time required
					else:
						rem_time -= time_avail
					pos = idx + 1
					free_time[day].insert(pos, start_time)
					free_time[day].insert(pos + 1, end_time)
					schedule[day].append([start_time, end_time, task['name']])
				# pprint("In while")
				idx += 2

	# # Update tasks to the new_tasks (i.e. removing those which have been scheduled successfully)
	# db_scripts.db_update(db_name, collection_name, _student_record['uid'], 'tasks', new_tasks, username, password)

	pprint(schedule)
	if schedule:
		pass
		db_scripts.db_update(db_name, collection_name, _student_record['uid'], 'schedule', schedule, username, password)
		return schedule
	# Suggestion: if we reach the deadline and the task is not getting completed, we can try scheduler again
	# by reducing the buffer to 15 mins/0 mins (this is optimization i guess. can be ignored for now)



db_name = 'mydb'
collection_name = 'student'
username = 'Sanya'
password = 'Qwerty7'

unityId = sys.argv[1]

day_date = ast.literal_eval(sys.argv[2])
buffer_time = int(sys.argv[3])

# unityId is the only parameter on which we query right now. Can be modified to have other parameters as well.
student_record = db_scripts.db_retrieve(db_name, collection_name, unityId, username, password)
print(student_record)

schedule = generate_schedule(unityId, day_date, student_record, buffer_time)

# print("Success!")
print(schedule)
sys.stdout.flush()