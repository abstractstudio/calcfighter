/* Main objects. */
var canvas;
var context;
var now;
var then;
var keys;

/* Players and map. */
var zero;
var infinitus;
var players = {"zero": zero, "infinitus": infinitus};
var platforms;

/* Constants. */
var XV_ACCELERATION = 0.1;
var XV_TERMINAL = 0.5;
var XV_FRICTION = 0.05;
var YV_GRAVITY = 0.05;
var YV_TERMINAL = 0.5;
var JUMP = 1;
var JUMP_MAX = 2;
var JUMP_COOLDOWN = 400;

var SNAP_TO_EDGE = 2;

/* Useful. */
var X = 0; var Y = 1;
var W = 2; var H = 3;
var X1 = 0; var X2 = 2;
var Y1 = 1; var Y2 = 3;

/* Animation. */
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

/* Game library. */
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
    canvas.width = 854;
    canvas.height = 480;
    document.body.appendChild(canvas);
    
    /* Set up tick rate. */
    now = Date.now();
    then = Date.now();    
    
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
        character: "0",
        name: "zero",

        x: 400, 
        y: 50,
        xv: 0,
        yv: 0,
        
        grounded: false,
        platforms: [], 
        jumpState: 0, 
        jumpTime: 0, 
        
        score: 0,
        
        bbox: function() { return [zero.x+1, zero.y+1, 21, 29]; },
        cbox: function() { return [zero.x+1, zero.y+1, zero.x+21, zero.y+29]; },
        
        leftKey: 65,
        rightKey: 68,
        upKey: 87,
        downKey: 83,
    };
    
    infinitus = {
        character: "\u221E",
        name: "infinitus",

        x: 800, 
        y: 50,
        xv: 0,
        yv: 0,
        
        grounded: false,
        platforms: [], 
        jumpState: 0, 
        jumpTime: 0, 
        
        score: 0,
        
        bbox: function() { return [infinitus.x+2, infinitus.y+7, 33, 19]; },
        cbox: function() { return [infinitus.x+2, infinitus.y+7, infinitus.x+33, infinitus.y+19]; },
        
        leftKey: 37,
        rightKey: 39,
        upKey: 38,
        downKey: 40,
    };
    
    players["zero"] = zero;
    players["infinitus"] = infinitus;
    
    for (var i = 0; i < platforms.length; i++) {
        zero.platforms[i] = false;
        infinitus.platforms[i] = false;
    }

}

function update(delta) {
    
    /* Update the players individually. */
    for (var name in players) {

        /* Obtain the player. */
        var player = players[name];
                
        /* Strafing. */
        if (player.leftKey in keys) player.xv -= XV_ACCELERATION;
        if (player.rightKey in keys) player.xv += XV_ACCELERATION;
        
        /* Drag and terminal velocity. */
        var sign = player.xv > 0 ? 1 : -1;
        player.xv = sign * Math.max(Math.abs(player.xv) - XV_FRICTION, 0);
        if (Math.abs(player.xv) > XV_TERMINAL) player.xv = sign * XV_TERMINAL;
        
        /* Jumping. */
        if (player.jumpState < JUMP_MAX && Date.now() - player.jumpTime > JUMP_COOLDOWN && player.upKey in keys) {
            player.grounded = false;
            player.jumpState++;
            player.jumpTime = Date.now();
            player.yv = -JUMP;
        }
        
        if (!player.grounded) {
            player.yv += YV_GRAVITY;
        } else {
            player.yv = 0;
            player.jumpState = 0;
        }

        if (Math.abs(player.yv) > YV_TERMINAL) {
            //console.log("capped yv");
            (player.yv > 0 ? 1 : -1) * YV_TERMINAL;
        }        

        var pcbox = player.cbox();

        /* Actually move. */
        player.x += player.xv * delta;
        player.y += player.yv * delta;
        
        /* Collisions. */
        var bbox = player.bbox();
        var cbox = player.cbox();

        var dbox = [pcbox[0], pcbox[1], cbox[2]-pcbox[0], cbox[3]-pcbox[1]]; 
        
        for (var i = 0; i < platforms.length; i++) {
            
            var platform = platforms[i];

            /* Check if colliding with platform. */
            if (player.yv > 0 && intersects(dbox, platform)) {
                
                /* Check if close enough to snap up to platform. */
                if (player.platforms[i] === false) {
                    player.y = platform[Y] - bbox[H];
                    player.yv = 0;
                    player.grounded = true;
                    player.jumpState = 0;
                    player.platforms[i] = true;
                }
                
            } else {
                
                /* Otherwise, the player is ungrounded. */
                player.grounded = false;
                player.platforms[i] = false;

            }
        }
        
        /* Edge. */
        if (cbox[X1] < 0) player.x = 0;
        else if (cbox[X2] > canvas.width) player.x = canvas.width - bbox[W];
        if (cbox[Y1] < 0) player.y = 0;
        else if (player.y + bbox[H] > canvas.height + 50) die(player);
        
    }
    
}

function die(player) {
    if (player.name == "zero") infinitus.score++;
    else if (player.name == "infinitus") zero.score++;
    player.y = 0;
    player.yv = 0;
    console.log("DIE");
}
    
function respawn(player) {
    console.log("RESPAWN");
	player.y = 0;
	player.yv = 0;
}

function intersects(r1, r2) {
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
