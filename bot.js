'use strict';
    var Botkit = require('botkit');
    var Slack = require('slack-node')
    var request = require('request')

    var slack = new Slack('xoxb-309781013429-JOZpX7qqwKPsZdkzHdzEITJV')
    var slackUsersList =[]
    var userIdNameMap = {}

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

    // connect the bot to a stream of messages
    controller.spawn({
       token: 'xoxb-309781013429-JOZpX7qqwKPsZdkzHdzEITJV',
    }).startRTM();

    controller.hears('hello',    ['direct_message','direct_mention','mention'],function(bot,message) {
        //bot.reply(message,'Hello Sai!');
        //getSlackUsers()
        bot.reply(message,message.user);
    });
    controller.hears(['.*'], ['direct_message', 'direct_mention'], (bot, message) => {
            controller.log(message.data);
            bot.reply(message, 'I have received your message!')
        });