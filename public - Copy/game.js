//DOM
var nameSpan = document.getElementById('my_span');

//Set username
var parameters = location.search.substring(1).split("&");
var temp = parameters[0].split("=");
var name = unescape(temp[1]);
nameSpan.textContent = name;

//Create sockets
var socket = io.connect('/game');

/*----------Documentation----------*/

//--These are what you can sent to the server--//

//1. Add new player
socket.emit('add_player',name);

//2. Increase point
var button = document.getElementById('increase_point');
button.addEventListener('click',()=>{
    socket.emit('increase_point',1);
});

//3. Get words
socket.emit('get_words',{
    'duration': 10, //sec
    'rate': 2 //words per sec
});

//--These are what you can listen for--//

//1. Changes in number of players
socket.on('number_of_players_changed',(value)=>{
    console.log(value);
});

//2. Set of words you requested
socket.on('words',(value)=>{
    console.log(value);
});

//3. Force reset
socket.on('reset_game',()=>{
    console.log('reset the game');
});
