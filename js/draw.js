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

window.onload = function() {
    /*
    // create an new instance of a pixi stage
    var stage = new PIXI.Stage(0x66FF99);

    // create a renderer instance
    var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);

    // add the renderer view element to the DOM
    document.getElementById('test').appendChild(renderer.view);

    requestAnimFrame( animate );

    // create a texture from an image path
    var texture = PIXI.Texture.fromImage("img/bunny.png");
    // create a new Sprite using the texture
    var bunny = new PIXI.Sprite(texture);

    // center the sprites anchor point
    bunny.anchor.x = 0.5;
    bunny.anchor.y = 0.5;

    // move the sprite t the center of the screen
    bunny.position.x = 200;
    bunny.position.y = 150;

    stage.addChild(bunny);

    function animate() {

        requestAnimFrame( animate );

        // just for fun, lets rotate mr rabbit a little
        bunny.rotation += 0.1;

        // render the stage
        renderer.render(stage);
    }
    */
};

function init() {
    document.getElementById('gameCanvas').width = window.innerWidth;
    document.getElementById('gameCanvas').height = window.innerHeight;

    stage = new PIXI.Stage(0x66FF99);
    renderer = new PIXI.autoDetectRenderer(
        512,
        384,
        {view:document.getElementById("gameCanvas")}
    );

    var farTexture = PIXI.Texture.fromImage("img/bg-far.png");
    far = new PIXI.TilingSprite(farTexture, 512, 256);
    far.position.x = 0;
    far.position.y = 0;
    far.tilePosition.x = 0;
    far.tilePosition.y = 0;
    stage.addChild(far);

    var midTexture = PIXI.Texture.fromImage("img/bg-mid.png");
    mid = new PIXI.TilingSprite(midTexture, 512, 256);
    mid.position.x = 0;
    mid.position.y = 128;
    mid.tilePosition.x = 0;
    mid.tilePosition.y = 0;
    stage.addChild(mid);

    var texture = PIXI.Texture.fromImage("img/bunny.png");
    // create a new Sprite using the texture
    bunny = new PIXI.Sprite(texture);

    // center the sprites anchor point
    bunny.anchor.x = 0.5;
    bunny.anchor.y = 0.5;

    // move the sprite t the center of the screen
    bunny.position.x = 200;
    bunny.position.y = 150;

    stage.addChild(bunny);

    requestAnimFrame(update);
}

function update() {
    far.tilePosition.x -= 0.128;
    //mid.tilePosition.x -= 0.64;

    renderer.render(stage);

    requestAnimFrame(update);
}