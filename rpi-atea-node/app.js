var express = require('express');
var WiegandReader = require('../WiegandReader.js');
var exec = require('child_process').exec;
var Datastore = require('nedb');

var DEBUG = true;

var Atea = function(){
	self = this;
	var webapi = express();
	webapi.use(express.bodyParser())
	wiegandReader = new WiegandReader();
	
	db = new Datastore({ filename: 'key.db', autoload: true });
	
    webapi.get('/', function(req, res){
		res.send('Atea WebAPI');
    });
	
	self.irekiAtea = function(){
		cmdIrekiAtea = exec('ireki-atea');
	}
	self.isValidKey = function(key){
	  output = false;
	  self.db.findOne({key:key},function(err,doc){
	  
		if(!doc){
			output =  false;
		} else {
		  console.log(doc);
		  output =  true;
		  return output;
		}
	  });
	  return output;
	 
	}
	self.gotKey = function(key){
		if(DEBUG){
			console.log("on.gotKey " + key);
		}
	
		if(!self.isValidKey(key)){
			if(DEBUG){
				console.log("key: " + key + "FAIL");
			}
			
		    
		} else {
			if(DEBUG){
				console.log("key: " + key + "OK");
			}
			self.irekiAtea();
		}
	}
	
	webapi.get('/ireki', function(req, res){
		self.irekiAtea();
		if(DEBUG){
			console.log("/ireki");
		}
		res.send(200);
    });
	self.webapi = webapi;
	self.webapi.listen(5000);
	if(DEBUG){
		console.log('Listening on port 5000');
	}
	
	wiegandReader.on('gotKey',self.gotKey);
	self.wiegandReader = wiegandReader;
	self.db = db;
	return self;
}

var atea = new Atea();
if(DEBUG)console.log("Start");
