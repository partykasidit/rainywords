import React, { useState } from "react";
import { socket } from "./socket";
import "./welcome.css";
//setup
//var socket = io.connect('http://localhost:4000');
function Welcome() {
    //DOM manipulation
    // var button = document.getElementById('button');
    // var textBox = document.getElementById('textbox')
    const [input, setInput] = useState("");
    const [alreadyClick, setAlreadyClick] = useState(0);
    const [waiting, setWaiting] = useState(false);
    const [morePlayer, setMorePlayer] = useState(0);
    const [myname, setMyName] = useState("");
 //   const ambulance = new Audio('/amb.mp3')

    const sendMessage = message => {
        // socket.emit("addPlayer", message);
        // socket.emit('add_player',message);
        socket.emit("add_player", message);
        setWaiting(true); //
        setMyName(message);
        setMorePlayer(c => c + 1);
    };

    const changeInput = e => {
        setInput(e.target.value);
    };

    const handleSubmit = e => {
        sendMessage(input);
        setInput("");
        e.preventDefault();
    };

    return (
        <div className="Welcome">
            <div>
                <h1>Rainy Words Game</h1>
                <form onSubmit={handleSubmit}>
                    <p>Enter your name: </p>
                    <input
                        type="text"
                        name="name"
                        onChange={changeInput}
                    ></input>
                    <br />
                    <button id="playbtn" type="button" onClick={handleSubmit}>
                        Play
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Welcome;

// {waiting && (
//     <div>
//         <h1>Welcome, {myname}</h1>
//         <h1>
//             {morePlayer <= 2 ? (
//                 <h1> Waiting for more players...</h1>
//             ) : (
//                 <button type="button">Play</button>
//             )}
//         </h1>
//     </div>
// )}
// </div>

// const handleClick = e => {
//     socket.emit("add_player",name);

// };
// {(morePlayer <= 2)?(<h1> Waiting for more players...</h1>):(<button type="button">Play</button>)}

// const buffer = <h1> Waiting for more players...</h1>;
// if (morePlayer <= 2) {
//     buffer = (
//         <h1>
//             <button type="button">Play</button>
//         </h1>
//     );
// }
// {
//     morePlayer <= 2 ? (
//         <h1> Waiting for more players...</h1>
//     ) : (
//         <button type="button">Play</button>
//     );
// }
