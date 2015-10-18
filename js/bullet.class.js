/**
 * Created by Dylan on 18/10/2015.
 */

Bullet = function(x, y, status, game) {
    this.x = x;
    this.y = y;

    this.speed = 5;

    this.currentRange = 0;
    this.maxRange = 200;

    this.isCollision = false;

    this.status = status;

    this.sprite = null;
    this.setSprite(game);
};

Bullet.prototype.setSprite = function(game) {
    var texture = PIXI.Texture.fromImage('img/weapons/bullet_01.png');
    // create a new Sprite using the texture
    this.sprite = new PIXI.Sprite(texture);

    // center the sprites anchor point
    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 0.5;

    // move the sprite t the center of the screen
    this.sprite.position.x = this.x;
    this.sprite.position.y = this.y;

    game.addStageElement(this.sprite);
};

Bullet.prototype.drawBullet = function(map) {
    if(this.status == PLAYER_STATUS.MOVING_LEFT) {
        this.x -= map.isMovingView ? (this.speed - map.scrollSpeed) : this.speed;

        this.sprite.scale.x = 1;
        this.sprite.position.x = this.x;
    }
    else {
        this.x += map.isMovingView ? (this.speed - map.scrollSpeed) : this.speed;

        this.sprite.scale.x = -1;
        this.sprite.position.x = this.x;
    }

    this.currentRange += this.speed;
};

Bullet.prototype.detectCollision = function(element) {
    if(element.properties.destroyable) {
        if((this.x + (this.sprite.width / 2)) >= element.x && (this.x - (this.sprite.width / 2))  <= (element.x + element.sprite.width) && (this.y + (this.sprite.height / 2)) >= element.y && (this.y - (this.sprite.height / 2)) <= (element.y + element.sprite.height)) {
            console.log('collision bullet');
            console.log(element);
            this.isCollision = true;
            element.countTouch++;
            element.currentDamage += 1.5;
        }
    }
};