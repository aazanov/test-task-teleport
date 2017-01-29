//JS document
//Created 29.01.2017
//Author Azanov A.A.

var par = require('./param.js');
var server = require('./app.js');
var http = require('http');
var io = require('socket.io').listen(par.socketPort);


//создаем сервер для контента. Частично задействуем Jade
http.createServer(server).listen(par.httpPort);
console.log('Server started at port ' + par.httpPort);

//глобальный объект локальных функций
var app = {
    //Создаем пару координат
    createCoords(){
        return {
            coords:{
                lat: -90 + Math.random() * 180
                ,long: -180 + Math.random() * 360
            }
            ,name: "name"
        }
    }
    ,checkCoords(coords){

    }
    ,startGenerating(totalPoints, socket){
        socket.generatorTimer = setInterval(function(){
            socket.emit('addPoint', app.createCoords());
        }, 60000/totalPoints)
    }
}

//запускаем прослушку сокетов
io.sockets.on('connection', function (socket) {
    console.log('Client connected');
    socket.on('message', function(msg){
        console.log(msg);
    });

    socket.on('disconnect', function(){
        console.log('Client disconnected');
        clearInterval(socket.generatorTimer);
    });

    socket.on('startGenerating', function(msg){
        console.log(msg);
        app.startGenerating(100, socket);

    });


});

console.log(new Date().getTime());
var i=0
for (i=0; i<10000; i++){
    app.createCoords();
}
console.log(new Date().getTime(), i);

console.dir(app.createCoords());
