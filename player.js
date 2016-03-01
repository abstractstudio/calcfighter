// Player data and computation model.
function Player(name, image, bindings) {
    
    // Character info.
    this.name = name;
    this.image = new Image();
    this.ready = false;
    this.image.onload = function() { this.ready = true; }
    this.image.src = image;
    
    // Position and physics.
    this.x = 100;
    this.y = 100;
    this.xv = 0;
    this.yv = 0;
    this.jump = 0;
    this.jumpTime = 0;
    this.grounded = false;
    this.collisions = {};
    
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
        if (this.bindings.left in keys) this.xv -= XV_ACCELERATION;
        if (this.bindings.right in keys) this.xv += XV_ACCELERATION;
        
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
        
        //console.log(keys);
    }
    
    this.render = function(context) {
        
        // Draw the image.
        context.drawImage(this.image, this.x, this.y);  
        
    }
    
}