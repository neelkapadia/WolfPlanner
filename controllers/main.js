var user = {}
var express = require('express');
var bodyParser = require('body-parser');
var debug = require('debug')('botkit:webserver');
var request = require('request-promise');
var cheerio = require('cheerio');
const dialogs = require('./module/dialog.js');
const prompts = require('./module/prompt.js');
const User = require('./module/user.js');
const action = require('./module/action');
const calendar = require('../calendar.js');
const call = require('../scheduler/callpython.js');

getDayDate = function(err){
	if(err){
		console.log(err);
		return err;
	}
	var curr = new Date;
    var first = curr.getDate() - curr.getDay() +1;
    var last = first + 6;
    var dt = {};
    for(i=first,j=1;i<=last;i++,j++){
        dt[j] = new Date(curr.setDate(i)).toISOString().split("T")[0]
    }
    return dt;
}

module.exports = function(controller) {
    controller.hears(['^hello$', '^hey$', '^hi$'], 'direct_message,direct_mention', function(bot, message) {
        controller.storage.student.get(message.user, function(err, user) {
            if (user && user.uid) {
                bot.reply(message, 'Hey <@'+message.user+'>!\nType `help` to find out what I can do')
            } 
            else {
                bot.startConversation(message, function(err, convo) {
                    if (!err) {
                        convo.say('Hello <@'+message.user+'>! Let\'s find out something more about you');
                        convo.ask('What is your unity id?', function(response, convo) {
                            convo.ask('Please confirm if your unity id is `' + response.text + '`?(Yes/No)', [
                            {
                                pattern: 'yes',
                                callback: function(response, convo) {
                                    convo.next();
                                }
                            },
                            {
                                pattern: 'no',
                                callback: function(response, convo) {
                                    convo.stop();
                                }
                            },
                            {
                                default: true,
                                callback: function(response, convo) {
                                    convo.repeat();
                                    convo.next();
                                }
                            }
                        ]);
                        convo.next();
                    }, {'key': 'uid'});
                    convo.on('end', function(convo) {
                        if (convo.status == 'completed') {
                            controller.storage.student.get(message.user, function(err, user) {
                                if (!user) {
                                    user = {
                                        id: message.user,
                                        uid: convo.extractResponse('uid'),
                                    };
                                }
                                controller.storage.student.save(user, function(err, id) {
                                    bot.reply(message, 'Alright!');
                                    bot.reply(message, 'Type `help` to find out what I can do')
                                    console.log(user)
                                });
                            });
                        } else {
                            bot.reply(message, 'Okay!');
                        }
                    });
                }
            });
        }
        });
    });
    
    controller.hears(['^help$'], 'direct_message,direct_mention', function(bot, message) {
        j = {"text": "`add task`: to add tasks to your schedule\n`view tasks`: to view tasks\n`add courses`: to add courses\n`view courses`: to view list of your courses\n`fetch schedule`: to get the week's schedule\n`add to calendar`: to add your schedule to Google Calendar"};
        bot.reply(message, j)
    });

	controller.hears(['^fetch schedule$'], 'direct_message,direct_mention', function(bot, message) {
        console.log("fetching schedule")
        User.fetch_details_user(message.user, function(err,user){
            if(err){
                console.log(err);
                return err
            }
            console.log("User details -");
            console.log(user);
            var noTasks = user.tasks.length;
            var noFixedTasks = user.fixedTasks.length;
            if(typeof noFixedTasks === "undefined"){
                noFixedTasks = 0
            }
            if(noTasks==0&&noFixedTasks==0){
                bot.reply(message,"Please enter your courses and tasks before fetching the schedule")
            }
            else{
                var buffer_time = 60;

//                var curr = new Date;
//                var first = curr.getDate() - curr.getDay() +1;
//                var last = first + 6;
//                var dt = {};
//                for(i=first,j=1;i<=last;i++,j++){
//                    dt[j] = new Date(curr.setDate(i)).toISOString().split("T")[0]
//                }
                dt = getDayDate()
                console.log("DAY DATE -");
                console.log(dt);

                User.fetch_user(message.user,function(err,unityId){
                  if(err){
                    console.log(err);
                    return err;
                  }
                    call.call_python(unityId, buffer_time, dt, function(err,data){
                        if(err){
                            console.log(err);   
                            return err;
                        }
                        for(k=0;k<data.length;k++){
                            bot.reply(message,data[k])
                        }
                    });
                });
            }
        });
        
	});

	controller.hears(['^add to calendar$', '^calendar$'], 'direct_message,direct_mention', function(bot, message) {
		console.log("Adding to calendar");

		User.fetch_details_user(message.user,function(err,user){
			if(err){
				console.log(err);
				return err;
			}

			// Getting schedule into a variable for ease of use
			schedule = user['schedule'];

			console.log("SCHEDULE - ");
			console.log(schedule);
			console.log(schedule.length);

			console.log("Before condition");
			if(schedule.length == 0){
				bot.reply(message, "You have not generated a schedule yet!");
				bot.reply(message, "Please generate a schedule using `fetch schedule` and then try `add to calendar` to add it to Google Calendar");
			}
			else if(schedule.length == 1){
				console.log("Schedule available! Adding to calendar");

				// [0] since it returns an array with the only element to be the schedule dictionary
				schedule = schedule[0];
				for(key in schedule){
					console.log(key);
					console.log(schedule[key]);
//					for(element in schedule[key]){
					schedule[key].forEach(function(entry){
//						console.log(schedule[key]);
						console.log(entry);

						startDateTime = entry[0].toISOString().slice(0, -1) + '-04:00';
						endDateTime = entry[1].toISOString().slice(0, -1) + '-04:00';
						eventName = entry[2];

						console.log("Start time -", startDateTime);
						console.log("End time -", endDateTime);
						console.log("Event name -", eventName);

						calendar.call_calendar(eventName, startDateTime, endDateTime, function(err, data){
							if(err){
								console.log(err);
								return err;
							}
							console.log(data);
						});
						console.log("DONEE!!");
					});

//					console.log(key);
//					startDateTime = schedule[key][0]
//					endDateTime = schedule[key][1]
//					eventName = schedule[key][2]
//
//					console.log("Start time -", startDateTime);
//					console.log("End time -", endDateTime);
//					console.log("Event name -", eventName);

				}

//		        eventName = 'Trying calendar API';
////		        description = 'Check if passing parameters works or not!';
//		        startDateTime = '2018-03-28T09:00:00-07:00';
//		        endDateTime = '2018-03-28T14:00:00-07:00';

//				calendar.call_calendar(eventName, description, startDateTime, endDateTime, function(err, data){
//					if(err){
//						console.log(err);
//						return err;
//					}
//					console.log(data);
//					bot.reply(message, "Your schedule has been added to Google Calendar!");
//				});

				// Check position!
                bot.reply(message, "Your schedule has been added to Google Calendar!");
			}
			console.log("After condition");
//          console.log("User is -");
//          console.log(user);
//
//          console.log(user['schedule']);
//
//          console.log('schedule' in user);
//          console.log(Object.keys(user['schedule']));
//          console.log(schedule);
//          console.log(user['schedule']);
//
//          console.log(schedule.length);
//
//          empty = {};
//          console.log(empty.length == undefined);
//
//          console.log(Object.keys(user['schedule']).length);
        });
	});

    controller.hears(['^add tasks$' , '^task$', '^add task$'], 'direct_message,direct_mention', function(bot, message) {
        console.log("adding task")
        bot.reply(message,prompts.add_task_prompt);

    });

    controller.hears(['^add courses$', '^courses$', '^add course$'], 'direct_message,direct_mention', function(bot, message) {
        console.log("adding courses")
        bot.reply(message, prompts.add_course_prompt);
    });

    controller.hears(['^view courses$'], 'direct_message,direct_mention', function(bot, message) {
        User.fetch_courses(message.user,function(err,courseList){
          if(err){
            console.log(err);
            return err;
          }
          if(courseList.length == 0){
                bot.reply(message, "No courses to view")
                bot.reply(message, prompts.add_course_prompt);
            }
            else{
                var courses = [];
                var dict = {"1":"M","2":"Tu","3":"W","4":"Th","5":"Fr","6":"Sa","7":"Su"}
                for(i=0;i<courseList.length;i++){
                    var days = ""
                    for(j=1;j<=7;j++){
                        if(courseList[i].days.includes(j.toString())){
                            days += (" | "+dict[j.toString()])
                        }
                    }
                    courses.push({
                        title: courseList[i]._id + " " +courseList[i].name,
                        value: courseList[i].startTime.split(" ")[1] + " - " +courseList[i].endTime.split(" ")[1] + " " + days,
                        short: true
                    })
                }
                
                bot.reply(message, {
                    text: "Your Courses",
                    attachments: [
                        {
                            fields: courses
                        }
                    ]
                });
            }
            
        });
    });
    controller.hears(['^view tasks$'], 'direct_message,direct_mention', function(bot, message) {
        User.fetch_tasks(message.user,function(err,taskList){
          if(err){
            console.log(err);
            return err;
          }
          if(taskList.length == 0){
                bot.reply(message, "No tasks to view")
                bot.reply(message, prompts.add_task_prompt);
            }
            else{
                var tasks = [];
                for(i=0;i<taskList.length;i++){
                    var fields = [{
                        title: taskList[i].name,
                        value: "Time assigned is " + taskList[i].duration + " hours",
                    }];
                    tasks.push({
                        fields: fields,
                        ts: (Date.parse(taskList[i].deadline)/1000)
                    });
                }
                bot.reply(message, {
                    text: "Your Tasks",
                    attachments: tasks
                });
            }
            
        });
    });
};
