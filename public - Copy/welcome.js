import React from "react";

//setup
//var socket = io.connect('http://localhost:4000');
function welcome() {
//DOM manipulation
var button = document.getElementById('button');
var textBox = document.getElementById('textbox');

button.addEventListener("click",function(){
    //socket.emit('new_player',textBox.value);
    window.location.href = "/game.html";
});

}
export default welcome