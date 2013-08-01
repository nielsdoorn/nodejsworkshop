var http = require('http');
var path = require('path');
var static = require('node-static');
var twitter = require('ntwitter');
var sio = require('socket.io');

var currentsearch = "ohm2013";

var twit = new twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_TOKEN_SECRET
});

// http server
var app = http.createServer(handler);
app.listen(1337);
var file = new static.Server('./public');
function handler(req, res) {
  file.serve(req, res);
}


// connect socket.io
io.sockets.on('connection', function (socket) {

  io.sockets.emit('new search', currentsearch);

  socket.on('search', function (q) {
    query(q);
    console.log("query "+q);
    io.sockets.emit('new search', q);
    currentsearch = q;
  });

});


var query = function(q) { 
  twit.stream('statuses/filter', {'track':q}, function(stream) {
    stream.on('data', function (data) {
      if (data != undefined && data.user != undefined) {
        io.sockets.emit('tweet', data.user.screen_name+' tweets: '+data.text);
      }
    });

    stream.on('error', function(error) {
      io.sockets.emit('error', error);
    });
  });
};