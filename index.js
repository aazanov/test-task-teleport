//JS document
//Created 29.01.2017
//Author Azanov A.A.

var param = require('./param.js');
var server = require('./app.js');
var http = require('http');
var io = require('socket.io').listen(param.socketPort);


//создаем сервер для контента. Частично задействуем Jade
http.createServer(server).listen(param.httpPort);
console.log('Server started at port ' + param.httpPort);

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
    ,checkCoords(coords, callback){
        /*
        Тут может быть функция проверки координат на нахождение на суше.
        Как вариант, воспользоваться сервисом http://maps.googleapis.com/maps/api/staticmap
        с последующим анализом цвета полученной по координатам точки.
        Далее, по callback, если точка синяя, тут же генерируем новую, если нет,
        отправляем на клиента.
        */
    }
    ,startGenerating(totalPoints, socket){
        socket.generatorTimer = setInterval(function(){
            socket.emit('addPoint', app.createCoords());
        }, 60000/totalPoints)
    }
    ,stopGenerating(socket){
        if (socket.generatorTimer){
            clearInterval(socket.generatorTimer);
            socket.generatorTimer = null;
            console.log('Generating is stopped');
        }
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
        app.stopGenerating(socket);
    });

    socket.on('generating', function(msg){
        console.log(msg);
        if (typeof(msg) !== 'object'){
            return;
        }
        if (msg.action === 'start'){
            app.startGenerating(msg.velocity, socket);
        } else {
            app.stopGenerating(socket);
        }
    });
});
