var http = require('http');
var path = require('path');
var static = require('node-static');
var sio = require('socket.io');

// http server
var app = http.createServer(handler);
app.listen(8080);

// static webserver
var file = new static.Server(path.join(__dirname, '.', 'public'));
function handler(req, res) {
  file.serve(req, res);
}

// socket I/O
var io = sio.listen(app);
io.sockets.on('connection', function (socket) {
  // user connected, send him the time
  var now = new Date().toDateString();
  io.sockets.emit('news', {hello: 'world', time: now});

  // handle incoming event
  socket.on('press', function (data) {
    console.log('user pressed a button:', data);
  });
});