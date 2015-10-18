/**
 * Created by Dylan on 16/10/2015.
 */

var MULTIPLAYER_STATUS = {
    DISCONNECTED: 0,
    CONNECTED: 1
};

Multiplayer = function() {
    this.ip = null;
    this.port = null;

    this.socket = null;

    this.currentStatus = MULTIPLAYER_STATUS.DISCONNECTED;

    this.isLogs = true;
    this.callbackLogs = null;

    this.connectedOnServer = function() {
        this.currentStatus = MULTIPLAYER_STATUS.CONNECTED;
        this.newLog('connected from server');
    };

    this.disconnectedOnServer = function() {
        this.currentStatus = MULTIPLAYER_STATUS.DISCONNECTED;
        this.newLog('disconnected from server');
    };

    this.newLog = function(text) {
        this.callbackLogs(text);
    };
};

//PROPERTIES
Multiplayer.prototype.setAddress = function(ip, port) {
    this.ip = ip;
    this.port = port;
};

//CONNECTION
Multiplayer.prototype.startConnection = function() {
    this.newLog('starting connection from http://' + this.ip + ':' + this.port);
    this.socket = io('http://' + this.ip + ':' + this.port);

    var that = this;

    this.socket.on('connect', function() {
        that.connectedOnServer();
    });

    this.socket.on('disconnect', function() {
        that.disconnectedOnServer();
    });

    this.socket.on('data', function (data) {
        that.newLog(data);
    });
};

Multiplayer.prototype.stopConnection = function() {
    this.socket.disconnect();

    this.currentStatus = MULTIPLAYER_STATUS.DISCONNECTED;
};

Multiplayer.prototype.sendData = function(data) {
    if(this.currentStatus == MULTIPLAYER_STATUS.CONNECTED) {
        this.newLog('sendData : YES');
        this.socket.emit('clientData', data);
    }
    else
        this.newLog('sendData : NO');
};

//LOGS
Multiplayer.prototype.onLog = function(callback) {
    this.callbackLogs = callback;
};