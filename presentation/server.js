var http = require('http');
var static = require('node-static');
var file = new(static.Server)('./public', {
	cache: 0
});

http.createServer(function(request, response) {
  request.addListener('end', function () {
    file.serve(request, response);
  }).resume();
}).listen(8080);

console.log('listening on port 8080');