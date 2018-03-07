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
            "text": "`add task`: to add tasks to your schedule\n`fetch schedule`: to get the week's schedule\n`add courses`: to add courses"
        }
        bot.reply(message, j)
    });
	controller.hears(['^fetch schedule$'], 'direct_message,direct_mention', function(bot, message) {
        console.log("fetching schedule")
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
            console.log(courseList)
            bot.reply(message, courseList)
            if(courseList.length == 0){
                bot.reply(message, "No courses to view")
                bot.reply(message, prompts.add_course_prompt);
            }
        });
    });
};

var get_the_user_info = function(uid) {
	
	console.log("Here work")
	request('https://directory.ncsu.edu/directory/moreinfo.php?username='+uid.uid, function(err, resp, html) {
		var myData = []
	        if (!err){
	          const $ = cheerio.load(html);
	          $('.col-sm-6').each(function() {
				    myData.push($(this).text().trim().replace(/\r?\n|\r/g, ""))
				});
	          var temp = myData[1].split(":")
	          var myobj = { _id: uid, name: myData[0], email: temp[3].trim()};
	          user["name"] = myData[0]
	          user["email"] = temp[3].trim()
	          console.log(user["name"])
              console.log(user["email"])
              controller.storage.users.save(user, function(err, id) {
                                    //bot.reply(message, 'Alright!');
                                    console.log(user)
                                });
	          // console.log('After fetching: '+util.inspect(uid, false, null))
		      //store.add_new_user(myobj)
	      }
	});
}