/**
 * Created by Dylan on 16/10/2015.
 */

var tabKeys = [];

window.onkeydown = function(e) {
    var code = e.keyCode;

    if(code == 27)
    {
        $('#menuGameModal').modal('toggle');
    }
    else
    {
        if(tabKeys.indexOf(code) < 0)
        {
            tabKeys.push(code);
        }
    }

    //console.log(tabKeys);
};

window.onkeyup = function(e) {
    var code = e.keyCode;
    var index = tabKeys.indexOf(code);

    if(index >= 0)
    {
        tabKeys.splice(index, 1);
    }
};

Controller = function() {
    this.keys = {
        left: {n: 0, pressed: false},
        right: {n: 0, pressed: false},
        jump: {n: 0, pressed: false},
        shoot: {n: 0, pressed: false}
    };

    this.isListenning = false;
};

Controller.prototype.listenNewKey = function() {
    this.isListenning = true;
};

Controller.prototype.assignNewKey = function() {
    this.isListenning = false;
};

Controller.prototype.assignKeys = function(left, right, jump, shoot) {
    this.keys.left.n = left;
    this.keys.right.n = right;
    this.keys.jump.n = jump;
    this.keys.shoot.n = shoot;
};

Controller.prototype.alreadyAssigned = function() {

};