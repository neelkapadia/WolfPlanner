# WolfPlanner
### Problem Statement
With the number of tasks increasing day-by-day, it is becoming difficult for individuals to manage so many tasks considering the varying amount of time available and required to complete them. It requires continuous and active effort to create weekly schedules. This leads to wastage of valuable time, and poor planning might lead to excessive workloads. In such situations, an application that makes a schedule (time-table) for the individuals taking into account their pending tasks, deadlines will be a great asset for students. 

### Bot Description

### Steps for Running and Installing

### Basic Flow of the System
Before showing a typical communication with the bot, let us discuss some points about the application.
WolfPlanner is designed for students to help them in planning their activities by generating a weekly schedule. Thus, the intended user of the system is student.
1. Student starts conversation with the bot: `Hi`
2. The bot responds to the user asking for the unity id: `Hi. Please enter your unity ID.`
3. The student enters the unity ID.
4. The bot then checks the database for a corresponding entry to the student ID.
5. If it exists, then the bot asks the student to enter the list of tasks he/she has to perform for the following week: `Please enter the tasks which you want to be scheduled.`
6. If not, then the bot asks the user to enter details to create a new profile in the system and then asks for the set of tasks to be scheduled.
7. Upon receiving the tasks, the bot will generate a time-table for the student and simultaneously adds the tasks with corresponding timing on Google Calendar of the student's university account.
8. The bot now sends the user an image of the schedule which it generated.

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