package com.noahbkim.calcfighter.main;

import java.awt.Polygon;

/**
 * Bullet class that serves as the player's weapon. Subclasses sprite.
 * @author Noah Kim
 */
public class Bullet extends Sprite {
	
	boolean firing;
	double fired;

	/**
	 * Create a new bullet with the parent game engine.
	 * @param e parent engine.
	 */
	public Bullet(Engine e) {
		super(e);
		
		int[] xpoints = {0, 5, 0, -5};
		int[] ypoints = {5, 0, -5, 0};
		this.p = new Polygon(xpoints, ypoints, 4);
		
		velocity = 4;
		max = 4;
	}
	
	/**
	 * Fire the bullet from a sprite.
	 * @param s sprite fired from.
	 */
	public void fire(Sprite s) {
		/* Take on direction and position of sprite. */
		t = s.t;
		x = s.x + Math.cos(t) * 25;
		y = s.y + Math.sin(t) * 25;
		
		/* Get new-ish trajectory. */
		trajectory = Vector.mul(Vector.add(s.trajectory, new Vector(Math.cos(t), Math.sin(t))).normalize(), max);
		
		firing = true;
		fired = System.currentTimeMillis();
	}
	
	/**
	 * Update the bullet.
	 * @author Noah Kim
	 */
	public void update() {
		if (firing && System.currentTimeMillis() - fired > 3*1000) {
			firing = false;
		}
		show = firing;
		super.update();
	}

}
