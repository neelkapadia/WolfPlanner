const User = require('../controllers/module/user.js');
module.exports = {
	call_python: function(unityId, buffer_time, dt, callback){
		var day_date = JSON.stringify(dt);
		var options = {
  			args: [unityId, day_date, buffer_time]
		};

		var shell = require('python-shell')

		shell.run('scheduler/core_scheduler.py', options, function (err, results) {
  			if (err) console.log(err);
  			// console.log('results: %j', results);
			
		User.fetch_schedule(unityId, function(err,user){
	        if(err){
	            console.log(err);
	            return err
	        }
	        if(typeof user.schedule[0] === "undefined"){
	        	var p = []
	        }
	        else{
	        	var p = user.schedule[0];
	        }
	        
	        var scheduled = [];
	        var dict = {"1":"Monday","2":"Tuesday","3":"Wednesday","4":"Thursday","5":"Friday","6":"Saturday","7":"Sunday"}
	        for(i=1;i<=Object.keys(p).length;i++){
	            var fields = [];
	            for (j=0;j<p[i].length;j++) {
	                fields.push({
	                    title: p[i][j][2],
	                    value: "From: "+p[i][j][0].toISOString().split('T')[1].substr(0,5)+"\nTo: "+p[i][j][1].toISOString().split('T')[1].substr(0,5)
	                });

	            }
	            scheduled.push({
	                        text: dict[i]+" "+dt[i],
	                        attachments: [
	                            {
	                                fields: fields
	                            }
	                        ]
	                    });
	        }
	        console.log('results: %j', scheduled);
	        callback(null,scheduled)
	    });
	    });
	}
}