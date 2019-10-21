//Include dependencies
var express = require("express");
var path = require("path");
var socket = require("socket.io");
var randomWords = require("random-words");

//App setup
var app = express();
var server = app.listen(4000, function() {
  console.log("listening to requests on port 4000");
});

//Serve static files
app.use(express.static("public"));
// app.get('/', function(req, res){
//     res.sendFile(path.join(__dirname, '/public', 'welcome.html'));
// });
// app.get('/game', function(req, res){
//     res.sendFile(path.join(__dirname, '/public', 'game.html'));
// });

//Socket setup
var io = socket(server);

//Initialize game variables
var players = new Map();
const patplayers = {};
let lobbyPlayers = 0;
let readyPlayer = "";

//Game server
const game = io.of("/game");
game.on("connection", socket => {
  socket.on("disconnect", () => {
    delete patplayers[socket.id];
    players.delete(socket.id);
    game.emit("number_of_players_changed", players.size);
    // game.emit('players_changed', mapToObject(players)); //bug
    const payload = {
      updatedPlayers: patplayers,
      userId: socket.id
    };
    game.emit("players_changed", payload);
  });
  socket.on("add_player", name => {
    console.log(name + " joined the game");
    patplayers[socket.id] = {
      username: name,
      score: 0
    };
    lobbyPlayers++;
    if (lobbyPlayers === 2) {
      socket.emit("startGame", readyPlayer);
      socket.broadcast.to(readyPlayer).emit("startGame", socket.id);
      lobbyPlayers = 0;
    } else {
      readyPlayer = socket.id;
    }
    // players.set(socket.id, {
    //     'username': name,
    //     'score': 0,
    // });

    game.emit("number_of_players_changed", players.size);
    const payload = {
      updatedPlayers: patplayers,
      userId: socket.id
    };
    game.emit("players_changed", payload);
  });
  socket.on("get_words", data => {
    game.emit("words", getWords(data.duration, data.rate));
  });
  socket.on("increase_point", amount => {
    // let currentPlayer = patplayers[socket.id];
    //if (patplayers[socket.id].score != undefined) {
    // currentPlayer.score += amount;
    // players.set(socket.id, currentPlayer);
    patplayers[socket.id].score++;
    // game.emit('score_changed', currentPlayer);
    const payload = {
      updatedPlayers: patplayers,
      userId: socket.id
    };
    game.emit("players_changed", payload);
    // }
  });
  //  var currentPlayer = players.get(socket.id);
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
      position: Math.random() * 100 //%
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
