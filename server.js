const express = require("express");
const socket = require("socket.io");

const app = express();
const server = app.listen(4000, () => {
    console.log("Listening to PORT: 4000");
});

app.use(express.static("public"));

const io = socket(server);

const players = {};
let lobbyPlayers = 0;
let readyPlayer = "";

io.on("connect", socket => {
    console.log("Connected");
    socket.on("addPlayer", name => {
        lobbyPlayers++;
        players[socket.id] = {
            id: socket.id,
            name,
            score: 0
        };
        socket.emit("updatePlayers", players);
        socket.emit("setPlayerId", socket.id);
        if (lobbyPlayers === 2) {
            lobbyPlayers = 0;
            socket.emit("startGame", readyPlayer);
            io.to(readyPlayer).emit("updatePlayers", players);
            io.to(readyPlayer).emit("startGame", socket.id);
        } else {
            readyPlayer = socket.id;
        }
    });
    socket.on("increaseScore", oppId => {
        players[socket.id].score = players[socket.id].score + 1;
        socket.emit("updatePlayers", players);
        io.to(oppId).emit("updatePlayers", players);
    });
    socket.on("disconnect", () => {
        delete players[socket.id];
        console.log("Disconnect");
    });
});
