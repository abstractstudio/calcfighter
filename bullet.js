var XV_BULLET = 0.75;

function Bullet(player) {
    
    // Core information.
    this.x = player.x;
    this.y = player.y;
    this.direction = player.direction;
    this.player = player;
    
    // Sprite.
    this.image = new Image();
    this.ready = false;
    this.image.onload = function() { this.ready = true; }
    this.image.src = "ddx.png";
    
    if (this.direction == -1) this.x -= this.image.width + 1;
    else this.x += this.player.image.width;

    // Update.
    this.update = function(delta) {
        
        // Move in the direction.
        this.x += XV_BULLET * this.direction * delta;
    
    }
    
    // Render.
    this.render = function(context) {
        
        // Render the bullet.
        context.drawImage(this.image, this.x, this.y);
        
    }
    
    // Get the bounding box.
    this.bbox = function() {
        
        return [this.x, this.y, this.image.width, this.image.height];
        
    }
    
}
