// //setup
// var socket = io.connect('http://localhost:4000');

// //DOM
// var textView = document.getElementsByTagName("p");

// socket.emit('get_words');

// socket.on('words',(value)=>{
//     alert(value);
// });

function myMove() {
    var elem = document.getElementById("animate");   
    var pos = 0;
    var id = setInterval(frame, 5);
    function frame() {
      if (pos == 350) {
        clearInterval(id);
      } else {
        pos++; 
        elem.style.top = pos + "px"; 
        elem.style.left = pos + "px"; 
      }
    }
  }


