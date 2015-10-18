/**
 * Created by Dylan on 18/10/2015.
 */

var COLLISION_TYPE = {
    LEFT: 0,
    RIGHT: 1
};

Collision = function(type, elementUId) {
    this.type = type;
    this.elementUId = elementUId;

    this.setEffect();
};

Collision.prototype.setEffect = function() {
    //COLLISION EFFECT
};