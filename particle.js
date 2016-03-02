function Particle(index, image, player, engine) {
	// Engine.
    this.engine = engine;
    
    // Particle info.
    this.index = index;
    this.image = image;
	this.player = player;
	this.active = true;
	
	// Position and physics.
	this.x = this.player.x;
	this.y = this.player.y;
	this.angle = Math.random() * 2 * Math.PI
	this.xv = Math.cos(this.angle) * PARTICLE_XV;
	this.yv = Math.sin(this.angle) * PARTICLE_YV;
	
	this.update = function(delta) {
		// Update position.
        this.yv += YV_GRAVITY;
		if (Math.abs(this.yv) > YV_TERMINAL) this.yv = (this.yv > 0 ? 1 : -1) * YV_TERMINAL;
		this.x += this.xv * delta;
		this.y += this.yv * delta;
		
		if (this.x + this.image.width < 0 || this.x > this.engine.canvas.width || this.y + this.image.height < 0 || this.x > this.engine.canvas.height) {
			this.active = false;
		}
	}
	
	this.render = function(context) {
		if (this.active) {
			context.drawImage(this.image, this.x, this.y);
		}
	}
}
