//JS Document

var cacheElements = {
    startButton: document.querySelector('#startButton')
    ,status: document.querySelector('#status')
}

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
        console.log(ymaps);
        var myGeoObject = new ymaps.Placemark([properties.coords.lat, properties.coords.long], {
                hintContent: properties.name,
                balloonContent: properties.name
            });
        app.myMap.geoObjects.add(myGeoObject);
        app.totalPoints ++;
        app.setStatus('На карту добавлено ' + app.totalPoints + ' маркеров');
    }
}



ymaps.ready(init);

// инициализируем карту
function init(){
    var myMap = new ymaps.Map ("map", {
        center: [55.76, 37.64],
        zoom: 7
    });
    myMap.controls.add('zoomControl');
    app.myMap = myMap;
    var myGeoObject = new ymaps.Placemark([55.76, 37.64], {
            hintContent: 'Москва!',
            balloonContent: 'Столица России'
        });
        app.myMap.geoObjects.add(myGeoObject);
}

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
    app.socket.emit('startGenerating', 'We are going to start');
};
