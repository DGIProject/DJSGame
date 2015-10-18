/**
 * Created by Dylan on 16/10/2015.
 */

var game = null;
var multiplayer = null;

function initGame() {
    game = new Game('gameCanvas', {w: 600, h: 500});
    game.loadMap('map01.json');
    game.addPlayer();
}

function initMultiplayer() {
    multiplayer = new Multiplayer();
    multiplayer.setAddress('151.80.175.218', '8080');
    multiplayer.onLog(function(data) {
        console.log('-MULTIPLAYER- ' + data);
    });

    multiplayer.startConnection();
}

window.onload = function() {
    initGame();
};