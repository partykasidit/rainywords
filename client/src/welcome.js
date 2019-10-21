import React, { useState } from "react";
import { socket } from "./socket";


//setup
//var socket = io.connect('http://localhost:4000');
function Welcome() {
    //DOM manipulation
    // var button = document.getElementById('button');
    // var textBox = document.getElementById('textbox')
    const [input, setInput] = useState("")

    const sendMessage = (message) => {
        socket.emit("add_player", message)
    }

    const changeInput = (e) => {
        setInput(e.target.value)
    }

    const handleSubmit = (e) => {
        sendMessage(input)
        setInput("")
        e.preventDefault()
    }

    return (
        <div className="Welcome">
            <h1>Rainy Words Game</h1>
            <form onSubmit={handleSubmit} >
                <p>Enter your name: </p>
                <input type="text" name="name" onChange={changeInput}></input><br />
                <button type="button" onClick={handleSubmit} >Play</button>
            </form>
        </div>
    );


}

export default Welcome