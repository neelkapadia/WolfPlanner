var request = require('request');
var cheerio = require('cheerio');
var myData = [];
var user = {}

var get_the_user_info = function(uid) {
	request('https://directory.ncsu.edu/directory/moreinfo.php?username='+uid, function(err, resp, html) {
	        if (!err){
	          const $ = cheerio.load(html);
	          $('.col-sm-6').each(function() {
				    myData.push($(this).text().trim().replace(/\r?\n|\r/g, ""))
				});
	          var temp = myData[1].split(":")
	          user.name = myData[0]
	          user.course = temp[1].trim()
	          user.email = temp[3].trim()
	          console.log(user)
	      }
	});
}
exports.get_the_user_info = get_the_user_info;