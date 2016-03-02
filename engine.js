// Physics constants.
var XV_ACCELERATION = 0.085;
var XV_TERMINAL = 0.6;
var XV_FRICTION = 0.05;
var YV_GRAVITY = 0.05;
var YV_TERMINAL = 100;
var XV_BULLET = 0.75;

// Jumping physics constants
var JUMP = 0.9;
var JUMP_MAX = 2;
var JUMP_COOLDOWN = 400;
var CLIP_THRESHOLD = 2;

// Player constants
var MAX_BULLETS = 2;
var BULLET_COOLDOWN = 200;
var INVINCIBILITY_TIME = 2000;
var SHIELD_TIME = 2000;

// Platform constants.
PLATFORM_THICKNESS = 4;

// Animation limits.
var FPS_CAP = 100;
var FPS_INTERVAL = 1000 / FPS_CAP;
var F = 0;
var S = 0;

window.onfocus = function() { F = 0; S = Date.now() ; }

// Input.
var keys = {};
var keymap = [
	{left: 65, right: 68, up: 87, down: 83, shoot: 49, shield: 192},
	{left: 37, right: 39, up: 38, down: 40, shoot: 220, shield: 221}
];

// Sprites and particles.
var spritesPaths = {zero: "images/zero.png", infinity: "images/infinity.png", ddx: "images/ddx.png", intsmall: "images/intsmall.png", intlarge: "images/intlarge.png"}
var spritesReady = {}
var sprites = {};

for (var key in spritesPaths) {
    spritesReady[key] = false;
    
    var image = new Image();
    image.key = key;
    image.onload = function() { spritesReady[this.key] = true; }
    image.src = spritesPaths[key];
    
    sprites[key] = image;
}

var particlePaths = ["images/particle/0.png", "images/particle/1.png", "images/particle/2.png", "images/particle/3.png", "images/particle/4.png", "images/particle/5.png", "images/particle/6.png", "images/particle/7.png", "images/particle/8.png", "images/particle/9.png"];
var particlesReady = [];
var particles = [];

for (var i = 0; i < particlePaths.length; i++) {
	particlesReady[i] = false;
	
	var image = new Image();
	image.key = i;
    image.onload = function() { particlesReady[this.key] = true; }
    image.src = particlePaths[i];
    
    particles[i] = image;
	console.log(i);
	console.log(particlesReady);
	console.log("\n");
}

var ready = false;


// Animation
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Rectangular intersection.
function intersects(r1, r2) {
    return !(r1[0]+r1[2] < r2[0] || r1[0] > r2[0]+r2[2] || r1[1]+r1[3] < r2[1] || r1[1] > r2[1]+r2[3]);
}

