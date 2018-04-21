var dialog = {
	title: 'Parse Course',
	callback_id: 'course_parse_dialog',
	submit_label: 'Submit',
	submit_label: 'Submit',
	elements: [
	{
	label:"Yes",
        name: "Yes",
        type: "text",
        //placeholder: "AI HW 1"

	},
	{
		label:"No",
        name: "No",
        type: "text",
       //options: [
         //{ label: 'HW', value: 'HW' },
         //{ label: 'Project', value: 'Project'},
         //{ label: 'Interview Prep', value: 'Interview Prep' },
         //{ label: 'On-campus job', value: 'On-campus job' },
         //{ label: 'Other', value: 'Other' },
      //],

	},
	/*{
		label:"Task Duration in hours",
        name: "duration",
        type: "text",
        placeholder: "10"

	},
{
		
	label:"Deadline",
       name: "deadline",
       type: "text",
       placeholder: "2018-05-07 12:00:00"
	},
	{
	label:"Priority",
        name: "priority",
        type: "text",
        placeholder: "1 being highest"

	},*/

	],

}

module.exports= {course_parse_dialog: dialog};
