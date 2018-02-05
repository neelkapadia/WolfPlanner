'use strict';
    var Botkit = require('botkit');
    var Slack = require('slack-node')
    var request = require('request')
    var apiai = require('apiai');
    var app = apiai('5ed306a83fad4a698fb89c289008b4fc');

    var slack = new Slack('xoxb-309781013429-JOZpX7qqwKPsZdkzHdzEITJV')
    var slackUsersList =[]
    var userIdNameMap = {}
var url = "https://api.api.ai/v1/"
    function getSlackUsers() {

      slack.api("users.list", function(error, response) {
        slackUsersList = response.members;
      });
      for(var i = 0 ; i < slackUsersList.length; i++) {
        var user = slackUsersList[i];
        userIdNameMap[user.id] = user.real_name
      }

    }

    var controller = Botkit.slackbot({
        debug: false
    });
var sessionMap = {}
    // connect the bot to a stream of messages
    controller.spawn({
       token: 'xoxb-309781013429-JOZpX7qqwKPsZdkzHdzEITJV',
    }).startRTM();

    controller.hears('(.*)',    ['direct_message','direct_mention','mention'],function(bot,message) {
        if (sessionMap[message.user] == undefined) {
          sessionMap[message.user] = message.user;
        }
        if(message.text.indexOf("<") > 1) {
            console.log("Initial:" + message.text)
            message.text = message.text.substring(0,message.text.indexOf("<"));
            console.log("Alert" + message.text)
          }
          var request = app.textRequest(message.text, {
          sessionId: sessionMap[message.user]
        });

        //bot.reply(message,'Hello Sai!');
        //getSlackUsers()
        var request = app.textRequest(message.text, {
      sessionId: sessionMap[message.user]
    });

    request.on('response', function (response) {
        // console.log(response);
        if (response.result.actionIncomplete) {

            bot.reply(message, response.result.fulfillment.speech);
        } else {

            switch (response.result.action) {

                case 'user.initiation':

                   if(userIdNameMap[message.user] == undefined) {
                     getSlackUsers()
                   }
                   bot.reply(message, "Hello, " + userIdNameMap[message.user])

                   break;

                case 'greeting.initial':
                    bot.reply(message, response.result.fulfillment.speech);
                    break;

                case 'user.reply':
                    bot.reply(message, response.result.fulfillment.speech);
                    break;

                // case 'find.cases.judge.last.name':
                //     var lastName = response.result.parameters.any;
                //     lastName = fixCase(lastName)
                //     search.searchJudgeByLastName(bot, message, response, lastName);
                //     //bot.reply(message, response.result.fulfillment.speech);
                //     break;

                // case 'find.cases.judge.first.last.name':
                //     var firstName = response.result.parameters.any;
                //     var lastName = response.result.parameters.any1;
                //     firstName = fixCase(firstName)
                //     lastName = fixCase(lastName)
                //     console.log("updated name:" + firstName)
                //     search.searchJudgeByFirstAndLastName(bot, message, response, firstName, lastName);
                //     break;
                 case 'bot.help':
                     bot.reply(message, possibleFunctions);
                     break;

                case 'action.exit':
                    bot.reply(message, response.result.fulfillment.speech);
                    sessionMap[message.user] = message.user;
                    deleteContextsForUser(message.user)
                    break;

                case 'conversation.end':
                    if(userIdNameMap[message.user] == undefined) {
                        getSlackUsers()
                    }
                     bot.reply(message, "Good Bye, " + userIdNameMap[message.user])

                    break;

                default:

                    bot.reply(message, response.result.fulfillment.speech);

            }
        }
    });

    request.on('error', function (error) {
        console.log(error);
    });

    request.end();
});