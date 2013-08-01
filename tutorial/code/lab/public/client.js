var socket = io.connect();

var tweetList;
window.onload = function() {
	tweetList = document.createElement('ul');
	document.body.appendChild(tweetList);
}

socket.on('tweet', function (tweet) {
	var tweetListItem = document.createElement('li');
	tweetListItem.innerHTML = tweet;
	tweetList.insertBefore(tweetListItem, tweetList.firstChild);
});

