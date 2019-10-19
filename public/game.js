//DOM
var nameSpan = document.getElementById('my_span');

//Set username
var parameters = location.search.substring(1).split("&");
var temp = parameters[0].split("=");
var name = unescape(temp[1]);
nameSpan.textContent = name;

//Create socket 
var socket = io.connect('/game');

//Add new player
socket.emit('add_player',name);

//Listen for events from server
socket.on('number_of_players_changed',(value)=>{
    console.log(value);
});