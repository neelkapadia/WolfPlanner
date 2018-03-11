module.exports = {
	call_python: function(unityId, buffer_time, day_date, callback){
		var spawn = require("child_process").spawn;
		var path = "temp.py";
		
		var str = 'python3 scheduler/scheduling.py ' + unityId + ' ' + day_date + ' ' + buffer_time;
		console.log(str);
		console.log("In call python");
		
		const { exec } = require('child_process');
		exec(str, (err, stdout, stderr) => {
			  if (err) {
			    // node couldn't execute the command
			    return;
			  }
			  // the *entire* stdout and stderr (buffered)
			  console.log(`stdout: ${stdout}`);
			  if(stderr != null)
				  console.log(`stderr: ${stderr}`);
			});

		// try{
		// 	var my_call = spawn("python3",[path, unityId, JSON.stringify(day_date), buffer_time]);
		// }
		// catch(err){
		// 	console.log(err);
		// 	return err;
		// }

		// my_call.stdout.on("data", function(data){
		// 	callback(null,data.toString());
		// });

		// my_call.stdout.on("error", function(err){
		// 	console.log(err);
		// 	return err;
		// });  + unityId + ' ' + day_date + ' ' + buffer_time
	}
}