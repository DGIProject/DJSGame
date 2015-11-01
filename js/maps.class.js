/**
 * Created by Dylan on 16/10/2015.
 */

function getXMLHttpRequest()
{
    var xhr = null;

    if (window.XMLHttpRequest || window.ActiveXObject)
    {
        if (window.ActiveXObject)
        {
            try
            {
                xhr = new ActiveXObject("Msxml2.XMLHTTP");
            }
            catch(e)
            {
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            }
        }
        else
        {
            xhr = new XMLHttpRequest();
        }
    }
    else
    {
        alert("Votre navigateur ne supporte pas l'objet XMLHTTPRequest...");
        return null;
    }

    return xhr;
}

Map = function(file) {
    this.file = file;

    this.name = null;
    this.version = null;

    this.player = null;
    this.checkPoints = null;

    this.scrollSpeed = 0.88;
    this.isMovingView = false;

    this.blocks = [];
    this.elements = [];
    this.cubeSize = 32;

    this.far = null;
    this.middle = null;
};

Map.prototype.getContentFile = function() {
    var xhr = getXMLHttpRequest();

    xhr.open("GET", 'maps/' + this.file, false);
    xhr.send(null);
    if(xhr.readyState != 4 || (xhr.status != 200 && xhr.status != 0)) // Code == 0 en local
        throw new Error("Impossible de charger la carte nommée \"" + this.file + "\" (code HTTP : " + xhr.status + ").");
    var mapJsonData = xhr.responseText;

    return JSON.parse(mapJsonData);
};

Map.prototype.loadMap = function(game) {
    var farTexture = PIXI.Texture.fromImage("img/bg-far.png");
    this.far = new PIXI.TilingSprite(farTexture, 512, 256);
    this.far.position.x = 0;
    this.far.position.y = 0;
    this.far.tilePosition.x = 0;
    this.far.tilePosition.y = 0;
    game.addStageElement(this.far);

    var midTexture = PIXI.Texture.fromImage("img/bg-mid.png");
    this.middle = new PIXI.TilingSprite(midTexture, 512, 256);
    this.middle.position.x = 0;
    this.middle.position.y = 128;
    this.middle.tilePosition.x = 0;
    this.middle.tilePosition.y = 0;
    game.addStageElement(this.middle);

    var content = this.getContentFile();

    console.log(content);

    this.name = content.name;
    this.version = content.version;

    this.player = content.player;
    this.checkPoints = content.checkPoints;

    this.blocks = content.blocks;

    for(var i = 0; i < content.elements.length; i++) {
        var block = this.blocks[content.elements[i].block];

        var element = new Element((content.elements[i].x * this.cubeSize), (content.elements[i].y * this.cubeSize), block.size, block.texture, block.type, block.properties);
        element.setGraphical(game);

        //{"x": 175, "y": 180, "width": 10, "texture": "brick.png", "index": 1, "type": "block", "properties": {"destroyable" : true, "damagePoints" : 0, "health": 5}}

        console.log(content.elements[i].index);

        if(this.elements[content.elements[i].index] == undefined)
            this.elements[content.elements[i].index] = [];

        this.elements[content.elements[i].index].push(element);
    }
};

Map.prototype.drawElements = function(ratio, game) {
    //console.log('ratio : ' + ratio);

    for(var a = 0; a < game.players.length; a++) {
        if(!game.players[a].blockCommands) {
            for(var i = 0; i < this.elements.length; i++) {
                if(this.elements[i] != undefined) {
                    for(var j = 0; j < this.elements[i].length; j++) {
                        /*
                        if(this.elements[i][j].properties.destroyable && this.elements[i][j].countTouch > 0 && this.elements[i][j].currentDamage >= this.elements[i][j].properties.health) {
                            console.log('delete element');
                            game.removeStageElement(this.elements[i][j].sprite);
                            this.elements[i].splice(j, 1);
                        }
                        */

                        if(ratio > 0.75 && game.players[a].controller.keys.right.pressed) {
                            //console.log('move less');

                            this.isMovingView = true;

                            this.far.tilePosition.x -= 0.128;
                            this.middle.tilePosition.x -= 0.24;

                            this.elements[i][j].lessPos(this.scrollSpeed);
                        }
                        else if(ratio < 0.1 && game.players[a].controller.keys.left.pressed) {
                            //console.log('move more');

                            this.isMovingView = true;

                            this.far.tilePosition.x += 0.128;
                            this.middle.tilePosition.x += 0.24;

                            this.elements[i][j].morePos(this.scrollSpeed);
                        }
                        else {
                            this.isMovingView = false;
                        }

                        /*
                        if(game.players[a].isJumping) {
                            if(game.players[a].jumpState < 80) {
                                this.far.tilePosition.y += 0.05;
                                this.middle.tilePosition.y += 0.1;

                                this.elements[i][j].moreJump();
                            }
                            else {
                                this.far.tilePosition.y -= 0.05;
                                this.middle.tilePosition.y -= 0.1;

                                this.elements[i][j].lessJump();
                            }
                        }
                        else {
                            this.far.tilePosition.y = 0;
                            this.middle.tilePosition.y = 0;

                            this.elements[i][j].setYBase();
                        }
                        */
                    }
                }
            }
        }
    }

    /*
    for(var i = 0; i < this.elements.length; i++) {
        if(this.elements[i] != undefined) {
            for(var j = 0; j < this.elements[i].length; j++) {
                if(playerStatus == PLAYER_STATUS.MOVING_LEFT) {
                    this.far.tilePosition.x += 0.128;
                    this.middle.tilePosition.x += 0.64;

                    this.elements[i][j].morePos();
                }
                else {
                    this.far.tilePosition.x -= 0.128;
                    this.middle.tilePosition.x -= 0.64;

                    this.elements[i][j].lessPos();
                }
            }
        }
    }
    */
};