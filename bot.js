'use strict';
var Botkit = require('botkit');
var Slack = require('slack-node')
var request = require('request')
var apiai = require('apiai');
var app = apiai('5ed306a83fad4a698fb89c289008b4fc');
var config = require('./config.js');
var getuser = require('./getuser.js');

var slackUsersList =[]
var userIdNameMap = {}
var user = {}
var url = "https://api.api.ai/v1/"
var request = require('request');
var cheerio = require('cheerio');
var myData = [];

var controller = Botkit.slackbot({
    debug: false
});
var sessionMap = {}
    // connect the bot to a stream of messages
controller.spawn({

   token: config.slack_token,
}).startRTM();

controller.hears('hello',['mention', 'direct_mention','direct_message'], function(bot,message) {
    var source_user = controller.get_source_user(message);
    console.log(user);
    bot.reply(message, 'Hi ' + user.uid);
});

controller.hears(['fetch my schedule'], 'direct_message,direct_mention,mention', function(bot, message) {

    controller.storage.users.get(message.user, function(err, user) {
        if (user && user.id) {
            bot.reply(message, 'Your unity id is ' + user.uid);
        } else {
            bot.startConversation(message, function(err, convo) {
                if (!err) {
                    convo.say('I do not know you yet!');
                    convo.ask('What is your unity id?', function(response, convo) {
                        convo.ask('Please confirm if your unity id is `' + response.text + '`?', [
                            {
                                pattern: 'yes',
                                callback: function(response, convo) {
                                    // since no further messages are queued after this,
                                    // the conversation will end naturally with status == 'completed'
                                    convo.next();
                                }
                            },
                            {
                                pattern: 'no',
                                callback: function(response, convo) {
                                    // stop the conversation. this will cause it to end with status == 'stopped'
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
                            bot.reply(message, 'Alright! Hang on while I fetch your student info...');
                            getuser.get_the_user_info(convo.extractResponse('uid'))
                            controller.storage.users.get(message.user, function(err, user) {
                                if (!user) {
                                    user = {
                                        id: message.user,

                                    };
                                }
                                user.uid = convo.extractResponse('uid');
                                console.log(user)
                                controller.storage.users.save(user, function(err, id) {
                                    bot.reply(message, 'Got it');
                                });
                            });



                        } else {
                            // this happens if the conversation ended prematurely for some reason
                            bot.reply(message, 'OK, nevermind!');
                        }
                    });
                }
            });
        }
    });
});
// controller.hears('(.*)',    ['direct_message','direct_mention','mention'],function(bot,message) {
//     if (sessionMap[message.user] == undefined) {
//       sessionMap[message.user] = message.user;
//     }
//     var request = app.textRequest(message.text, {
//       sessionId: sessionMap[message.user]
//     });
//     request.on('response', function (response) {
//         console.log(response.result.action);
//         if (response.result.actionIncomplete) {

//             bot.reply(message, response.result.fulfillment.speech);
//         } else {
//             switch (response.result.action) {
//                 case 'addschedule':         
//                     //bot.reply(message, response.result.action.addschedule)
//                     // var uid = response.result.parameters.any;
//                     // console.log(uid)
//                     var options = {
//                             sessionId: '1'
//                         };

//                         var request = app.getContextsRequest(options);
//                     var requestSingle = app.getContextsRequest(options, 'addschedule');

//                     requestSingle.on('response', function(response) {
//                         console.log(response);
//                     });
//                     break;
//                 default:
//                     bot.reply(message, response.result.fulfillment.speech);
//             }
//         }
//     });

//     request.on('error', function (error) {
//         console.log(error);
//     });

//     request.end();
// });

controller.get_source_user = function(message) {
  return message.user;
}

controller.get_users = function (cb){
  request.post("https://slack.com/api/users.list", {form: {token: config.slack_token}}, function(err, resp, body){
    body = JSON.parse(body);
    users = {}
    for(var i in body.members) {
      member = body.members[i];
      users[member.id] = member;
    }
    cb && cb(users);
  });
}