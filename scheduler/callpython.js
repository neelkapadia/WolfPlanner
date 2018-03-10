//var path = "testNodeJS.py";
var path = "scheduling.py";
var spawn = require("child_process").spawn;
var n1 = 2;
var n2 = 15;

// Login details
var unityId = "sgshetty";
var slackId = "U90JUGPU1";
var email = "sgshetty@ncsu.edu";
var name = "Sainag Ganesh Shetty";

// dummy day_date variable for testing (till input received from bot)
var day_date = {
	"1": "2018-03-05 20:30:00",
	"2": "2018-03-06 20:30:00",
	"3": "2018-03-07 20:30:00",
	"4": "2018-03-08 20:30:00",
	"5": "2018-03-09 20:30:00",
	"6": "2018-03-10 20:30:00",
	"7": "2018-03-11 20:30:00"
};

//Assumed to be in minutes (logically)
var buffer_time = 15;

var data = [unityId, slackId, email, name];

console.log("hii");
try{
//var pythonProcess = spawn("python",[path, n1, n2, JSON.stringify(day_date)]);
var pythonProcess = spawn("python",[path, unityId, slackId, email, name, JSON.stringify(day_date), buffer_time]);
//var pythonProcess = spawn("python",[path, JSON.stringify(data), JSON.stringify(day_date), buffer_time]);
}
catch(err){
	console.log(err)
}
console.log("byee");

pythonProcess.stdout.on("data", function(data){
	console.log(data.toString())
});

pythonProcess.stdout.on("error", function(err){
	console.log(err.toString())
});