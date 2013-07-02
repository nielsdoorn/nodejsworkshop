
var socket = io.connect();

socket.on('connect', function () {
  $('#status').text("connected");
  $('#status').removeClass("dis");
});

socket.on('disconnect', function () {
  $('#status').text("offline");
  $('#status').addClass("dis");
});

socket.on('tweet', function (tweet) {
  if ($('#tweets').children().length > 50) {
    $('#tweets li').last().remove();  
  }
  $('#tweets').prepend($("<li>").text(tweet));
});

socket.on('new search', function (q) {
  $('#currentsearch').text("monitoring: "+q);
  $('#q').val(q);
});

socket.on('error', function (error) {
  $('#status').text("error");
  $('#status').addClass("dis");
});

$(function () {
  $('#searchform').submit(function () {
    search($('#q').val());
    toggleControl();
    $('#q').val("");
    return false;
  });

  $('#tweetblock').append($('<ul id="tweets">'));

  $('#handle').on('click', function() {
    toggleControl();
  })
});

function search(q) {
  socket.emit('search', q);
}

function toggleControl() {
  $('#control').toggleClass('hidden');
}
