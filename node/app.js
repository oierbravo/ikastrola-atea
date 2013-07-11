// Type 3: Persistent datastore with automatic loading
var Datastore = require('nedb')
  , db = new Datastore({ filename: 'key.db', autoload: true });
  /*var document = { key: '2801a0e4c7',email:"oierbravo@gmail.com"};
  db.insert(document);*/
  var express = require('express');
var app = express();
app.use(express.bodyParser());

app.get('/arduino', function(req, res){
console.log('arduino get');
console.log(req.query.key);
//res.send(200);
key = req.query.key;
	if(key == "undefined"){
		console.log("NO KEY");
		res.send(404);
	}
	db.findOne({key:key},function(err,doc){
		if(!doc){
	    	console.log("FAIL");
			res.send(404);
		} else {
		  console.log("OK");
		  console.log(doc);
		  res.send(200);
		}
    });
});
app.post('/arduino', function(req, res){
console.log('arduino post');
console.log(req.body.key);
key = req.body.key;
	if(key == "undefined"){
		console.log("NO KEY");
		res.send(404);
	}
	db.findOne({key:key},function(err,doc){
		if(!doc){
	    	console.log("FAIL");
			res.send(404);
		} else {
		  console.log("OK");
		  console.log(doc);
		  res.send(200);
		}
    });
});
app.listen(9876);
console.log('Listening on port 9876');
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