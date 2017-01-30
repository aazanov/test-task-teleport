//JS document
//Created 29.01.2017
//Author Azanov A.A.

//Кешируем DOM объекты
var cacheElements = {
    startButton: document.querySelector('#startButton')
    ,status: document.querySelector('#status')
    ,velocity: document.querySelector('#velocity')
}

//Глобальная переменная локальных функций
var app = {
    socketPort: document.querySelector('meta[name="socketPort"]').getAttribute('content')
    ,socketHost: document.location.hostname
    ,totalPoints: 0
    ,setStatus(status){
        cacheElements.status.innerHTML = status;
    }
    ,addPoint(properties){
        if (typeof(properties) !== 'object'){
            return;
        }
        var geoDescription = {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature"
                    ,"id": app.totalPoints
                    ,"geometry": {
                        "type": "Point"
                        ,"coordinates": [properties.coords.lat, properties.coords.long]
                    }
                    ,"properties": {
                        "balloonContent": properties.name
                        ,"clusterCaption": "Метка " + app.totalPoints
                        ,"hintContent": properties.coords.lat + ', ' + properties.coords.long
                    }
                }
            ]
        }
        app.objectManager.add(geoDescription);
        app.totalPoints ++;
        app.setStatus('На карту добавлено ' + app.totalPoints + ' маркеров');
    }
}

//Изменение состояний кнопки управления
cacheElements.startButton.changeState = function(){
    if (this.state === 'stop' || !this.state){
        this.value = 'Начать генерацию';
        this.state = 'start';
    } else {
        this.value = 'Остановить генерацию';
        this.state = 'stop';
    }
}
cacheElements.startButton.changeState();

// инициализируем карту
ymaps.ready(function(){
    var myMap = new ymaps.Map ("map", {
        center: [55.76, 37.64],
        zoom: 7
    });
    myMap.controls.add('zoomControl');
    app.myMap = myMap;
    //Добавляем ObjectManager для ускорения быстродействия Yandex Maps
    app.objectManager = new ymaps.ObjectManager({
        clusterize: false
        ,gridSize: 32
    });
    app.myMap.geoObjects.add(app.objectManager);
});

//Создание сокета
(function(){
    socket = io.connect(app.socketHost + ':' + app.socketPort);
    socket.on('connect', function () {
        app.setStatus("Соединение установлено");
        app.socket = socket;
    });
    socket.on('disconnect', function(){
        app.setStatus("Разрыв соединения");
        app.socket = null;
    });
    socket.on('message', function(msg){
        console.log(msg);
    });
    socket.on('addPoint', function(msg){
        app.addPoint(msg);
    });
})();

cacheElements.startButton.onclick = function(){
    if (!app.socket){
        return;
    }
    var parameters = {
        action: this.state
        ,velocity: parseInt(cacheElements.velocity.value, 10) || 10000
    }
    app.socket.emit('generating', parameters);
    this.changeState();
};
