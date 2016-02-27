package com.noahbkim.calcfighter.main;

import java.awt.*;
import java.awt.event.KeyEvent;
import java.awt.geom.Area;

/**
 * Spaceship class that serves as the player. Subclasses sprite.
 * @author Noah Kim
 */
public class Spaceship extends Sprite {
	
	/**
	 * Construct a spaceship with the parent game engine.
	 * @param e parent engine. 
	 * @author Noah Kim
	 */
	public Spaceship(Engine e) {
		super(e);
		reset();
		drag = 0.1;
		max = 3;
		c = Color.white;
		
		show = true;
		
		int[] xpoints = {20, -10, 0, -10};
		int[] ypoints = {0, 14, 0, -14};
		p = new Polygon(xpoints, ypoints, 4);
	}
	
	/**
	 * Reset the spaceship to its original position.
	 * @author Noah Kim
	 */
	public void reset() {
		x = 300;
		y = 300;
		t = -Math.PI / 2;
		trajectory = new Vector();
	}

	/**
	 * Update the spaceship.
	 * @author Noah Kim
	 */
	public void update() {
		/* Check movement keys. */
		if (e.key(KeyEvent.VK_UP)) {
			velocity += 0.1;
		}
		if (e.key(KeyEvent.VK_LEFT)) {
			t -= Math.toRadians(5);
		}
		if (e.key(KeyEvent.VK_RIGHT)) {
			t += Math.toRadians(5);
		}
		
		/* Check asteroid collisions. */
		for (Asteroid a: ((Game)e).getAsteroids()) {
			if (a.show) {
				Area areaA = new Area(a.transform().createTransformedShape(a.p));
				areaA.intersect(new Area(transform().createTransformedShape(p)));
				if (!areaA.isEmpty()) {
					e.stop();
					((Game)e).getText().setText("You are DEAD. Press SPACE to reset");

				}
			}
		}
		
		/* Check bullet conditions. */
		for (Bullet b : ((Game)e).getBullets()) {
			if (b.show) {
				Area areaA = new Area(b.transform().createTransformedShape(b.p));
				areaA.intersect(new Area(transform().createTransformedShape(p)));
				if (!areaA.isEmpty()) {
					e.stop();
					((Game)e).getText().setText("You are DEAD. Press SPACE to reset");
				}
			}
		}
		
		super.update();
	}
	
	/**
	 * Fire the spaceship cannons.
	 * @author Noah Kim
	 */
	public void fire() {
		/* Find a suitable bullet and fire it. */
		Bullet[] bullets = ((Game)e).getBullets();
		for (int i = 0; i < bullets.length; i++) {
			if (!bullets[i].firing) {
				bullets[i].fire(this);
				break;
			}
		}
	}
	
}
