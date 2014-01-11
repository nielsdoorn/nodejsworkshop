var http = require('http');
var static = require('node-static');

// http server
var app = http.createServer(handler);
app.listen(1337);

// create static content server with cache disabled
var file = new(static.Server)('./public', {
  cache: 0
});

function handler(req, res) {
  file.serve(req, res);
}