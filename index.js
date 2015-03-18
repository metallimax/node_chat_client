// ********** CHAT CLIENT **********

var socket = new WebSocket("ws://localhost:3000/");

socket.onopen = function() {
    //do something when connection estabilished
};

socket.onmessage = function(message) {
    //do something when message arrives
};

socket.onclose = function() {
    //do something when connection close
};
