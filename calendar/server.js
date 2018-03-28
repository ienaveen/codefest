var http = require('http');
var express =require ('express')
var app = new express();
var url = require('url');
var fs = require('fs');
var path = require ('path');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
// var twilio = require('twilio');
var server;var mdsok;
var i=-1;
var file_path 


app.get('/', function(request, response){
	//console.log(path.join(__dirname,'angular-calendar.html'));
    response.sendfile(path.join(__dirname, 'views' ,'index.html'));
});
app.use(express.static('public'));
app.use(express.static('views'));

var server = http.createServer(app);
server.listen(3000)
var io = require('socket.io').listen(server);
console.log("Running at Port 3000");
 // Set up the connection to the local db
 //var mongoclient = new MongoClient(new Server("localhost", 27017), {native_parser: true});

MongoClient.connect('mongodb://10.22.136.123:27017/hack', function(err1, client) {

     var db = client.db('hack');
	io.sockets.on('connection', function(socket){
    	//send data to client 
    	console.log("into connect");               
        mdsok = socket;
        if(err1) { throw err1; }
 
 
       console.log("into req/");
	    //if no error get reference to colelction named: 'notifications'
	    socket.on('requestInit', function(){
	    	console.log('into req init')
			db.collection('notifications').find().toArray(function(err,message){
			       console.log("socket"+mdsok);
			       console.log('before emit'+ message)
			       mdsok.volatile.emit('home',message);
			});
		})
		db.collection('notifications', function(err, collection){
			if(err) { throw err; }
			// if no error apply a find() and get reference to doc
			collection.find().sort({ $natural:-1 }).limit(1).next(function(err, doc) {
				if(err) { throw err; }
				console.log("message"+doc._id);
				// using tailable cursor get reference to our very first doc
				var query = { _id: { $gt:new ObjectId(doc._id) } }; 
				 var options = { tailable: true, awaitdata: true, numberOfRetries: -1 };
				 var cursor = collection.find(query, options);				 
				// This function will take cursor to next doc from current as soon as 'notifications' database is updated
				function next() {
				     
				 cursor.next(function(err, message) {
				      if( message != null)
				      {
						if (err)
						  {throw err;}
						console.log("into print"+message + mdsok);
						io.sockets.emit('add',message);
						 next();
					  }
				})
			}
			next();
			});
		});
	});
});
					  

