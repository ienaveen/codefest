var http = require('http');
var express =require ('express')
var app = new express();
var url = require('url');
var fs = require('fs');
var path = require ('path');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var bodyParser = require('body-parser');
var util = require('util');
// var twilio = require('twilio');
var server;var mdsok;

//Express initi code 
app.use(express.static('public'));
app.use(express.static('views'));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
var server = http.createServer(app);
server.listen(3000)
var io = require('socket.io').listen(server);
console.log("Running at Port 3000");
//End of Express initi code  

MongoClient.connect('mongodb://10.22.136.123:27017/hack', function(err1, client) {
     var db = client.db('hack');

    //routes 
    app.get('/coc/cdps', function(request, response){
    	console.log('into /coc/cdps')
    	db.collection('cdps').find().toArray(function(err,cdps){
			// console.log("/coc/cdps"+cdps);
			response.send(cdps)  
			});   	
	});
	app.post('/coc/cdps', function(request, response){
    	console.log('into post /coc/cdps'+ util.inspect(request.body))
    	db.collection('cdps').insertOne(request.body,function(err,cdps){
			console.log("/coc/cdps"+cdps);
			response.send(cdps)  
			});   	
	});
    app.get('/', function(request, response){
    	response.sendfile(path.join(__dirname, 'views' ,'index.html'));
	});

    //end of routes 

    //socket.io connection 
	io.sockets.on('connection', function(socket){
    	//send data to client 
    	console.log("into connect");               
        mdsok = socket;
        if(err1) { throw err1; }
       console.log("into req/");
	    // 'notifications' initial emit 
	    socket.on('requestInit', function(){
	    	console.log('into req init')
			db.collection('notifications').find().toArray(function(err,message){
			       console.log("socket"+mdsok);
			       console.log('before emit'+ message)
			       mdsok.volatile.emit('home',message);
			});
		})
		//notifications push notification 		
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
		//notifications push notification end 
	});
    //end of socket.io connection
});
//end of mongoclient connection
					  

