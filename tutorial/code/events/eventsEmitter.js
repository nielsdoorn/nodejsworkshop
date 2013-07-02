var EventEmitter = require('events').EventEmitter;
var myEmmitter = new EventEmitter();

emitter.on('someImportantEvent', function() {
	console.log("event fired");
});

emitter.emit('someImportantEvent');