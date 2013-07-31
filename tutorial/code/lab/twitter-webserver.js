var http = require('http');
var static = require('node-static');

// http server
var app = http.createServer(handler);
app.listen(1337);
var file = new static.Server('./public');
function handler(req, res) {
  file.serve(req, res);
}

var twitter = require('ntwitter');

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
        console.log('tweet', data.user.screen_name+' tweets: '+data.text);
      }
    });

    stream.on('error', function(error) {
      console.log('error', error);
    });
  });
};

queryTwitter("playing");