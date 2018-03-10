const dialogs = require('./dialog.js');
const prompts = require('./prompt.js');
const action = require('./action');
const User = require('./user');

module.exports = {
  handle: function (req,res) {
    var payload = JSON.parse(req.body.payload);
    var callback_id = payload.callback_id;
    const token = payload.token;
    const trigger_id = payload.trigger_id;
    // var value = JSON.parse(payload.action)
    if (token === process.env.SLACK_VERIFICATION_TOKEN)
    {
        //onsole.log(payload.actions[0].value)
        if (callback_id == 'add_course_prompt' ){
            if(payload.actions[0].value == 'yes'){
                console.log("I am here!!!!")
                const dialog =
                {
                    token: process.env.slackToken,
                    trigger_id,
                    dialog: JSON.stringify(dialogs.add_course_dialog),
                }
                action.open_dialog(dialog, res);
            }
            else{
                action.send_message(payload.channel.id, 'Alrighty boy!', []);
            }
        } 
        else if (callback_id == 'add_course_dialog')
        {
            User.add_course(payload)
            action.send_message(payload.channel.id, payload.submission.name + " has been added", []);
            res.send('');

        }

           else if (callback_id == 'add_task_prompt'){
            if(payload.actions[0].value == 'yes'){
                const dialog =
                {
                    token: process.env.slackToken,
                    trigger_id,
                    dialog: JSON.stringify(dialogs.add_task_dialog),

                }
                action.open_dialog(dialog,res)
            }
            else
            {
                action.send_message(payload.channel.id, 'Okay fine', []);
            }
        }

        else if (callback_id == 'add_task_dialog')
        {
            User.add_task(payload)
            console.log(payload)
            action.send_message(payload.channel.id, payload.submission.name + " has been added", []);
            res.send('');
        }
        
        else{
            console.log('Reached idhar');
        }
    }
    else{

        debug('Verification token mismatch');
        console.log('Failed Here');
        res.sendStatus(403);
    }
  }
}
