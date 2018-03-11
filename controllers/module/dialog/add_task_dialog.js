var dialog = {
	title: 'Please add your task',
	callback_id: 'add_task_dialog',
	submit_label: 'Submit',
	submit_label: 'Submit',
	elements: [
	{
		label:"Task Name",
        name: "name",
        type: "text",
        placeholder: "AI HW 1"

	},
	{
		label:"Task Type",
        name: "type",
        type: "select",
       options: [
         { label: 'HW', value: 'HW' },
         { label: 'Project', value: 'Project'},
         { label: 'Interview Prep', value: 'Interview Prep' },
         { label: 'On-campus job', value: 'On-campus job' },
         { label: 'Other', value: 'Other' },
      ],

	},
	{
		label:"Task Duration in hours",
        name: "duration",
        type: "number",
        placeholder: "10"

	},
{
		
	label:"Deadline",
       name: "deadline",
       type: "text",
       placeholder: "2018-05-07 12:00:00"
	},


	],

}

module.exports= {add_task_dialog: dialog};