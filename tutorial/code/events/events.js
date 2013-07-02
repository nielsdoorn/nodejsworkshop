var http = require('http');

var server = http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World!\n');
}).listen(1337, '127.0.0.1');


// subscribe to a certain event
server.on('connection', function (stream) {
  console.log('someone connected to our server!');
});