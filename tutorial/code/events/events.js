var http = require('http');
var app = http.createServer(handler);
app.listen(1337);
function handler(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World!\n');
}


// subscribe to a certain event
app.on('connection', function (stream) {
  console.log('someone connected to our server!');
});