//setup
var socket = io.connect('http://localhost:4000');

//DOM manipulation
var button = document.getElementById('button');
var textBox = document.getElementById('textbox');

button.addEventListener("click",function(){
    alert('Button clicked');
});