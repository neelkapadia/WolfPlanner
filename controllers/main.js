var user = {}
var express = require('express');
var bodyParser = require('body-parser');
var debug = require('debug')('botkit:webserver');

var request = require('request-promise');
var cheerio = require('cheerio');
const dialogs = require('./module/dialog.js');
const prompts = require('./module/prompt.js');  
const User = require('./module/user.js');  
module.exports = function(controller) {

    controller.hears(['^hello$', '^hey$', '^hi$'], 'direct_message,direct_mention', function(bot, message) {
        controller.storage.users.get(message.user, function(err, user) {
            
        if (user && user.uid) {
            bot.reply(message, 'Hey <@'+message.user+'>!\nType `help` to find out what I can do')
        } else {
            bot.startConversation(message, function(err, convo) {
                if (!err) {
                    convo.say('Hello <@'+message.user+'>! Let\'s find out something more about you');
                    convo.ask('What is your unity id?', function(response, convo) {
                        convo.ask('Please confirm if your unity id is `' + response.text + '`?', [
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
                    }, {'key': 'uid'}); // store the results in a field called nickname
                    convo.on('end', function(convo) {
                        if (convo.status == 'completed') {
                            controller.storage.users.get(message.user, function(err, user) {
                                if (!user) {
                                    user = {
                                        id: message.user,
                                        uid: convo.extractResponse('uid'),
                                    };
                                     //console.log(get_the_user_info(user))
                                }
                                controller.storage.users.save(user, function(err, id) {
                                    bot.reply(message, 'Alright!');
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
        j = {
            "text": "`add task`: to add tasks to your schedule\n`view tasks`: to view tasks\n`add courses`: to add courses\n`view courses`: to view list of your courses\n`fetch schedule`: to get the week's schedule"
        }
        bot.reply(message, j)
    });
	controller.hears(['^fetch schedule$'], 'direct_message,direct_mention', function(bot, message) {
        console.log("fetching schedule")
        var buffer_time = 60;
        var curr = new Date;
        var first = curr.getDate() - curr.getDay() +1;
        var last = first + 6;
        var dt = {};
        for(i=first,j=1;i<=last;i++,j++){
            dt[j] = new Date(curr.setDate(i)).toISOString().split("T")[0]
        }
        User.fetch_user(message.user,function(err,unityId){
          if(err){
            console.log(err);
            return err;
          }
          console.log(dt)
        console.log(unityId)
        // var path = "./scheduler/testpy.py"
        // var spawn = require("child_process").spawn;
<<<<<<< HEAD
        // var pythonProcess = spawn('python',[path, dt]);
        var path = "scheduling.py";
        var spawn = require("child_process").spawn;
        
        // Login details
        var unityId = "sgshetty";
        var slackId = "U90JUGPU1";
        var email = "sgshetty@ncsu.edu";
        var name = "Sainag Ganesh Shetty";

        //var n1 = 2;
        //var n2 = 15;
        // var day_date = {
        //     "1": "2018-03-05 20:30:00",
        //     "2": "2018-03-06 20:30:00",
        //     "3": "2018-03-07 20:30:00",
        //     "4": "2018-03-08 20:30:00",
        //     "5": "2018-03-09 20:30:00",
        //     "6": "2018-03-10 20:30:00",
        //     "7": "2018-03-11 20:30:00"
        // };
        
        var buffer_time = 15;

        //var data = [unityId, slackId, email, name];

        //console.log("hii");
        try{
        //var pythonProcess = spawn("python",[path, n1, n2, JSON.stringify(day_date)]);
        var pythonProcess = spawn("python3",[path, unityId, slackId, email, name, JSON.stringify(day_date), buffer_time]);
        //var pythonProcess = spawn("python",[path, JSON.stringify(data), JSON.stringify(day_date), buffer_time]);
        }
        catch(err){
            console.log(err)
        }

=======
        // var pythonProcess = spawn('python',[path, unityId, JSON.stringify(dt), buffer_time]);
        });
// // Temporary function call to print the schedule from the mlab
//     User.fetch_schedule(message.user, function(err,schedule){
//         if(err){
//             console.log(err);
//             return err
//         }
//         console.log(schedule)
//     });
        
>>>>>>> 8f7d1fbe251930a818fdf9e27aeae75b6258b713
	});
    controller.hears(['^add task$'], 'direct_message,direct_mention', function(bot, message) {
        console.log("adding task"+message.user)
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
                console.log(courseList)
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
                //bot.reply(message, prompts.add_course_prompt);
            }
            else{
                var tasks = [];
                for(i=0;i<taskList.length;i++){
                    console.log(Date.parse(taskList[i].deadline))
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
