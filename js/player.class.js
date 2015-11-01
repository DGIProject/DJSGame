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
    this.x = (x * game.map.cubeSize);
    this.y = (x * game.map.cubeSize);

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

    this.fallingSpeed = 2.0;
    this.walkingSpeed = 2.1;
    this.runningSpeed = 2.5;

    this.isJumping = false;
    this.collisions = [];

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
    this.animatedSprite.anchor.y = 1;
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
    //this.sprite.anchor.y = 0.5;

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
        this.jump(map);
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
    if(!this.isJumping) {
        var element = this.mostNear(map);

        //console.log(element);

        if(this.y < (element.y - map.cubeSize - 1)) {
            this.fall();
            //console.log(this.y);
        }
        else {
            //console.log('egal');
            this.yEgal(element.y - map.cubeSize - 1);
        }

        /*
        if(this.y > ((element.y - map.cubeSize) - 5)) {
            console.log('ok');
            this.yEgal(element.y - map.cubeSize);
        }
        */
    }


    /*
    var isAboveElement = false;

    for(var i = 0; i < map.elements.length; i++) {
        if(map.elements[i] != undefined) {
            for(var j = 0; j < map.elements[i].length; j++) {
                var element = map.elements[i][j];

                this.detectCollision(element, i);

                for(var a = 0; a < this.bullets.length; a++) {
                    this.bullets[a].detectCollision(element);
                }

                //console.log('most near : ' + this.mostNear(map));
                if(this.x >= element.x && this.x <= (element.x + element.sprite.width) && element.type == 'block' /*&& j == this.mostNear(map)*//*) {
                    /*
        isAboveElement = true;
                    //console.log('element here');

                    if(!this.isJumping) {
                        if(this.y < element.y) {
                            console.log('ok');
                            this.fall();
                        }
                        else {
                            console.log(element.y);
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
    */
};

Player.prototype.mostNear = function(map) {
    //var mostNearRow = 0;
    var nElement = {y: 3000};

    for(var i = 0; i < map.elements.length; i++) {
        if(map.elements[i] != undefined) {
            for(var j = 0; j < map.elements[i].length; j++) {
                var element = map.elements[i][j];

                this.detectCollision(element, j, map.cubeSize);

                if(element.y < /*map.elements[i][mostNearRow].y*/ nElement.y && element.y >= this.y && (this.x + (this.animatedSprite.width / 2)) > element.x && (this.x - (this.animatedSprite.width / 2)) < (element.x + element.sprite.width) && element.type == 'block')
                    /*mostNearRow = j;*/ nElement = element;
            }
        }
    }

    //return mostNearRow;
    return nElement;
};

