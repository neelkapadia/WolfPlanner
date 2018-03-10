var prompt = {
    attachments:[
        {
            title: "Would you like to add a course?",
            callback_id: "add_course_prompt",
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
module.exports= {add_course_prompt: prompt};
