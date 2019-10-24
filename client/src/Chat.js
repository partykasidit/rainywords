import { socket } from "./socket";
import React, { useState, useEffect } from "react";

function Chat({ players, playerId }) {
    // const messages = []
    const [message, setMessage] = useState([]);
    const [input, setInput] = useState("");

    //playerId !== "" &&

    useEffect(() => {
        console.log(playerId);
        socket.emit("UpdateChat", message => {
            console.log(message);
            setMessage(message);
        });

        socket.on("messageToClient", message => {
            console.log(message);
            setMessage(message);
        });
    }, []);

    

    const sendChat = () => {
        socket.emit("ChatMessage", input);
    };

    const changeInput = event => {
        setInput(event.target.value);
    };

    const handleSubmit = event => {
        socket.emit("ChatMessage", players[playerId].username + ": " + input);
        setInput("");
        event.preventDefault();
    };

    const handleOnClick = event => {
        socket.emit("ChatMessage", players[playerId].username + ": " + input);
        setInput("");
    };

    return (
        <div className="chat-window">
            <div className="chat-box">
                {message.map(word => (
                    <div>{word}</div>
                ))}
            </div>
            <form
                id="form"
                className="chat-form-submit"
                onSubmit={handleSubmit}
            >
                <input
                    value={input}
                    onChange={changeInput}
                    name="message"
                    placeholder="Message"
                ></input>
                <button className="send" type="button" onClick={handleOnClick}>
                    Send
                </button>
            </form>
        </div>
    );
}

export default Chat;

// socket.on("msgToClients", message => {
//     messages.push(message);
// });

// const handleOnClick = (name, text) => {
//     socket.emit("msgToServer", `${name}: ${text}`);
// };

// const handleOnClick = (name, text) => {
//     socket.emit("msgToServer", `${name}: ${text}`);
// };
