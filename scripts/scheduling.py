from scripts import db_scripts
from pprint import pprint
from datetime import datetime
from collections import defaultdict
import bisect

db_name = 'SE'
collection_name = 'student'
# student_id = 200200389
student_id = 200199811

student_record = db_scripts.db_retrieve(db_name, collection_name, student_id)

pprint(student_record['fixedTasks'])

free_time = defaultdict(list)

# Set the entire day window for every day from 8AM to 10PM
# Since days are stored from 1 to 7 - 1 being Monday and 7 being Sunday
for day in '1234567':
	free_time[day].append(datetime(1,1,1,8,0,0))
	free_time[day].append(datetime(1,1,1,22,0,0))

# Adding fixed tasks to each day to find free time
for record in student_record['fixedTasks']:
	# print(record)
	# Keeping as a loop for now (Can be changed to make more efficient)
	for day in record['days']:
		# bisect_right since even if there is an endTime inside the array which corresponds to the startTime exactly,
		# the startTime we are inserting should be to the right of this already present endTime
		# Assumption - Distance Education courses (if any) have also been allotted a non-conflicting slot
		pos = bisect.bisect_right(free_time[day], record['startTime'])

		# Debugging -
		# print('Before -', free_time[day], record['startTime'], record['endTime'])
		# print('pos -', pos)

		# Only need to find the correct position of startTime. endTime to be inserted will ALWAYS be after that.
		free_time[day].insert(pos, record['startTime'])
		free_time[day].insert(pos+1, record['endTime'])

		# print('After -', ), free_time[day], 'hii'

pprint(free_time)

# db_scripts.db_update('SE', 'student', 200200389, 'freeTime', free_time)
db_scripts.db_update('SE', 'student', 200199811, 'freeTime', free_time)
