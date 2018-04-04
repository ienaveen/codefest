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
// var JSON = require('JSON');
var twilio = require('twilio');

var server;var mdsok;
//twilio
var accountSid = 'AC5bed0ddce8ebb91d092dd8daf56f1ba0'; // Your Account SID from www.twilio.com/console
var authToken = 'e657dada59d54191e91828305736c0cc';   // Your Auth Token from www.twilio.com/console
var client = new twilio(accountSid, authToken);
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

var parseResponse = function(cdps){
	var obj = cdps;
	var total_page_visits =0,js_errors = 0,api_errors = 0 ;
	var graph_page_visit = {"NETWORKS":0,
                    "APS":0,
                    "RF":0,
                    "IDS/IPS":0,
                    "SECURITY":0,
                    "SYSTEM":0,
                    "VPN":0,
                    "DHCP":0,
                    "SERVICES":0,
                    "SYSTEM":0
                    }
    if (obj && obj.ui_details){
		for (var i = 0 ;i< obj.ui_details.users.length; i++){
			for (var j = 0 ;j< obj.ui_details.users[i].pages.length; j++){
				graph_page_visit[obj.ui_details.users[i].pages[j].page_name] = graph_page_visit[obj.ui_details.users[i].pages[j].page_name] + obj.ui_details.users[i].pages[j].visited_count
	            total_page_visits = total_page_visits + obj.ui_details.users[i].pages[j].visited_count;
	            if (obj.ui_details.users[i].pages[j].js_exceptions)
	            js_errors = js_errors + obj.ui_details.users[i].pages[j].js_exceptions.length;
	            if (obj.ui_details.users[i].pages[j].api_exceptions)
	            	api_errors = api_errors + obj.ui_details.users[i].pages[j].api_exceptions.length;
			}
		}
		var banner = {"active_users":obj.ui_details.active_users, "total_page_visits":total_page_visits,"js_errors":js_errors,"api_errors":api_errors}
		//console.log('banner'+ banner)
		console.log('graph_page_visit'+ graph_page_visit)
		cdps.banner_info = banner;
		cdps.graph_page_visit = graph_page_visit;
	}
	return cdps;
}
var send_sms = function (obj){
	console.log('into send sms');
	client.messages.create({
    body: 'An Exception has occurred in '+ obj,
    to: '+919848461918',  // Text this number
    from: '+12177335076' // From a valid Twilio number
	})
	.then(function(message)
		{   console.log('nav')
		console.log(message.sid)
		});
	// client.calls.create({
 //    	url: "http://twimlets.com/echo?Twiml=%3CResponse%3E%3CSay%20voice=%27alice%27%3E%20Welcome%20to%20HACK FEST%20a%20new%20exception%20was%20just%20added%20was%20encountered%20please%20check%20it%20or%20view%20your%20messages%20for%20more%20details%20thanks%20for%20listening%20from%20naveen%20and%20pavan%3C/Say%3E%3C/Response%3E",
 //    	to: '+919848461918',  // Text this number
 //    	from: '+12177335076' // From a valid Twilio number
 //  })
	// .then(function(message)
	// 	{   console.log('nav')
	// 	console.log(message.sid)
	// 	});

}

// var obj
// send_sms(obj)


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
	app.get('/coc/cdps/:cdpId', function(request, response){
    	console.log('into /coc/cdps/cdpid')
    	var query = {cdp_id: request.params.cdpId};
    	db.collection('cdps').find(query).toArray(function(err,cdps){
    		var cdps_fn = parseResponse(cdps[0])
    		cdps[0] = cdps_fn
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
						var cdps_fn = parseResponse(message)
						/*
						if (cdps_fn.ui_details.users[0].pages[0].page_name)
							send_sms(cdps_fn.ui_details.users[0].pages[0].page_name)
						else
							send_sms("Networks")
						*/
						io.sockets.emit('add',cdps_fn);
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


