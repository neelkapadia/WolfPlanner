require('dotenv').config();

const axios = require('axios');
const debug = require('debug')('botProject:src/slack_bot');
const qs = require('querystring');

var Botkit = require('botkit');

var os = require('os');


module.exports = {
  open_dialog: function(dialog,res) {
    axios.post('https://slack.com/api/dialog.open?', qs.stringify(dialog))
    .then((result) => {
      debug('dialog.open: %o', result.data);
      console.log("Dialog Opened sucessful");
      res.send('');
    }).catch((err) => {
      debug('dialog.open call failed: %o', err);
      res.sendStatus(500);
    });
  },

  send_message: function(channel_id,text,attachments){
    axios.post('https://slack.com/api/chat.postMessage', qs.stringify({
      token: process.env.slackToken,
      channel: channel_id,
      text: text,
      attachments : JSON.stringify(attachments),
    })).then((result) => {
      debug('sendConfirmation: %o', result.data);
    }).catch((err) => {
      debug('sendConfirmation error: %o', err);
      console.error(err);
    });
  }
}//end of module
