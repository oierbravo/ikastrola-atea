String.prototype.fulltrim=function(){return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g,'').replace(/\s+/g,' ');};
var spawn = require('child_process').spawn
var util = require('util');
var events = require('events');

var WiegandReader = function(){
	self = this;
	self.wiegandReader = spawn('ikastrola-wiegand');

	
    self.wiegandReader.stdout.on('data', function (data) {
		var dataTrimmed = String(data).fulltrim();
		console.log("wiegandReader.stdout " + dataTrimmed);
		self.emit('gotKey', dataTrimmed);
	});
	
	return self;
}

util.inherits(WiegandReader, events.EventEmitter);
module.exports = WiegandReader;