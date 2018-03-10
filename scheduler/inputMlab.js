//console.log("Hi Rohan")

// var http = require("http");

// http.createServer(function(request,response){
// 	response.end("Hello World\n");

// }).listen(8081)

// console.log('Server running');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://rtrgntsg:menzies@ds231758.mlab.com:31758";
var dateFormat = require('dateformat');
var now = new Date();

var add_entry = function(myobj){
MongoClient.connect(url, function(err, db) {
 if (err) throw err;
 var dbo = db.db("se");
 //Find the first document in the customers collection:
 // var myobj = { _id: 200206862, name: "Rohan Chandavarkar", tasks: [{name: 'STDM HW1',type: 'HW', duration:6,deadline: now},
 //  {name: 'AI HW1',type: 'HW', duration:5 ,deadline: now} ], fixedTasks:[ 
 //  				{
 //                    'name': "SE",
 //                    '_id': "CSC510",
 //                    'startTime': now,
 //                    'endTime': now,
 //                    'days': [2, 4]
 //                },
 //                {
 //                    'name': "DBMS",
 //                    '_id': "CSC540",
 //                    'startTime': now,
 //                    'endTime': now,
 //                    'days': [1, 3]
 //                },
 //                {
 //                    'name': "STDM",
 //                    '_id': "CSC591-013",
 //                    'startTime': now,
 //                    'endTime': now,
 //                    'days': [1,3]
 //                } ]	};
//  dbo.collection("student").find({}).toArray(function(err, result) {
//    if (err) throw err;
//    console.log(result[0]._id);
//    db.close();
//  });

dbo.collection("student").insertOne(myobj, function(err, res) {
   if (err) throw err;
   console.log("1 document inserted");
 });
/*

dbo.student.insert(
        {
            '_id': 200199811,
            'name': "Neel Kapadia",
            'tasks': [
                {
                    'name': 'STDM HW 1',
                    'type': 'HW',
                    'duration': 6,
                    'deadline': now,
                    'number': 1
                },
                {
                    'name': 'DBMS HW 1',
                    'type': 'HW',
                    'duration': 4,
                    'deadline': now,
                    'number': 1
                }
            ],
            'fixedTasks': [
                {
                    'name': "SE",
                    '_id': "CSC510",
                    'startTime': now,
                    'endTime': now,
                    'days': ["tuesday", "thursday"]
                },
                {
                    'name': "DBMS",
                    '_id': "CSC540",
                    'startTime': now,
                    'endTime': now,
                    'days': ["monday", "wednesday"]
                },
                {
                    'name': "STDM",
                    '_id': "CSC591-013",
                    'startTime': now,
                    'endTime': now,
                    'days': ["monday", "wednesday"]
                }
            ]
        }
    )*/
db.close()
});
}



// var add_new_user = function(myobj) {
//     MongoClient.connect(url, function(err, db) {
//         if (err) throw err;
//         var dbo = db.db("SE");
//         dbo.collection("student").insertOne(myobj, function(err, res) {
//             if (err) throw err;
//             console.log("1 document inserted");
//         });
//         db.close()
//     });
// }