const User = require('../controllers/module/user.js');
module.exports = {
	parse_file: function(course, callback){
		//var day_date = JSON.stringify(dt);
		var options = {
  			args: [course]
		};

		var shell = require('python-shell')

		shell.run('scheduler/proj.py', options, function (err, results) {
  			if (err) console.log(err);
  			// console.log('results: %j', results);
			else callback(null, results);
		});
	}
}
