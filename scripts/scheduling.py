import db_scripts
from pprint import pprint
from datetime import datetime

student_record = db_scripts.db_retrieve('SE', 200200389)

pprint(student_record)

free = [datetime(1,1,1,8,0,0), datetime(1,1,1,22,0,0)]

# for entry in student_record['fixedTasks']:
# 	if entry['startTime'] > free[0]:


# for entry in student_record['fixedTasks']:
# 	free.append(entry['endTime'] - entry['startTime'])

# for entry in student_record['tasks']:
# 	print(entry['deadline'] - datetime.now())

# print(free[0].seconds)
