/**
 * Created by Dylan on 16/10/2015.
 */

Element = function(x, y, width, texture, type, properties) {
    this.x = x;
    this.y = y;

    this.yBase = this.y;

    this.width = width;

    this.type = type;

    this.texture = texture;
    this.sprite = null;

    this.properties = properties;

    this.countTouch = 0;
};

Element.prototype.setGraphical = function(game) {
    var texture = PIXI.Texture.fromImage('img/' + ((this.type == 'block') ? 'blocks' : 'items') + '/' + this.texture);
    // create a new Sprite using the texture
    this.sprite = new PIXI.Sprite(texture);

    // center the sprites anchor point
    //this.sprite.anchor.x = 0.5;
    //this.sprite.anchor.y = 0.5;

    // move the sprite t the center of the screen
    this.sprite.position.x = this.x;
    this.sprite.position.y = this.y;

    game.addStageElement(this.sprite);
};

Element.prototype.morePos = function(speedScroll) {
    this.x += speedScroll;
    this.sprite.position.x = this.x;
};

Element.prototype.lessPos = function(speedScroll) {
    this.x -= speedScroll;
    this.sprite.position.x = this.x;
};

Element.prototype.moreJump = function() {
    this.y += 0.8;
    this.sprite.position.y = this.y;
};

Element.prototype.lessJump = function() {
    this.y -= 0.8;
    this.sprite.position.y = this.y;
};

Element.prototype.setYBase = function() {
    this.y = this.yBase;
};