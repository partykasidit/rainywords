//Include dependencies
var express = require('express');
var path = require('path');
var socket = require('socket.io');

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
const nsp = io.of('/game');
nsp.on('connection',(socket)=>{
    socket.on('disconnect', function() {
        players.delete(socket.id);
        console.log(players);
    });
    socket.on('add_player',(name)=>{
        players.set(socket.id,{
            'username' : name,
            'score' : 0,
        });
        console.log(players); //Got problem with namespace
        io.sockets.emit('number_of_players_changed',players.size);
    });
    socket.on('get_words',()=>{
        io.sockets.emit('words',['Rain','Chulalongkorn','Engineering']);
    });
    socket.on('increase_point',()=>{
        
    });
});