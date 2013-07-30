var express = require('express');
var http = require('http');
var WiegandReader = require('./WiegandReader.js');
var exec = require('child_process').exec;
var DEBUG = true;
var Atea = function(){
	self = this;
	var webapi = express();
	webapi.use(express.bodyParser())
	wiegandReader = new WiegandReader();
	
    webapi.get('/', function(req, res){
		res.send('Atea WebAPI');
    });
	
	self.irekiAtea = function(){
		cmdIrekiAtea = exec('ireki-atea');
	}
	self.gotKey = function(key){
		if(DEBUG){
			console.log("on.gotKey " + key);
		}
		var getOptions = {
			path:"/atea?key=" + key
			,host:"192.168.1.33"
			,port:"9876"
			,agent:false
			
		}
		http.get(getOptions,function(res) {
		  if(res.statusCode == 200){
			 self.irekiAtea();
			 if(DEBUG){
				console.log("key: " + key + "OK");
			}
		  } else {
			if(DEBUG){
				console.log("status code:" + res.statusCode);
				console.log("key: " + key + "FAIL");
			}
		  }
		}).on('error', function(e) {
		  if(DEBUG){
		    console.log("Got error: " + e.message);
		  }
		});
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
	return self;
}

var atea = new Atea();
if(DEBUG)console.log("Start");


function findKey(key){
  output = false;
  db.findOne({key:key},function(err,doc){
  
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