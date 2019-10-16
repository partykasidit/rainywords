var express = require('express');
var path=require('path');
var socket = require('socket.io');

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
    console.log('Socket connection is made',socket.id);
});