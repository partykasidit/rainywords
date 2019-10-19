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
var clients = [];
var players = [];

//welcome
io.on('connection',function(socket){
    console.log('Socket ' + socket.id + ' is connected');
    clients.push(socket.id);
    console.log('Current sockets : ' + clients);
    socket.on('add_player',(data)=>{
        io.sockets.emit('number_of_players_changed',2/*number of players*/);
    });
    socket.on('disconnect',()=>{
        console.log('Socket ' + socket.id + ' is disconnected!');
        var i = clients.indexOf(socket);
        clients.splice(i, 1);
        console.log('Current sockets : ' + clients);
    });
    socket.on('get_words',()=>{
        io.sockets.emit('words',['Rain','Chulalongkorn','Engineering']);
    });
    socket.on('increase_point',()=>{
        
    });
});

//game
const nsp = io.of('/my-namespace');
nsp.on('connection',(socket)=>{
    console.log('someone connected');
});