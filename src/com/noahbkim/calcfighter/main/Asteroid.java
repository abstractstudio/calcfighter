package com.noahbkim.calcfighter.main;

import java.awt.*;
import java.awt.geom.Area;
import java.util.Arrays;

/**
 * Asteroid class that serves as the player harassment. Subclasses sprite.
 * @author Noah Kim
 */
public class Asteroid extends Sprite {

	/**
	 * Create a new asteroid with the parent game engine.
	 * @param e parent engine.
	 */
	public Asteroid(Engine e) {
		super(e);
	
		/* Generate a list of x and y points. */
		int npoints = (int)(2 * Math.random()) * 2 + 6;
		int[] xpoints = new int[npoints];
		int[] ypoints = new int[npoints];
		
		/* Get some arbitrary angles and sort them. */
		double[] thetas = new double[npoints];
		for (int i = 0; i < npoints; i++) {
			thetas[i] = 2 * Math.PI * Math.random();
		}
		Arrays.sort(thetas);		
		
		/* Draw lines from random radii at each angle to make an arbitrary asteroid. */
		for (int i = 0; i < npoints; i++) {
			xpoints[i] = (int)((i % 2 == 0 ? 25 : 20) * Math.cos(thetas[i]));
			ypoints[i] = (int)((i % 2 == 0 ? 25 : 20) * Math.sin(thetas[i]));
		}

		p = new Polygon(xpoints, ypoints, npoints);		
		t = 2 * Math.PI * Math.random();
		c = Color.white;
		
		trajectory = Vector.mul(new Vector(Math.random(), Math.random()).normalize(), max);
		velocity = 2;
		max = 2;
	}
	
	/**
	 * Update the asteroid.
	 * @author Noah kim
	 */
	public void update() {
		/* Check for bullet collisions. */
		for (Bullet b : ((Game)e).getBullets()) {
			if (b.firing) {
				Area areaA = new Area(b.transform().createTransformedShape(b.p));
				areaA.intersect(new Area(transform().createTransformedShape(p)));
				if (!areaA.isEmpty()) {
					show = false;
					
					/* Check if the player has won. */
					boolean all = true;
					for (Asteroid a : ((Game)e).getAsteroids()) {
						all = all && !a.show;
					}
					if (all) {
						e.stop();
						((Game)e).getText().setText("You win! Press SPACE to restart.");
					}
				}
			}
		}
		
		super.update();
	}
	
}
