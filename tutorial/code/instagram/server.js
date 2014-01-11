var http = require('http');
var static = require('node-static');
var sio = require('socket.io');
var os = require('os');
var url = require("url");
var instagram = require('instagram-node-lib');
var file = new(static.Server)('./public');

var port = process.env.PORT || 1337;
var callbackUrl = process.env.CALLBACK_URL;

var history = new Array();

var app = http.createServer(function(req, res) {
	var uri = url.parse(req.url).pathname;
	if (req.method === 'POST' && uri === '/instagram') {
		handlePostToCallbackUrl(req, res);
	} else if (uri === '/instagram') {
		instagram.subscriptions.handshake(req, res);
	} else {
		file.serve(req, res);
	}
}).listen(port);

app.on('listening', function() {
	setTimeout(subscribe, 5000);
});

var io = sio.listen(app);

io.configure(function () { 
	io.set("transports", ["xhr-polling"]); // for heroku, leave out if your host suppors websockets
	io.set("polling duration", 10);  // for heroku leave, out if your host suppors websockets
	io.set('log level', 1);
});

io.sockets.on('connection', function (socket) {
	console.log("new connection from client");
});

function subscribe() {
	instagram.set('client_id', process.env.INSTA_CLIENT_ID);
	instagram.set('client_secret', process.env.INSTA_CLIENT_SECRET);
	instagram.set('callback_url', callbackUrl);
	instagram.subscriptions.unsubscribe_all([]);
	instagram.subscriptions.subscribe({verify_token: 'geo_adam', object: 'geography', aspect: 'media', lat: 52.37518, lng: 4.897842, radius: 5000 }); // amsterdam 52.37518,4.897842
}

function handlePostToCallbackUrl(req, res) {
	var message = '';
	req.on('data', function(chunk) {
		message += chunk.toString();
	});
	req.on('end', function() {
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.end('post received');
		var notifications = JSON.parse(message);
		handleNotifications(notifications);
	});
}

function handleNotifications(notifications) {
	notifications.forEach(function(notification) {
		queryInstagramForNewPictures(notification);
	});
}

function queryInstagramForNewPictures(notification) {
	instagram.geographies.recent({ 
		geography_id: notification.object_id,
		complete: function(pictures) {
			handlePictures(pictures)
		}
	});
}

function handlePictures(pictures) {
	pictures.forEach(function(picture) {
		if (isNew(picture)) {
			emmitNewPictureEvent(picture);
			addPictureToHistory(picture);
		}
	});
}

function isNew(picture) {
	return history.indexOf(picture.images.thumbnail.url) === -1;
}

function emmitNewPictureEvent(picture) {
	io.sockets.emit('newpicture', picture);
}

function addPictureToHistory(picture) {
	history.push(picture.images.thumbnail.url);
}
