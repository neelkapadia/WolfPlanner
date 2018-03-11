# WolfPlanner
### Problem Statement
With the number of tasks increasing day-by-day, it is becoming difficult for individuals to manage so many tasks considering the varying amount of time available and required to complete them. It requires continuous and active effort to create weekly schedules. This leads to wastage of valuable time, and poor planning might lead to excessive workloads. In such situations, an application that makes a schedule (time-table) for the individuals taking into account their pending tasks, deadlines will be a great asset for students. 
 

### Basic Flow of the System
Before showing a typical communication with the bot, let us discuss some points about the application.
WolfPlanner is designed for students to help them in planning their activities by generating a weekly schedule. Thus, the intended user of the system is student.

Every new student user, receives a Slack invite to join the workspace inorder to access the WolfPlanner bot.
1. Student starts conversation with the bot with a greeting like `Hi`, `Hello`
2. The bot responds to the user asking for the unity id
3. The student enters the unity ID and the student profile is created.
4. The student can now access different options such as `add task`, `add course`,  `view tasks`, `view courses`, `view tasks` and `fetch schedule`
At any point of the conversation the user can access these commands by asking for `help`.
5. The student can `add course` which the user interacts with a popup dialog which takes the course details as input,
6. The student can `add tasks` which include tasks such as Project, Interview Prep, Job, Homework among others. Task input is done in a way similar to that of adding courses.
7. Once the tasks and courses have been entered,  `view course`, `view tasks` commands can be accessed to view them respectively. 
8. Now, the student can request for the schedule to be generated, using the `fetch schedule` command. 
9. The bot generates the schedule for the student and the week's schedule is generated. 

### Use Cases
The most important use cases of the application are -

#### 1. Add courses -

Students add a set of tasks such as lecture timings and days which stay fixed throughout the semester. 

#### 2. Add new task -

Students can add various other tasks to their To Do list along with the amount of time they expect to keep aside for it. These can be tasks like Home works, Coding practice, Project Discussions, etc.

#### 3. Generate schedule -

Students can generate the schedule for the week, based on the fixed tasks they have and the additional tasks they need to get done in the week. They can set the window size according to their convenience i.e. some users may want their tasks to be scheduled even in small slots of time, whereas others might want to take rest if the available amount of time is too small for their liking.  
Also, if they want to regenerate the schedule due to addition of tasks during the week, they can call this again to get the updated schedule.

#### 4. Add to calendar -

Students can easily export their generated schedule to Google Calendar for easy access for the schedule and setting reminders about the scheduled events.


### Contributors
Neel Kapadia - [ntkapadi](https://github.com/neelkapadia)<br/>
Rohit Naik - [rtnaik](https://github.com/rohitnaik246)<br/>
Sainag Shetty - [sgshetty](https://github.com/SainagShetty)<br/>
Rohan Chandavarkar - [rgchanda](https://github.com/RohanChandavarkar)
