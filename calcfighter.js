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
var GRAVITY = 0.45;

var JUMP = 10;
var MAX_JUMPS = 2;
var JUMP_COOLDOWN = 400;

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
    canvas.width = 1280;
    canvas.height = 1024;
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
        [(canvas.width - 600)/2, canvas.height * 13/20, 600, 4]
    ];
    
    /* Start the game. */
    reset();
    main();
    
}

function reset() {
    
    /* Set the contents of each player. */
    zero = {
        x: 400, 
        y: 50,
        yv: 0,
        grounded: false, 
		jumping: 0, 
		jumpTime: 0, 
        character: "0",
        bbox: function() { return [zero.x+1, zero.y+1, 21, 29]; }
    };
    
    infinitus = {
        x: 800, 
        y: 50,
        yv: 0,
        grounded: false, 
		jumping: 0, 
		jumpTime: 0, 
        character: "\u221E",
        bbox: function() { return [infinitus.x+2, infinitus.y+7, 33, 19]; }
    };
    
}

function update(delta) {
    
    /* Horizontal player movement. */
    if (65 in keys) zero.x -= SPEED * delta; // a
    if (68 in keys) zero.x += SPEED * delta; // d
    if (37 in keys) infinitus.x -= SPEED * delta; // left
    if (39 in keys) infinitus.x += SPEED * delta; // right
    
	/* Vertical player movement. */
	if (zero.jumping < MAX_JUMPS && Date.now() - zero.jumpTime > JUMP_COOLDOWN && 87 in keys) {
		zero.grounded = false;
		zero.jumping++;
		zero.jumpTime = Date.now();
		zero.yv = -JUMP;
	}
	if (!zero.grounded) {
		zero.yv += GRAVITY;
	} else {
		zero.yv = 0;
		zero.jumping = 0;
	}
	zero.y += zero.yv;
	
	if (!infinitus.grounded) {
		infinitus.yv += GRAVITY;
		infinitus.y += infinitus.yv;
	} else {
		infinitus.yv = 0;
	}
	
	/* Check if players are off screen. */
	zeroBBox = zero.bbox();
	infinBBox = infinitus.bbox();
	
	for (var i = 0; i < platforms.length; i++) {
		if (zero.yv > 0 && rectIntersect(zeroBBox, platforms[i])) {
			// Make sure the player doesn't go through the platform
			if (zero.y <= platforms[i][1]) zero.y = platforms[i][1] - zeroBBox[3];
			console.log("grounding");
			zero.yv = 0;
			zero.grounded = true;
			zero.jumping = 0;
			zero.jumpTime = Date.now();
			//alert("GROUDNEDEDEDED")
		} else {
			zero.grounded = false;
		}
		
		if (rectIntersect(infinBBox, platforms[i])) {
			if (infinitus.y <= platforms[i][1]) infinitus.y = platforms[i][1] - infinBBox[3];
			else infinitus.y = platforms[i][1];
			
			infinitus.grounded = true;
		} else {
			infinitus.grounded = false;
		}
	}
	
	if (zero.x < 0) zero.x = 0;
	else if (zero.x + zeroBBox[2] >= canvas.width) zero.x = canvas.width - zeroBBox[2];
	if (zero.y < 0) zero.y = 0;
	else if (zero.y + zeroBBox[3] >= canvas.height) {
		//zero.y = canvas.height - zeroBBox[3];
		respawn(zero);
	}
	
	if (infinitus.x < 0) infinitus.x = 0;
	else if (infinitus.x + infinBBox[2] >= canvas.width) infinitus.x = canvas.width - infinBBox[2];
	if (infinitus.y < 0) infinitus.y = 0;
	else if (infinitus.y + infinBBox[3] >= canvas.height) infinitus.y = canvas.height - infinBBox[3];
	
    /* Collisions. */
}

function respawn(player) {
	player.y = 0;
	player.yv = 0;
}

function rectIntersect(r1, r2) {
	return !(r1[0]+r1[2] < r2[0] || r1[0] > r2[0]+r2[2] || r1[1]+r1[3] < r2[1] || r1[1] > r2[1]+r2[3]);
}

function render() {
    /* Redraw the background. */
    context.fillStyle = "#CCCCCC";
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    /* Draw the platforms. */
    context.fillStyle = "black";
    for (var i = 0; i < platforms.length; i++) {
        context.fillRect(platforms[i][0], platforms[i][1], platforms[i][2], platforms[i][3]);
    }
    
    /* Draw the players. */
	context.textBaseline = "hanging";
    context.fillStyle = "black";
    context.font = "36px Verdana";
    bbox = zero.bbox();
	context.strokeRect(bbox[0], bbox[1], bbox[2], bbox[3]);
    context.fillText(zero.character, zero.x, zero.y);
	bbox = infinitus.bbox();
	context.strokeRect(bbox[0], bbox[1], bbox[2], bbox[3]);
    context.fillText(infinitus.character, infinitus.x, infinitus.y);
    
}