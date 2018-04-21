var prompt = {
    attachments:[
        {
            title: "Which course do you want to parse?",
            callback_id: "course_parse_prompt",
            attachment_type: "default",
            actions: [
                {
                    "name": "CSC 510",
                    "text": "CSC 510",
                    "type": "button",
                    "value": "CSC 510"
                },
                {
                    "name": "CSC 520",
                    "text": "CSC 520",
                    "type": "button",
                    "value": "CSC 510"
                },
		{
                    "name": "CSC 530",
                    "text": "CSC 530",
                    "type": "button",
                    "value": "CSC 530"
                },
            ]
        }
    ]
}
module.exports= {course_parse: prompt};

