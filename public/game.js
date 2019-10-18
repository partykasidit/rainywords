//DOM
alert('JS file connected!');
var socket = io.connect('http://localhost:4000');

socket.emit('new_player','test');