Player.prototype.detectCollision = function(element, index, cubeSize) {
    var elementX = element.x / cubeSize;
    var elementLastX = (element.x + element.size) / cubeSize;
    var playerX = this.x / cubeSize;

    var elementY = element.y / cubeSize;
    var elementLastY = elementY - 1;
    var playerY = this.y / cubeSize;

    //console.log(elementX + '-' + elementLastX + '-' + playerX);
    //console.log(elementY + '-' + elementLastY + '-' + playerY);

    console.log(Math.floor(playerX) + '-' + Math.ceil(playerY));

    if((Math.floor(playerX) - 1) == elementX && Math.ceil(playerY) == elementY && playerX < (elementLastX + 1)) {
        console.log('left block');
    }

    //if(elementX < playerX && elementLastX > playerX && elementY >= playerY && elementLastY < playerY)
        //console.log(elementX + '-' + elementLastX + '-' + playerX + '-' + elementY);

    //if(element.type == 'item') {

    /*
    var rowCollision = -1;

    if(((this.y + (this.animatedSprite.height / 2)) > (element.y + element.sprite.height) || (this.y - (this.animatedSprite.height / 2)) > element.y) && index > 0) {
        if(element.type == 'block') {
            if((this.x + (this.animatedSprite.width / 2)) >= element.x && (this.x - (this.animatedSprite.width / 2)) < element.x) {
                if(this.rowCollision(element.uid, COLLISION_TYPE.LEFT) < 0) {
                    //console.log('isNewCollisionLeft');
                    this.collisions.push(new Collision(COLLISION_TYPE.LEFT, element.uid));
                    //console.log(element.uid);
                }
            }
            else {
                rowCollision = this.rowCollision(element.uid, COLLISION_TYPE.LEFT);

                if(rowCollision >= 0) {
                    //console.log('deleteCollisionLeft');
                    //console.log(element.uid);
                    //console.log(rowCollision);
                    this.collisions.splice(rowCollision, 1);
                }
            }

            if((this.x - (this.animatedSprite.width / 2)) <= (element.x + element.sprite.width) && (this.x + (this.animatedSprite.width / 2)) > (element.x + element.sprite.width)) {
                if(this.rowCollision(element.uid, COLLISION_TYPE.RIGHT) < 0) {
                    //console.log('isNewCollisionRight');
                    this.collisions.push(new Collision(COLLISION_TYPE.RIGHT, element.uid));
                }
            }
            else {
                rowCollision = this.rowCollision(element.uid, COLLISION_TYPE.RIGHT);

                if(rowCollision >= 0) {
                    //console.log('deleteCollisionRight');
                    this.collisions.splice(rowCollision, 1);
                }
            }
        }

        if(element.type == 'item' && element.properties.damagePoints > 0) {
            this.setDamage(element.properties.damagePoints);
        }

    }
    else {
        rowCollision = this.rowCollision(element.uid, COLLISION_TYPE.LEFT);

        if(rowCollision >= 0) {
            this.collisions.splice(rowCollision, 1);
        }

        rowCollision = this.rowCollision(element.uid, COLLISION_TYPE.RIGHT);

        if(rowCollision >= 0) {
            this.collisions.splice(rowCollision, 1);
        }
    }

    if((this.x + (this.animatedSprite.width / 2)) >= element.x && (this.x - (this.animatedSprite.width / 2))  <= (element.x + element.sprite.width) && (this.y) >= element.y && (this.y) <= (element.y + element.sprite.height) && index > 0) {
        //console.log('collision player');
        if(element.type == 'item' && element.properties.damagePoints > 0) {
            this.setDamage(element.properties.damagePoints);
        }
    }

    /*
    if((this.y + (this.animatedSprite.height / 2)) >= element.y && (this.y - (this.animatedSprite.height / 2)) <= (element.y + element.sprite.height) && index > 0){
        if(element.type == 'item' && element.properties.damagePoints > 0 && (this.x + (this.animatedSprite.width / 2)) >= element.x && (this.x - (this.animatedSprite.width / 2))  <= (element.x + element.sprite.width)) {
            this.setDamage(element.properties.damagePoints);
        }

        /*
        if((this.x + (this.animatedSprite.width / 2)) >= element.x) {
            console.log('left collision');
        }

        if((this.x - (this.animatedSprite.width / 2))  <= (element.x + element.sprite.width)) {
            console.log('right collision');
        }
        */

        /*
        if((element.x - this.x) <= 0 && (element.x - this.x) > -element.width) {
            console.log('left collision');
        }
        else if(((this.x - (this.animatedSprite.width / 2)) - (element.x + element.sprite.width)) <= 0) {
            console.log('right collision');
        }
    }
*/
    //}
};

Player.prototype.rowCollision = function(elementUId, type) {
    var rowCollision = -1;

    for(var i = 0; i < this.collisions.length; i++) {
        if(this.collisions[i].elementUId == elementUId && this.collisions[i].type == type)
            rowCollision = i;
    }

    return rowCollision;
};

Player.prototype.setDamage = function(damagePoints) {
    if(this.canDamage) {
        this.health -= damagePoints;
        this.canDamage = false;

        console.log(this.health);

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
    var isLeftCollision = false;

    for(var i = 0; i < this.collisions.length; i++) {
        if(this.collisions[i].type == COLLISION_TYPE.LEFT)
            isLeftCollision = true;
    }

    if(isLeftCollision)
        return;

    if(this.isFalling) {
        this.x += this.fallingSpeed;
    }
    else {
        this.x += map.isMovingView ? (this.walkingSpeed - map.scrollSpeed) : this.walkingSpeed;
    }

    this.animatedSprite.position.x = this.x ;
};

Player.prototype.backward = function(map) {
    var isRightCollision = false;

    for(var i = 0; i < this.collisions.length; i++) {
        if(this.collisions[i].type == COLLISION_TYPE.RIGHT)
            isRightCollision = true;
    }

    if(isRightCollision)
        return;

    if(this.isFalling) {
        this.x -= this.fallingSpeed;
    }
    else {
        this.x -= map.isMovingView ? (this.walkingSpeed - map.scrollSpeed) : this.walkingSpeed;
    }

    this.animatedSprite.position.x = this.x;
};

Player.prototype.jump = function(map) {
    //console.log('jump');

    this.isJumping = true;

    var that = this;
    this.jumpState = 0;
    var rateJump = 1.8;
    var lastY = this.y;
    var mostNearY = this.y;
    var posYGo = this.y - 80;
    var doneJump = false;
    var doneFloor = false;

    //console.log(that.y);
    //console.log(posYGo);

    var jumpInterval = setInterval(function() {
        if(doneJump) {

            //console.log(mostNearY);

            if(that.y >= mostNearY) {
                //console.log('stop jump');

                that.y = mostNearY;
                that.animatedSprite.position.y = mostNearY;

                //console.log('stopJump');

                that.stopJump();
                clearInterval(jumpInterval);
            }
            else {
                //console.log('down');
                that.y += rateJump;
                that.animatedSprite.position.y += rateJump;

                rateJump += 0.02;
                mostNearY = that.mostNear(map).y - 37;
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