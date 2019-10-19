//Include dependencies
var express = require('express');
var path = require('path');
var socket = require('socket.io');
var randomWords = require('random-words');

//App setup
var app = express();
var server = app.listen(4000,function(){
    console.log('listening to requests on port 4000');
});

//Serve static files
app.use(express.static('public'));
app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, '/public', 'welcome.html'));
});
app.get('/game', function(req, res){
    res.sendFile(path.join(__dirname, '/public', 'game.html'));
});

//Socket setup
var io = socket(server);

//Initialize game variables
var players = new Map();

//Game server
const game = io.of('/game');
game.on('connection',(socket)=>{
    socket.on('disconnect',()=>{
        players.delete(socket.id);
        console.log(players);
        game.emit('number_of_players_changed',players.size);
    });
    socket.on('add_player',(name)=>{
        players.set(socket.id,{
            'username' : name,
            'score' : 0,
        });
        console.log(players);
        game.emit('number_of_players_changed',players.size);
    });
    socket.on('get_words',(data)=>{
        game.emit('words',getWords(data.duration, data.rate));
    });
    socket.on('increase_point',(amount)=>{
        var currentPlayer = players.get(socket.id);
        currentPlayer.score += amount;
        players.set(socket.id,currentPlayer);
        console.log(players);
    });
    socket.on('reset_game',()=>{
        players.forEach((player)=>{
            player.score = 0;
        })
        console.log(players);
        game.emit('reset_game');
    });
    // socket.on('get_players',()=>{
    //     console.log(mapToJson(players));
    //     game.emit('players',mapToJson(players));
    // });
    socket.on('get_number_of_players',()=>{
        game.emit('number_of_players_changed',players.size);
    });
});

//Set time and position for random words
function getWords(duration, rate) {
    var response = [];
    var numberOfWords = duration*rate;
    var words = randomWords(numberOfWords);
    for(i=0;i<numberOfWords;i++) {
        response[i] = {
            'word': words[i],
            'time': Math.random()*duration, //in seconds
            'position': Math.random()*100 //%
        }
    }
    return response;
}

function mapToJson(map) {
    return JSON.stringify(map);
}
function jsonToMap(jsonStr) {
    return new Map(JSON.parse(jsonStr));
}