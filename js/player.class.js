/**
 * Created by Dylan on 16/10/2015.
 */

var PLAYER_STATUS = {
    STOPPED: 0,
    MOVING_LEFT: 1,
    MOVING_RIGHT: 2
};

Player = function(x, y, orientation, game) {
    this.uid = uid();
    this.x = x;
    this.y = y;

    this.status = orientation;

    //this.sprite = null;
    //this.setSprite(game);

    this.animatedSprite = null;
    this.setAnimatedSprite(game);

    /*
    var that = this;

    PIXI.loader
        .add('img/players/player01.json')
        .load(function() {
            that.setAnimatedSprite(game);
        });
    */

    this.controller = new Controller();
    this.controller.assignKeys(37, 39, 32, 65);

    this.blockCommands = false;

    this.fallingSpeed = 0.2;
    this.walkingSpeed = 1.8;
    this.runningSpeed = 2.5;

    this.isJumping = false;

    this.bullets = [];
    this.canBullet = true;
    this.timeNextBullet = 500;

    this.health = 10;
    this.canDamage = true;
    this.timeNextDamage = 750;

    function uid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }
};

Player.prototype.setAnimatedSprite = function(game) {
    console.log('animatedSprite');

    //Get a reference to the base texture (your single spritesheet image)
    var base = PIXI.TextureCache["img/players/players.png"];

//The first sub-mage
    var texture0 = new PIXI.Texture.fromImage('img/players/player01_0.png');
    var texture1 = new PIXI.Texture.fromImage('img/players/player01_1.png');
    var texture2 = new PIXI.Texture.fromImage('img/players/player01_2.png');
//Create a PIXI.Rectangle that defines the x, y, width and height
//of the sub-image of the first animation frame on the spritesheet
    //texture0.setFrame(new PIXI.Rectangle(0, 0, 16, 16));

//Do the same for the other frames:
//The second sub-image
    //var texture1 = new PIXI.Texture(base);
    //texture1.setFrame(new PIXI.Rectangle(16, 0, 32, 32));
/*
//The third sub-image
    var texture2 = new PIXI.Texture(base);
    texture2.setFrame(new PIXI.Rectangle(96, 0, 32, 32));

//Make an array of these sub-images
*/
    var textures = [texture0, texture1, texture2];

    //var textures = [];

//Create the `MovieClip` sprite using the `textures` array
    this.animatedSprite = new PIXI.MovieClip(textures);

//Set the sprite's position and add it to the stage
    this.animatedSprite.position.set(this.x, this.y);
    this.animatedSprite.anchor.x = 0.5;
    this.animatedSprite.anchor.y = 0.5;
    this.animatedSprite.animationSpeed = 0.3;
    this.animatedSprite.play();

    game.addStageElement(this.animatedSprite);

    /*
    var frames = [];

    /*
     for (var i = 0; i < 3; i++) {
     frames.push(PIXI.Texture.fromFrame('img/players/player01_' + i + '.png'));
     }
     */

    /*
    for (var i = 0; i < 30; i++) {
        var val = i < 10 ? '0' + i : i;

        // magically works since the spritesheet was loaded with the pixi loader
        frames.push(PIXI.Texture.fromFrame('rollSequence00' + val + '.png'));
    }

    this.movie = new PIXI.extras.MovieClip(frames);

    //this.movie.position.x = this.x;
    //this.movie.position.y = this.y;

    this.movie.position.set(300);

    this.movie.animationSpeed = 0.5;

    game.addStageElement(this.movie);
    */
};

