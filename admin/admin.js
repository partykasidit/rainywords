//Create socket
var socket = io.connect('http://localhost:4000/game');

//DOM
var resetButton = document.getElementById('reset_button');
var numberOfPlayersSpan = document.getElementsByTagName("span")[0];

resetButton.addEventListener("click",()=>{
    socket.emit('reset_game');
});

//Get players
socket.emit('get_number_of_players');

socket.on('number_of_players_changed',(value)=>{
    numberOfPlayersSpan.textContent = value;
})

// socket.on('players',(value)=>{
//     console.log(value);
//     numberOfPlayersSpan.textContent = value.size;
// })



