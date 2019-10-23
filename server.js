//Include dependencies
var express = require("express");
var path = require("path");
var socket = require("socket.io");
var randomWords = require("random-words");

//App setup
var app = express();
var port = process.env.PORT || 4000;
var server = app.listen(port, function() {
    console.log("listening to requests on port " + port);
});

//Serve static files
app.use(express.static("public"));
// app.get("/", function(req, res) {
//     res.sendFile(path.join(__dirname, "/public", "welcome.html"));
// });
// app.get("/game", function(req, res) {
//     res.sendFile(path.join(__dirname, "/public", "game.html"));
// });

//Socket setup
var io = socket(server);

//Initialize game variables
var players = new Map();

//Game server
const game = io.of("/game");
game.on("connection", socket => {
    socket.on("disconnect", () => {
        players.delete(socket.id);
        game.emit("number_of_players_changed", players.size);
        game.emit("players_changed", mapToObject(players)); //bug
    });
    socket.on("add_player", name => {
        console.log("Welcome " + name);
        players.set(socket.id, {
            íd: socket.id,
            username: name,
            score: 0
        });
        game.emit("number_of_players_changed", players.size);
        game.emit("players_changed", mapToObject(players));
        socket.emit("setPlayerId", socket.id); //added
    });
    socket.on("get_words", data => {
        game.emit("words", getWords(data.duration, data.rate));
    });
    socket.on("clickPlay", () => {
        game.emit("startGame");
    }); // added

    socket.on("increase_point", amount => {
        var currentPlayer = players.get(socket.id);
        if (currentPlayer != undefined) {
            currentPlayer.score += amount;
            players.set(socket.id, currentPlayer);
            game.emit("score_changed", currentPlayer);
            game.emit("players_changed", mapToObject(players));
        }
    });

    socket.on("reset_game", () => {
        players.forEach(player => {
            player.score = 0;
        });
        game.emit("reset_game");
        game.emit("players_changed", mapToObject(players));
    });
    socket.on("get_players", () => {
        game.emit("players_changed", mapToObject(players));
    });
    socket.on("get_number_of_players", () => {
        game.emit("number_of_players_changed", players.size);
    });
});

//Set time and position for random words
function getWords(duration, rate) {
    var response = [];
    var numberOfWords = duration * rate;
    var words = randomWords(numberOfWords);
    for (i = 0; i < numberOfWords; i++) {
        response[i] = {
            word: words[i],
            time: Math.random() * duration, //in seconds
            //      position: Math.random() * 100 //%
            position: Math.floor(Math.random() * 60) + 20 + "vw"
        };
    }
    return response;
}

function mapToObject(map) {
    var response = {};
    map.forEach((value, key, map) => {
        response[key] = value;
    });
    return response;
}
