import { socket } from "./socket";

function Chat(players) {
    // const messages = []
    const [message, setMessage] = setState([]);

    const handleOnClick = (name, text) => {
        socket.emit("msgToServer", `${name}: ${text}`);
    };

    return (
        <div
            onClick={e => handleOnClick(players[playerId].username, text)}
        ></div>
    );
}

export default Chat;

socket.on("msgToClients", message => {
    messages.push(message);
});

const handleOnClick = (name, text) => {
    socket.emit("msgToServer", `${name}: ${text}`);
};
