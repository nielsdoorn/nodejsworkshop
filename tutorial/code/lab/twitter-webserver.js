var http = require('http');
var static = require('node-static');
var sio = require('socket.io');
var twitter = require('ntwitter');

// http server
var port = process.env.PORT || 1337;
console.log('Server running on port '+port);

var file = new(static.Server)('./public', {
  cache: 0
});

var app = http.createServer(function(req, res) {
  file.serve(req, res);
}).listen(port);

// socket io
var io = sio.listen(app);

// twitter
var twit = new twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_TOKEN_SECRET
});

function queryTwitter(q) { 
  twit.stream('statuses/filter', {'track':q}, function(stream) {
    stream.on('data', function (data) {
      if (data != undefined && data.user != undefined) {
        io.sockets.emit('tweet', data.user.screen_name+' tweets: '+data.text);
      }
    });
  });
};

queryTwitter("train");
