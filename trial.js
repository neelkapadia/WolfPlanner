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
1:2,
'a':1,
1:'A',
'A':'A'}

var try_var =
{
	'para1': a,
	'para2': str,
	'para3': dict
};

console.log(try_var);