var dialog = {
  title: 'Please add your course',
  callback_id: 'add_course_dialog',
  submit_label: 'Submit',
  submit_label: 'Submit',
  elements: [
    {
    label: "Course No.",
    name: "_id",
    type: "text",
    placeholder: "CSC510"
  },
  {
    label: "Course Name",
    name: "name",
    type: "text",
    placeholder: "Software Engineering"
  }, 
  {
    label:"Priority",
    name: "priority",
    type: "text",
    placeholder: "1 being highest"
  },
  {
    label: "Days",
    name: "days",
    type: "text",
    placeholder: "M,T,W,Th,F"
  }, 
  {
    label: "Time(Start)",
    name: "startTime",
    type: "text",
    placeholder: "1800",
    min_length: "4", 
    max_length: "4"
  },  
  {
    label: "Time(End)",
    name: "endTime",
    type: "text",
    placeholder: "1915",
    min_length: "4", 
    max_length: "4"
  }, 
    // {
    //   label: 'Day(1)',
    //   type: 'select',
    //   name: 'day1',
    //   options: [
    //     { label: 'Monday', value: '1' },
    //     { label: 'Tuesday', value: '2' },
    //     { label: 'Wednesday', value: '3' },
    //     { label: 'Thursday', value: '4' },
    //     { label: 'Friday', value: '5' },
    //   ],
    // },
    // {
    //   label: 'Day(2)',
    //   type: 'select',
    //   name: 'day2',
    //   options: [
    //     { label: 'Monday', value: '1' },
    //     { label: 'Tuesday', value: '2' },
    //     { label: 'Wednesday', value: '3' },
    //     { label: 'Thursday', value: '4' },
    //     { label: 'Friday', value: '5' },
    //   ],
    // },
    // {
    //   label: 'Day(3)',
    //   type: 'select',
    //   name: 'day3',
    //   optional: 'true',
    //   options: [
    //     { label: 'Monday', value: '1' },
    //     { label: 'Tuesday', value: '2' },
    //     { label: 'Wednesday', value: '3' },
    //     { label: 'Thursday', value: '4' },
    //     { label: 'Friday', value: '5' },
    //   ],
    // },
  ],
}

module.exports= {add_course_dialog: dialog};
