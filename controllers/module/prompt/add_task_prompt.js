var prompt = {
    attachments:[
        {
            title: "Would you like to add a task?",
            callback_id: "add_task_prompt",
            attachment_type: "default",
            actions: [
                {
                    "name": "yes",
                    "text": "Yes",
                    "type": "button",
                    "value": "yes"
                },
                {
                    "name": "no",
                    "text": "No",
                    "type": "button",
                    "value": "no"
                }
            ]
        }
    ]
}
module.exports= {add_task_prompt: prompt};

