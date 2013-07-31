var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter();

emitter.on('someImportantEvent', function() {
	console.log("event fired");
});

emitter.emit('someImportantEvent');