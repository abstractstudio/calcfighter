var MAX_BULLETS = 2;
var BULLET_COOLDOWN = 200;
var INVINCIBILITY_TIME = 2000;
var SHIELD_TIME = 2000;

// Player data and computation model.
function Player(name, image, bindings, engine) {
    
    // Engine.
    this.engine = engine;
    
    // Character info.
    this.name = name;
    this.image = new Image();
    this.ready = false;
    this.image.onload = function() { this.ready = true; }
    this.image.src = image;
    
    this.shielded = false;
    
    // Position and physics.
    this.x = 100;
    this.y = 100;
    this.xv = 0;
    this.yv = 0;
    this.jump = 0;
    this.jumpTime = 0;
    this.grounded = false;
    this.collisions = {};
    this.direction = -1;
    this.deathTime = 0;
    
    // Bullets.
    this.bullet = 2;
    this.bulletTime = 0;
    this.shield = SHIELD_TIME;
    
    // Scoring.
    this.score = 0;
    
    // Input.
    this.bindings = bindings;
    
    // Geometry. 
    this.bbox = function() {
        return [this.x, this.y, this.image.width, this.image.height];
    }
    
    // Update.
    this.update = function(delta) {
        
        // Strafing.
        if (this.bindings.left in keys) {
            this.xv -= XV_ACCELERATION;
            this.direction = -1;
        }
        if (this.bindings.right in keys) {
            this.xv += XV_ACCELERATION;
            this.direction = 1;
        }
        
        // X drag and terminal velocity.
        var sign = this.xv > 0 ? 1 : -1;
        this.xv = sign * Math.max(Math.abs(this.xv) - XV_FRICTION, 0);
        if (Math.abs(this.xv) > XV_TERMINAL) this.xv = sign * XV_TERMINAL;
        
        // Jumping.
        if (this.jump < JUMP_MAX && Date.now() - this.jumpTime > JUMP_COOLDOWN && this.bindings.up in keys) {
            this.grounded = false;
            this.jump++;
            this.jumpTime = Date.now();
            this.yv = -JUMP;
        }
        
        // Groundedness.
        if (!this.grounded) {
            this.yv += YV_GRAVITY;
        } else {
            this.yv = 0;
            this.jump = 0;
        }
        
        // Y terminal velocity.
        if (Math.abs(this.yv) > YV_TERMINAL) {
            this.yv = (this.yv > 0 ? 1 : -1) * YV_TERMINAL;
        }
        
        // Actually move the player.
        this.x += this.xv * delta;
        this.y += this.yv * delta;
        
        // Shooting.
        if (this.bullet > 0 && Date.now() - this.bulletTime > BULLET_COOLDOWN && this.bindings.shoot in keys) {
            this.bullet--;
            this.bulletTime = Date.now();
            this.engine.bullets.push(new Bullet(this));
            this.deathTime = 0;
        }
        
        // Shields after user presses key.
        if (this.shield > 0 && this.bindings.shield in keys) {
			if (this.shielded) {
				this.shield -= delta;
			} else {
        		this.shielded = true;
        	}
        } else {
        	this.shielded = false;
        }
    }
    
    this.render = function(context) {
        
        // Draw the image.
        if (Date.now() - this.deathTime < INVINCIBILITY_TIME && Date.now() % 500 < 150) return;
        context.drawImage(this.image, this.x, this.y);
        
        // TODO: Draw triangle
        
    }

    this.die = function() {
        
        // Time of death.
        this.deathTime = Date.now();
        
        // Set physics.
        this.y = 0;
        this.yv = 0;
        
        // Reload shield.
        this.shield = SHIELD_TIME;

        // Spawn randomly.
        this.x = Math.random() * this.engine.canvas.width;

    }

    this.invincible = function() {

        // Assert the death time is within the invincibility.       
        return Date.now() - this.deathTime < INVINCIBILITY_TIME || this.shielded;

    }
 
}
