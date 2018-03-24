var event = {
'summary': 'Trial Event',
'location': '800 Howard St., San Francisco, CA 94103',
'description': 'A chance to hear more about Google\'s developer products.',
'start': {
'dateTime': '2018-03-13T09:00:00-07:00',
'timeZone': 'America/Los_Angeles',
},
'end': {
'dateTime': '2018-03-13T13:45:00-07:00',
'timeZone': 'America/Los_Angeles',
},
'reminders': {
'useDefault': false,
'overrides': [
{'method': 'email', 'minutes': 24 * 60},
{'method': 'popup', 'minutes': 10},
],
},
};

var a = 1;
var str = "abc";
var dict = {
	'a':1,
	1:'A',
	'A':'A'
};

console.log(dict);

var try_var =
{
	'para1': a,
	'para2': str,
	'para3': dict
};


var try_var_2 =
{
	'1': dict,
	'2': dict
};

console.log(try_var);

trial = {};

console.log('para1' in try_var);
console.log(try_var['para3']);
console.log(Object.keys(try_var['para3']).length);
console.log(Object.keys(try_var['para3']));
console.log([].length)
console.log("Hello -", try_var['para1']);

console.log(try_var_2);
for(key in try_var_2){
console.log("Inside first for", key, try_var_2[key]);
	for(kk in key){
		console.log("Inside second for", kk, key[kk]);
	}
}

if('para1' in try_var){
	console.log("Testing presence of key in try_var");
}
else{
	console.log("Trial object is empty");
}

var str = "hi my name";
console.log(str.slice(0,-1));

var curr = new Date;
console.log(curr.toISOString());