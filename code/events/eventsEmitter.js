var EventEmitter = require('events').EventEmitter;
var obj = new EventEmitter();

obj.on('customEvent', function() {
	console.log("custom event fired");
});

obj.emit('customEvent');