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
		label:"Deadline Year",
        name: "deadlineYear",
        type: "select",
        options: [
        { label: '2020', value: '2020'},
        { label: '2019', value: '2019'},
        { label: '2018', value: '2018'},

        ],
        placeholder:"2018"
	},

	{
		label: "Deadline Month",
        name: "deadlineMonth",
        type: "select",
        options: [
        { label: '01', value: '01'},
        { label: '02', value: '02'},
        { label: '03', value: '03'},
        { label: '04', value: '04'},
        { label: '05', value: '05'},
        { label: '06', value: '06'},       
        { label: '07', value: '07'},
        { label: '08', value: '08'},
        { label: '09', value: '09'},
        { label: '10', value: '10'},
        { label: '11', value: '11'},
        { label: '12', value: '12'},
        ],
        placeholder:"01"
	},
    {
    	label: "Deadline Day",
        name: "deadlineDay",
        type: "select",
        options: [
        { label: '01', value: '01'},
        { label: '02', value: '02'},
        { label: '03', value: '03'},
        { label: '04', value: '04'},
        { label: '05', value: '05'},
        { label: '06', value: '06'},       
        { label: '07', value: '07'},
        { label: '08', value: '08'},
        { label: '09', value: '09'},
        { label: '10', value: '10'},
        { label: '11', value: '11'},
        { label: '12', value: '12'},
        { label: '13', value: '13'},
        { label: '14', value: '14'},
        { label: '15', value: '15'},
        { label: '16', value: '16'},
        { label: '17', value: '17'},
        { label: '18', value: '18'},        
        { label: '19', value: '19'},
        { label: '20', value: '20'},
        { label: '21', value: '21'},
        { label: '22', value: '22'},
        { label: '23', value: '23'},
        { label: '24', value: '24'},
        { label: '25', value: '25'},
        { label: '26', value: '26'},
        { label: '27', value: '27'},
        { label: '28', value: '28'},
        { label: '29', value: '29'},        
        { label: '30', value: '30'},
        { label: '31', value: '31'},
      
        ],
        placeholder:"01"
	},	
      
      {
      	label: "Deadline Time",
      	name: "deadlineTime",
      	type: "text",
      	placeholder:"2345",
      	min_length: "4", 
        max_length: "4"

      },

	]

}

module.exports= {add_task_dialog: dialog};