// The main game engine class.
function Engine(canvas) {
    
    // Graphics.
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.context.font = "20px Verdana";

    // Set up timing.
    this.time = Date.now();

    // Input binding.
    addEventListener("keydown", function(e) { 
        keys[e.keyCode] = true; 
        if ([37, 39, 38, 40].indexOf(e.keyCode) > -1) e.preventDefault();
    }, false);
    addEventListener("keyup", function(e) { delete keys[e.keyCode]; }, false);

    // Game objects.
    this.platforms = [
        new Platform((canvas.width - 400)/2, canvas.height * 13/20, 400, PLATFORM_THICKNESS), 
		new Platform((canvas.width - 650)/2, canvas.height * 9/20, 150, PLATFORM_THICKNESS), 
		new Platform((canvas.width + 350)/2, canvas.height * 9/20, 150, PLATFORM_THICKNESS)
    ];
    this.bullets = [];
    this.players = {
        zero: new Player("zero", sprites.zero, sprites.intlarge, particles, keymap[0], this),
        infinitus: new Player("infinitus", sprites.infinity, sprites.intsmall, particles, keymap[1], this)
    };
                
    // Update the game.
    this.update = function(delta) {
 
        // Update the players
        for (var name in this.players) this.players[name].update(delta);
        for (var i = 0; i < this.bullets.length; i++) {
            var bullet = this.bullets[i];
            bullet.update(delta);
            
            // Check if a bullet has died.
            if (bullet.x+bullet.image.width < 0 || bullet.x > canvas.width) {
                this.dieBullet(i);
            }
        }
        
        // Collision detection
        for (var name in this.players) {
            
            // Get the actual player.
            var player = this.players[name];
            
            // Generate boundary boxes.
            var bbox = player.bbox();
            
            // Platform collision.
            player.grounded = false;
            for (var i = 0; i < this.platforms.length; i++) {
                
                // Access the individual platform. 
                var platform = this.platforms[i];
                
                // Check if colliding with platform while FALLING.
                if (player.yv > 0 && intersects(bbox, platform.bbox()) && !(i in player.collisions)) {
                    //console.log(platform.bbox());
                    player.y = platform.y - player.image.height;
                    player.yv = 0;
                    player.grounded = true;
                    player.jump = 0;
                    player.collisions[i] = true;
                } else {
                    delete player.collisions[i];
                }
                
            }
            
            for (var i = 0; i < this.bullets.length; i++) {
                
                // Access the bullet.
                var bullet = this.bullets[i];
                
                // Intersection with bullet.
                if (!player.invincible() && !player.shielded && intersects(bbox, bullet.bbox())) {
                    this.die(player);
                    this.dieBullet(i);
                } else if (player.shielded && intersects(bbox, bullet.bbox())) {
                    this.dieBullet(i);
                }
                
            }
            
            // Edge detection.
            if (player.x < 0) player.x = 0;
            else if (player.x+player.image.width > canvas.width) player.x = canvas.width - player.image.width;
            if (player.y < 0) player.y = 0;
            else if (player.y + player.image.height > canvas.height + 150) this.die(player);

        }
        
    }
    
    // Draw the game to the canvas. 
    this.render = function() {
        
        // Check if reasources are ready.
        if (!ready) {
            ready = true;
            for (var key in spritesReady) ready &= spritesReady[key];
            return;
        }
        
        // Redraw the background.
        this.context.fillStyle = "#CCC";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw the platforms.
        this.context.fillStyle = "#000";
        for (var i = 0; i < this.platforms.length; i++) {
            this.platforms[i].render(this.context);
        }
        
        // Draw the players.
        for (var name in this.players) {
            this.players[name].render(this.context);
        }
        
        // Draw the bullets.
        for (var i = 0; i < this.bullets.length; i++) {
            this.bullets[i].render(this.context);
        }
        
        // Draw frames per second.
        this.context.fillStyle = "#AAA";
        
        this.context.textAlign = "left";
        this.context.textBaseline = "top";
        this.context.fillText(Math.round(F/(Date.now() - S) * 1000), 10, 10);
        
        this.context.fillRect(10, this.canvas.height-40, 0.08*this.players.zero.shield, 3);
        this.context.textBaseline = "bottom"
        this.context.fillText("Captain Zero: " + this.players.zero.score, 10, this.canvas.height-10);

        this.context.fillRect(this.canvas.width-10, this.canvas.height-40, -0.08*this.players.infinitus.shield, 3);
        this.context.textAlign = "right";
        this.context.fillText("Infinitus: " + this.players.infinitus.score, this.canvas.width-10, this.canvas.height-10);

    }
        
    // The main game loop.
    this.main = function() {
        
        // Record timing.
        var now = Date.now();
        var delta = now - this.time;
        
        if (delta > FPS_INTERVAL) {
        
            // Update and render.
            this.update(delta);
            this.render();

            // Update timing.
            this.time = now;
            
            // Update frame count.
            F++;
        
        }
            
        // Next frame
        requestAnimationFrame(this.main.bind(this));
        
    }
    
    // Called when a player dies.
    this.die = function(player) {
        
        // Move the player and update score.
        if (player.name == "zero") this.players.infinitus.score++;
        else if (player.name == "infinitus") this.players.zero.score++;
        player.die();
        
    }
    
    // Wait for resources before going to main.
    this.start = function() {
        S = Date.now();
        this.main(); 
    }
    
    // Kill a bullet.
    this.dieBullet = function(index) {
        this.bullets[index].player.bullet++;
        this.bullets.splice(index, 1);
    }
    
}

// Start the game.
function start() {
    var canvas = document.getElementById("canvas");
    var e = new Engine(canvas);
    e.start();
}
