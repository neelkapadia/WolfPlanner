var path = "testNode.py"
var spawn = require("child_process").spawn;
var n1 = 2;
var n2 = 15
console.log('hii')
var pythonProcess = spawn('python',[path, n1, n2]);
console.log('byee')
pythonProcess.stdout.on('data', function(data){
	console.log(data.toString())
});