/**
 * Created by Dylan on 15/10/2015.
 */

var multiplayer = null;

var socket = null;

var IP_ADDRESS = '151.80.175.218';
var PORT = '995';

localStorage.debug = '';

function connectToServer() {
    socket = io('http://151.80.175.218:8080');

    socket.emit('data', 'ok');

    socket.on('connect', function() {
        console.log('connected from server');
    });

    socket.on('disconnect', function() {
        console.log('disconnected from server');
    });

    socket.on('news', function (data) {
        console.log(data);
    });
}

function multiplayerClass() {
    multiplayer = new Multiplayer();
    multiplayer.setAddress('151.80.175.218', '8080');
    multiplayer.onLog(function(data) {
        console.log('-MULTIPLAYER- ' + data);
    });

    multiplayer.startConnection();
}
