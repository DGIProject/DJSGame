/**
 * Created by Dylan on 16/10/2015.
 */

window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        function( callback ){
            window.setTimeout(callback, 1000 / 60);
        };
})();

Game = function(elementId, size) {
    this.canvas = {
        element: document.getElementById(elementId),
        context: null
    };

    this.size = size;

    this.map = null;
    this.players = [];

    var that = this;

    this.stage = new PIXI.Stage(0x66FF99);
    this.renderer = new PIXI.autoDetectRenderer(that.size.w, that.size.h, {view: that.canvas.element});

    requestAnimFrame(this.updateGameCanvas.bind(this));
};

Game.prototype.updateGameCanvas = function() {
    this.analyzeTabKeys();

    var ratio = 0;

    for(var a = 0; a < this.players.length; a++) {
        if((this.players[a].x / this.canvas.element.width) > ratio)
            ratio = this.players[a].x / this.canvas.element.width;
    }

    this.map.drawElements(ratio - Math.floor(ratio), this);

    for(var i = 0; i < this.players.length; i++) {
        if(this.players[i].isKilled()) {
            var checkPointRow = this.gNearCheckPoint(this.players[i].x);

            this.players[i].resetParameters(this.map.checkPoints[checkPointRow].x, this.map.checkPoints[checkPointRow].y, this.map.player.orientation);
            this.players[i].resetHealth();
        }

        this.players[i].drawPlayer(this, this.map);
    }

    this.renderer.render(this.stage);

    requestAnimFrame(this.updateGameCanvas.bind(this));
};

//MAP
Game.prototype.loadMap = function(file) {
    this.map = new Map(file);
    this.map.loadMap(this);
};

Game.prototype.gNearCheckPoint = function(lastX) {
    var checkPointRow = 0;

    for(var i = 0; i < this.map.checkPoints.length; i++) {
        if(this.map.checkPoints[i].x < lastX && this.map.checkPoints[i].x > this.map.checkPoints[checkPointRow].x)
            checkPointRow = i;
    }

    return checkPointRow;
};

//PLAYER
Game.prototype.addPlayer = function(x, y, orientation) {
    if(x != null && y != null)
        this.players.push(new Player(x, y, orientation, this));
    else
        this.players.push(new Player(this.map.checkPoints[0].x, this.map.checkPoints[0].y, this.map.player.orientation, this));
};

Game.prototype.analyzeTabKeys = function() {
    for(var i = 0; i < this.players.length; i++) {
        this.players[i].controller.keys.left.pressed = (tabKeys.indexOf(this.players[i].controller.keys.left.n) >= 0);
        this.players[i].controller.keys.right.pressed = (tabKeys.indexOf(this.players[i].controller.keys.right.n) >= 0);
        this.players[i].controller.keys.jump.pressed = (tabKeys.indexOf(this.players[i].controller.keys.jump.n) >= 0);
        this.players[i].controller.keys.shoot.pressed = (tabKeys.indexOf(this.players[i].controller.keys.shoot.n) >= 0);
    }
};

Game.prototype.addStageElement = function(element) {
    this.stage.addChild(element);
};

Game.prototype.removeStageElement = function(element) {
    this.stage.removeChild(element);
};