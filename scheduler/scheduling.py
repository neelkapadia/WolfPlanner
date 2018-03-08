import bisect
from collections import defaultdict
from datetime import datetime
from pprint import pprint
import pickle

import db_scripts


def string_to_datetime(datetime_str):
	return datetime.strptime(datetime_str, '%Y-%m-%d %H:%M:%S')


def generate_free_time(student_record, buffer_time):
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

		# Keeping as a loop for now (Can be changed to make more efficient)
		for day in record['days']:
			# bisect_right since even if there is an endTime inside the array which corresponds to the startTime exactly,
			# the startTime we are inserting should be to the right of this already present endTime
			# Assumption - Distance Education courses (if any) have also been allotted a non-conflicting slot
			pos = bisect.bisect_right(free_time[day], start_time)

			# Only need to find the correct position of startTime. endTime to be inserted will ALWAYS be after that.
			free_time[day].insert(pos, start_time)
			free_time[day].insert(pos + 1, end_time)

	db_scripts.db_update(db_name, collection_name, student_record['_id'], 'freeTime', free_time, username, password)


def generate_schedule(unityId, day_date, student_record, buffer_time):
	if not 'freeTime' in student_record:
		generate_free_time(student_record, buffer_time)

		# Above query replaced by the following query.
		student_record = db_scripts.db_retrieve(db_name, collection_name, unityId, username, password)

	tasks = student_record['tasks']

	# Defining variables to be used in the algorithm

	# Initially free_time is the same as the original. As tasks get added, free_time reduces.
	free_time = student_record['freeTime']

	# The smallest quantum of time in which the student is willing to work
	window_size = 1
	# The schedule entry to be added to the student_record
	schedule = defaultdict(list)

	# sort tasks based on deadline and if conflicting then select the one with lesser hours.
	# String form of dates (deadlines) can directly be compared for inequality to order the tasks by deadlines.
	sorted_tasks = sorted(tasks, key=lambda task: (task['deadline'], task['duration']))

	for task in sorted_tasks:
		rem_time = task['duration']

		for day in '1234567':
			if rem_time == 0:
				# Go to next task
				break

			# If date for which we are scheduler is past the deadline date for the task -> STOP.
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
					# Go to next task
					break
				start_time = free_time[day][idx]
				end_time = free_time[day][idx + 1]
				# Difference between two consecutive datetime objects (in seconds)
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

				idx += 2

	pprint(schedule)
	if schedule:
		db_scripts.db_update(db_name, collection_name, student_record['_id'], 'schedule', schedule, username, password)
	# Suggestion: if we reach the deadline and the task is not getting completed, we can try scheduler again
	# by reducing the buffer to 15 mins/0 mins (this is optimization i guess. can be ignored for now)


# mlab DB details (from serialized object)
pkl_file = open('.cred.pkl', 'rb')
data = pickle.load(pkl_file)

db_name = data['db_name']
collection_name = data['collection_name']
username = data['username']
password = data['password']

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
	'1': '2018-03-05 20:30:00',
	'2': '2018-03-06 20:30:00',
	'3': '2018-03-07 20:30:00',
	'4': '2018-03-08 20:30:00',
	'5': '2018-03-09 20:30:00',
	'6': '2018-03-10 20:30:00',
	'7': '2018-03-11 20:30:00'
}

# Assumed to be in minutes (logically)
buffer_time = 15

if __name__ == "__main__":
	# unityId is the only parameter on which we query right now. Can be modified to have other parameters as well.
	student_record = db_scripts.db_retrieve(db_name, collection_name, unityId, username, password)
	generate_schedule(unityId, day_date, student_record, buffer_time)
