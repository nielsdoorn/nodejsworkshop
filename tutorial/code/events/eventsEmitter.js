var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter();

// subscribe to an event
emitter.on('someImportantEvent', function() {
	// callback executed when event is emitted
	console.log("event fired");
});

// emitter is emitting the event...
emitter.emit('someImportantEvent');