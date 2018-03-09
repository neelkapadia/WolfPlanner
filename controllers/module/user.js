const configure = require('./config');
const action = require('../module/action');

var user_schema = new configure.schema({
    _id: 'string',
  name: 'string',
  email: 'string',
  slackId: 'string',
  tasks: 'array',
  fixedTasks: 'array',
  freeTime: 'array',
  scheduled: 'array',
}, {
  collection: 'student'
});
var user = configure.mongoose.model('user', user_schema);

module.exports = {
	fetch_user: function(user_id,callback){
	    user.findOne({slackId:user_id},function(err,user){
	      if(err){
	        console.log(err);
	        return err;
	      }
	      callback(null,user._id);
	    });
  	},
  	add_course: function(payload){
  		// console.log(payload)
  		var course = {}
  		var result = [];
  		var str = payload.submission.days
	    if(str.match(/(M|Monday|monday|m|mon)/g)){
	    	result.push('1');
	    }
	    if(str.match(/(T|Tuesday|tuesday|tues|tu|t)/g)){
	    	result.push('2');
	    }
	    if(str.match(/(W|Wed|wed|wednesday|Wednesday)/g)){
	    	result.push('3');
	    }
	    if(str.match(/(Th|Thursday|Thurs|thurs)/g)){
	    	result.push('4');
	    }
	    if(str.match(/(F|Friday|fri|Fri|friday)/g)){
	    	result.push('5');
	    }
	    if(str.match(/(Sa|Saturday|Sat|sat|saturday)/g)){
	    	result.push('6');
	    }
	    if(str.match(/(Su|Sunday|Sun|sun|sunday)/g)){
	    	result.push('7');
	    }
	    //var dt = new Date().toISOString().split("T")[0]
	    var dt = "0001-01-01"
	    var st = payload.submission.startTime
	    var en = payload.submission.endTime
	    var startTime = dt + " " + st[0] + st[1] + ":" + st[2] + st[3] + ":00"
	    var endTime = dt + " " + en[0] + en[1] + ":" + en[2] + en[3] + ":00"
		course = {
			name: payload.submission.name,
			startTime: startTime,
  			endTime: endTime,
  			_id: payload.submission._id,
  			days: result,
  		}
  		console.log(course)
  		console.log(payload.user.id)
  		user.findOneAndUpdate({
		      slackId: payload.user.id
		      // console.log(_id)
		    }, {
		      $push: {
		        fixedTasks: course
		      }
		    }, function(err, res) {
		      if (err) return err;
		      console.log(res);
		    });
  	},
  	fetch_courses: function(user_id,callback){
  		user.findOne({slackId:user_id}, function(err,user){
  			if(err){
  				console.log(err)
  				return err
  			}
  			callback(null,user.fixedTasks);
  		});
  	},
//<<<<<<< HEAD

  	add_task: function(payload){
  		var task = {}

  		task = {
  			name = payload.submission.tname,
  			type = payload.submission.type,
  			duration = payload.submission.duration,
            deadline = payload.submission.deadline,
  		}

  		user.findOneAndUpdate({
        slackId: payload.user.id
        } , {
        	$push: {
        		 Tasks: task

        	}
        }, function(err, res){
        	if (err) return err;
        	console.log(res);
  			});	
  	},

//=======
//>>>>>>> 8f3a175678e5c159ac9126905f69268f629a2604
  	fetch_tasks: function(user_id,callback){
  		user.findOne({slackId:user_id}, function(err,user){
  			if(err){
  				console.log(err)
  				return err
  			}
//<<<<<<< HEAD
  			callback(null,user.Tasks);
  		});
  	}
//=======
  			
//>>>>>>> 8f3a175678e5c159ac9126905f69268f629a2604
}