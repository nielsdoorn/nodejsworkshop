var socket = io.connect();

socket.on('connect', function() {
  document.getElementById('connected').innerHTML = 'connected';
});

socket.on('disconnect', function() {
  document.getElementById('connected').innerHTML = 'offline';
});

socket.on('news', function(data) {
  console.log('hello', data.hello);
  console.log('it is now', data.time);
});

window.onload = function(e) {
  console.log('loaded');
  document.getElementById('button').onclick = function() {
    console.log('pressed...');
    socket.emit('press', 'yes I pressed the button');
  }
}
