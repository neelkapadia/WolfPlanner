
var env = require('node-env-file');
env(__dirname + '/.env');
if (!process.env.clientId || !process.env.clientSecret || !process.env.PORT) {
  console.log('Error: Specify clientId clientSecret and PORT in environment');
  usage_tip();
  process.exit(1);
}
var Botkit = require('botkit');
var debug = require('debug')('botkit:main');

var bot_options = {
    clientId: process.env.clientId,
    clientSecret: process.env.clientSecret,
    // debug: true,
    scopes: ['bot']
};

bot_options.json_file_store = __dirname + '/.data/db/';

var controller = Botkit.slackbot(bot_options);

controller.startTicking();


module.exports = {
  handle: function (req,res) {
    var payload = JSON.parse(req.body.payload);
    var callback_id = payload.callback_id;
    const token = payload.token;
    const trigger_id = payload.trigger_id;
    if (token === process.env.SLACK_VERIFICATION_TOKEN)
    {

       if (callback_id == 'add_courses_prompt')
        {
            const dialog =
            {
                token: process.env.SLACK_ACCESS_TOKEN,
                trigger_id,
                dialog: JSON.stringify(dialogs.add_courses_dialog),
            }
            // open the dialog by calling dialogs.open method and sending the payload
            action.open_dialog(dialog, res);
        } 
        else
        {
            console.log('Reached Else');
            console.log(payload);
        }
    }
    else
    {

        debug('Verification token mismatch');
        console.log('Failed Here');
        res.sendStatus(403);
    }
  }
}


