/* Main objects. */
var canvas;
var context;
var now;
var then;
var keys;

/* Players and map. */
var zero;
var infinitus;
var platforms;

/* Constants. */
var SPEED = 0.5;
var ACCELERATION = 0.25;

/* Animation. */
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

function main() {
    
    /* Record the initial tick time. */
    var now = Date.now();
    var delta = now - then;
    
    /* Update and render. */
    update(delta);
    render();
    
    /* Update tick time. */
    then = now;

    /* Next frame. */
    requestAnimationFrame(main);

}

function setup() {
    
    /* Configure the canvas. */
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    canvas.width = 700;
    canvas.height = 300;
    document.body.appendChild(canvas);
    
    /* Set up tick rate. */
    now = Date.now();
    delta = now - then;    
    
    /* Keyboard input. */
    keys = {};
    addEventListener("keydown", function(e) {
        keys[e.keyCode] = true;
    }, false);
    addEventListener("keyup", function(e) {
        delete keys[e.keyCode];
    }, false);
    
    /* Platforms. */
    platforms = [
        {x: 50, y: 250, width: 600, height: 4}
    ];
    
    /* Start the game. */
    reset();
    main();
    
}

function reset() {
    
    /* Set the contents of each player. */
    zero = {
        x: 100, 
        y: 50,
        yv: 0,
        grounded: true, 
        character: "0",
        bbox: function() { return [zero.x+1, zero.y+1, 21, -29]; }
    };
    
    infinitus = {
        x: 600, 
        y: 50,
        yv: 0,
        grounded: true, 
        character: "\u221E",
        bbox: function() { return [infinitus.x+2, infinitus.y-2, 32, -19]; }
    };
    
}

function update(delta) {
    
    /* Player movement. */
    if (65 in keys) zero.x -= SPEED * delta; // a
    if (68 in keys) zero.x += SPEED * delta; // d
    if (37 in keys) infinitus.x -= SPEED * delta; // left
    if (39 in keys) infinitus.x += SPEED * delta; // right
    
    /* Collisions. */
    
    
}

function render() {
    
    /* Redraw the background. */
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    /* Draw the platforms. */
    context.fillStyle = "black";
    for (var i = 0; i < platforms.length; i++) {
        context.fillRect(platforms[i].x, platforms[i].y, platforms[i].width, platforms[i].height);
    }
    
    /* Draw the players. */
    context.fillStyle = "black";
    context.font = "36px Verdana";
    //context.strokeRect(zero.x+1, zero.y+1, 21, -29);
    z = zero.bbox();
    context.strokeRect(z[0], z[1], z[2], z[3]);
    context.fillText(zero.character, zero.x, zero.y);
    context.strokeRect(infinitus.x+2, infinitus.y-2, 32, -19);
    context.fillText(infinitus.character, infinitus.x, infinitus.y);
    
}