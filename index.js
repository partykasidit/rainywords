var express = require('express');
var path = require('path');
var socket = require('socket.io');
var clients = [];
var players = [];

//App setup
var app = express();
var server = app.listen(4000,function(){
    console.log('listening to requests on port 4000');
});

//Serve static files
app.use(express.static('public'));
/*app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/public', 'welcome.html'));
});*/

//Socket setup
var io = socket(server);

io.on('connection',function(socket){
    console.log('Socket ' + socket.id + ' is connected');
    clients.push(socket.id);
    console.log('Current sockets : ' + clients);
    socket.on('new_player',(data)=>{
        players.push(data);
        console.log('Current players are ' + players);
    });
    socket.on('disconnect',()=>{
        console.log('Socket ' + socket.id + ' is disconnected!');
        var i = clients.indexOf(socket);
        clients.splice(i, 1);
        console.log('Current sockets : ' + clients);
    });
});