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
	
	db = new Datastore({ filename: '/home/pi/node-atea/stand-alone/key.db', autoload: true });
	
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
		//We search for a document containing the key
		db.findOne({key:key},function(err,doc){
				
			console.log(doc);
			if(doc === null){
				if(DEBUG){
					console.log("key: " + key + "FAIL");
				}
			} else {
				if(DEBUG){
					console.log("key: " + key + "OK");
					console.log(doc);
				}
			//Open the door
			self.irekiAtea();
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
	self.webapi.listen(5001);
	if(DEBUG){
		console.log('Listening on port 5000');
	}
	
	wiegandReader.on('gotKey',self.gotKey);
	self.wiegandReader = wiegandReader;
	self.db = db;
	
	//TODO: SOLO MIENTRAS NO TENGAMOS INDICADORES
	//activamos el rele.
	exec('ireki-atea');
	return self;
}

var atea = new Atea();
if(DEBUG)console.log("Start");
