module.exports = {
	call_python: function(unityId, buffer_time, day_date, callback){
		var spawn = require("child_process").spawn;
		var path = "../scheduler/temp.py";
		console.log("In call python");
		const { exec } = require('child_process');
		exec('python3 temp.py ', (err, stdout, stderr) => {
			  if (err) {
			    // node couldn't execute the command
			    return;
			  }
			  // the *entire* stdout and stderr (buffered)
			  console.log(`stdout: ${stdout}`);
			  console.log(`stderr: ${stderr}`);
			});

		try{
			var my_call = spawn("python3",[path, unityId, JSON.stringify(day_date), buffer_time]);
		}
		catch(err){
			console.log(err);
			return err;
		}

		my_call.stdout.on("data", function(data){
			callback(null,data.toString());
		});

		my_call.stdout.on("error", function(err){
			console.log(err);
			return err;
		});  + unityId + ' ' + day_date + ' ' + buffer_time
	}
}