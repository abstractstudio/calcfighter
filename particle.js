function Particle(index, image, player, engine) {
	// Engine.
    this.engine = engine;
    
    // Particle info.
    this.index = index;
    this.image = image;
	this.player = player;
	this.active = true;
	
	// Position and physics.
	this.x = player.x;
	this.y = player.y;
	this.xv = Math.cos(Math.random() * 2 * Math.PI) * 5;
	this.yv = -Math.sin(Math.random() * Math.PI) * 5;
	
	this.update = function(delta) {
		// Update position.
		this.x += this.xv * delta;
		this.y += this.yv * delta;
		
		if (this.x + this.image.width < 0 || this.x > this.engine.width || this.y + this.image.height < 0 || this.x > this.engine.height) {
			this.active = false;
		}
	}
	
	this.render = function(context) {
		if (this.active) {
			this.engine.context.drawImage(this.image, this.x, this.y);
		}
	}
}