Player.prototype.setSprite = function(game) {
    /*
    var frames = [];

    /*
    for (var i = 0; i < 3; i++) {
        frames.push(PIXI.Texture.fromFrame('img/players/player01_' + i + '.png'));
    }
    */

    /*
    for (var i = 0; i < 30; i++) {
        var val = i < 10 ? '0' + i : i;

        // magically works since the spritesheet was loaded with the pixi loader
        frames.push(PIXI.Texture.fromFrame('rollSequence00' + val + '.png'));
    }

    this.movie = new PIXI.extras.MovieClip(frames);

    this.movie.position.x = this.x;
    this.movie.position.y = this.y;

    this.movie.animationSpeed = 0.5;
    */

    //game.addStageElement(this.movie);

    var texture = PIXI.Texture.fromImage("img/bunny.png");
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

Player.prototype.drawPlayer = function(game, map) {
    //ANIMATION
    this.setGravity(map);

    for(var i = 0; i < this.bullets.length; i++) {
        if(this.bullets[i].currentRange >= this.bullets[i].maxRange || this.bullets[i].isCollision) {
            game.removeStageElement(this.bullets[i].sprite);
            this.bullets.splice(i, 1);
        }
        else {
            this.bullets[i].drawBullet(map);
        }
    }

    this.animatedSprite.scale.x = (this.status == PLAYER_STATUS.MOVING_LEFT) ? 1 : -1;

    if(this.controller.keys.left.pressed) {
        this.backward(map);

        this.status = PLAYER_STATUS.MOVING_LEFT;
        this.animatedSprite.play();
    }
    else if(this.controller.keys.right.pressed) {
        this.forward(map);

        this.status = PLAYER_STATUS.MOVING_RIGHT;
        this.animatedSprite.play();
    }
    else {
        //this.status = PLAYER_STATUS.STOPPED;
        this.animatedSprite.stop();
    }

    if(this.controller.keys.jump.pressed && !this.isJumping && !this.isFalling) {
        this.jump();
    }

    if(this.controller.keys.shoot.pressed && this.canBullet) {
        this.bullets.push(new Bullet(this.x, this.y, this.status, game));
        this.canBullet = false;

        var that = this;

        setTimeout(function() {
            that.canBullet = true;
        }, this.timeNextBullet);
    }

    if(this.y >= game.canvas.element.height) {
        this.setDamage(10);
    }
};

Player.prototype.setGravity = function(map) {
    var isAboveElement = false;

    for(var i = 0; i < map.elements.length; i++) {
        if(map.elements[i] != undefined) {
            for(var j = 0; j < map.elements[i].length; j++) {
                var element = map.elements[i][j];

                this.detectCollision(element);

                for(var a = 0; a < this.bullets.length; a++) {
                    this.bullets[a].detectCollision(element);
                }

                if(this.x >= element.x && this.x <= (element.x + element.width)) {
                    isAboveElement = true;
                    //console.log('element here');

                    if(!this.isJumping) {
                        if(this.y < element.y) {
                            this.fall();
                        }
                        else {
                            this.yEgal(element.y);
                        }
                    }
                }
            }
        }
    }

    if(!isAboveElement && !this.isJumping) {
        //console.log('not under element');

        this.fall();
    }
};

Player.prototype.detectCollision = function(element) {
    if(element.type == 'item') {
        if((this.x + (this.animatedSprite.width / 2)) >= element.x && (this.x - (this.animatedSprite.width / 2))  <= (element.x + element.sprite.width) && (this.y + (this.animatedSprite.height / 2)) >= element.y && (this.y - (this.animatedSprite.height / 2)) <= (element.y + element.sprite.height)) {
            console.log('collision player');
            if(element.prototype.damagePoints > 0) {
                this.setDamage(element.prototype.damagePoints);
            }
        }
    }
};

Player.prototype.setDamage = function(damagePoints) {
    if(this.canDamage) {
        this.health -= damagePoints;
        this.canDamage = false;

        var that = this;

        setTimeout(function() {
            that.canDamage = true;
        }, this.timeNextDamage);
    }
};

Player.prototype.resetHealth = function() {
    this.health = 10;
};

Player.prototype.isKilled = function() {
    return this.health <= 0;
};

Player.prototype.fall = function() {
    this.y += 1.5;
    this.animatedSprite.position.y += 1.5;

    this.isFalling = true;
    //this.blockCommands = true;
};

Player.prototype.forward = function(map) {
    if(this.isFalling) {
        this.x += this.fallingSpeed;
    }
    else {
        this.x += map.isMovingView ? (this.walkingSpeed - map.scrollSpeed) : this.walkingSpeed;
    }

    this.animatedSprite.position.x = this.x;
};

Player.prototype.backward = function(map) {
    if(this.isFalling) {
        this.x -= this.fallingSpeed;
    }
    else {
        this.x -= map.isMovingView ? (this.walkingSpeed - map.scrollSpeed) : this.walkingSpeed;
    }

    this.animatedSprite.position.x = this.x;
};

Player.prototype.jump = function() {
    //console.log('jump');

    this.isJumping = true;

    var that = this;
    this.jumpState = 0;
    var rateJump = 1.8;
    var lastY = this.y;
    var posYGo = this.y - 80;
    var doneJump = false;
    var doneFloor = false;

    //console.log(that.y);
    //console.log(posYGo);

    var jumpInterval = setInterval(function() {
        if(doneJump) {
            if(that.y >= lastY) {
                //console.log('stop jump');

                that.y = lastY;
                that.animatedSprite.position.y = lastY;

                that.stopJump();
                clearInterval(jumpInterval);
            }
            else {
                //console.log('down');
                that.y += rateJump;
                that.animatedSprite.position.y += rateJump;

                rateJump += 0.02;
            }
        }
        else {
            if(that.y <= posYGo) {
                doneJump = true;
                //console.log('doneJump');
            }
            else {
                //console.log('up');
                that.y -= rateJump;
                that.animatedSprite.position.y -= rateJump;

                rateJump -= 0.02;
            }
        }
    }, 5);

    /*
    var jumpInterval = setInterval(function() {

        if(that.jumpState < 80) {
            //console.log('up');
            that.y -= 1;
            that.animatedSprite.position.y -= 1;
        }
        else {
            //console.log('down');
            that.y += 1;
            that.animatedSprite.position.y += 1;
        }

        if(that.jumpState == 160) {
            //console.log('stop jump');

            that.stopJump();
            clearInterval(jumpInterval);
        }

        that.jumpState++;
    }, 5);
    */
};

Player.prototype.stopJump = function() {
    this.isJumping = false;
};

Player.prototype.yEgal = function(y) {
    this.y = y;
    this.animatedSprite.position.y = y;

    this.isFalling = false;
    //this.blockCommands = false;
};

Player.prototype.xEgal = function(x) {
    this.x = x;
    this.animatedSprite.position.x = x;

    this.isFalling = false;
    //this.blockCommands = false;
};

Player.prototype.resetParameters = function(x, y, orientation) {
    this.x = x;
    this.animatedSprite.position.x = x;

    this.y = y;
    this.animatedSprite.position.y = y;

    this.status = orientation;
};