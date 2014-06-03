var http = require('http');
var path = require('path');
var static = require('node-static');

// http server
var app = http.createServer(handler);

// socket I/O
var io = require('socket.io')(app);

app.listen(1337);

var file = new static.Server('./public');
function handler(req, res) {
  file.serve(req, res);
}

io.on('connection', function (socket) {
  // user connected, send him the time
  var now = new Date().toDateString();
  io.emit('news', {hello: 'world', time: now});

  // handle incoming event
  socket.on('press', function (data) {
    console.log('user pressed a button:', data);
  });
});
