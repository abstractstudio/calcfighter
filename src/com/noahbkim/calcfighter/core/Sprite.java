package com.noahbkim.calcfighter.core;

import java.awt.*;
import java.awt.geom.AffineTransform;

/**
 * Sprite class. Sprites are superior to all other game engine worker classes.
 * @author Noah Kim
 */
public class Sprite {

	/* Location, rotation, and movement information. */
	protected double x;
	protected double y;
	protected double t;
	
	protected Vector trajectory;
	protected double velocity;
	protected double drag;
	protected double max;
	
	protected boolean show;

	/* Shape and color information. */
	protected Polygon p;
	protected Color c;
	
	/* Parent engine. */
	protected Engine e;
	
	/**
	 * Construct a sprite with the parent game engine.
	 * @param e parent engine.
	 * @author Noah Kim
	 */
	public Sprite(Engine e) { 
		this.e = e;
		trajectory = new Vector();
	}
	
	/**
	 * Get the transform of the sprite.
	 * @return sprite transform.
	 */
	public AffineTransform transform() {
		AffineTransform transform = new AffineTransform();
		transform.translate(x, y);
		transform.rotate(t);
		return transform;	
	}
	
	/**
	 * Update the sprite.
	 * @author Noah Kim
	 */
	public void update() {
		/* Manipulate the trajectory. */
		velocity = Math.min(velocity, max); // Clamp velocity
		Vector modified = Vector.mul(new Vector(Math.cos(t), Math.sin(t)).normalize(), velocity); // Get any current velocity
		trajectory = Vector.add(trajectory, modified); // Combine with trajectory
		trajectory = trajectory.clamp(max); // Limit the speed in vector
		trajectory = Vector.add(trajectory, Vector.mul(trajectory, -drag*drag)); // Drag the vector
		
		/* Move. */
		x += trajectory.x;
		y += trajectory.y;
		
		/* Fix some things. */
		velocity = Math.max(velocity - drag, 0); // Drag the actual velocity
		
		// Loop
		if (x > e.getWidth()) x = 0;
		if (x < 0) x = e.getWidth();
		if (y > e.getHeight()) y = 0;
		if (y < 0) y = e.getHeight();
	}
	
	/**
	 * Paint the sprite. 
	 * @param g graphics object to paint to.
	 * @author Noah Kim
	 */
	public void paint(Graphics2D g) {
		g.setColor(c);
		if (show) g.fill(transform().createTransformedShape(p));
	}

}
