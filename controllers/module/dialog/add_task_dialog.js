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
	 { label: 'Gym/ Fitness', value:'Extracurricular'},
	 { label: 'Travel',value:'Travel'},
	 { label: 'Other', value: 'Other' },
		
      ],

	},
	{
        label:"Task Duration in hours",
        name: "duration",
        type: "text",
        placeholder: "10"

	},
{
		
	label:"Deadline",
       name: "deadline",
       type: "text",
       placeholder: "YYYY-MM-DD HH:MM:SS"
	},
	{
	label:"Priority",
        name: "priority",
        type: "text",
        placeholder: "(1-5)1 being highest"

	},

	],

}

module.exports= {add_task_dialog: dialog};
