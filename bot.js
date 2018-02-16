'use strict';
var Botkit = require('botkit');
var Slack = require('slack-node')
var request = require('request')
var apiai = require('apiai');
var app = apiai('5ed306a83fad4a698fb89c289008b4fc');
var config = require('./config.js');

var slackUsersList =[]
var userIdNameMap = {}
var user = {}
var url = "https://api.api.ai/v1/"

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
    console.log(source_user);
    console.log(message);
    bot.reply(message, "hi");
});
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
        console.log(response.result.action);
        if (response.result.actionIncomplete) {

            bot.reply(message, response.result.fulfillment.speech);
        } else {
            switch (response.result.action) {
                case 'addschedule':         
                    bot.reply(message, response.result.action.addschedule)
                    // var sid = response.result.parameters.any;
                    // console.log(sid)
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