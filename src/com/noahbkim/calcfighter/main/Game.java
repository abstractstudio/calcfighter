package com.noahbkim.calcfighter.main;

import java.awt.Graphics2D;
import java.awt.event.KeyEvent;

import com.noahbkim.calcfighter.core.Engine;
import com.noahbkim.calcfighter.core.Sprite;
import com.noahbkim.calcfighter.core.Text;

/**
 * A superior AWT game engine subclassed as an Asteroids game. Details in Engine class.
 * 
 * Controls are:
 * - Left and right keys to turn
 * - Up key to thrust
 * - Space to start the game/fire/restart
 * 
 * Accel PS11: Asteroids
 * 9/27/2015
 */
public class Game extends Engine {

	/* Serialization. */
	private static final long serialVersionUID = 69L;
	
	/* Game objects. */
	private Sprite[] sprites;
	private Spaceship spaceship;
	private Bullet[] bullets;
	private Asteroid[] asteroids;
	private Text text;
	
	/* Game state. */
	public int state = 0;
	public static final int PREGAME = 0;
	public static final int PLAYING = 1;
	public static final int STOPPED = 2;

	/**
	 * Set up the asteroids game.
	 * @author Noah Kim
	 */
	public void setup() {
		/* Initialize the necessary sprites. */
		spaceship = new Spaceship(this);
		bullets = new Bullet[3];
		asteroids = new Asteroid[10];
		text = new Text(this);
	}

	/**
	 * Start the asteroids game.
	 * @author Noah Kim
	 */
	public void start() {
		/* Actually create the bullets and asteroids. */
		for (int i = 0; i < bullets.length; i++) bullets[i] = new Bullet(this);
		for (int i = 0; i < asteroids.length; i++) asteroids[i] = new Asteroid(this);
		
		/* Form the cumulative sprite array. */
		sprites = new Sprite[1 + bullets.length + asteroids.length + 1];
		sprites[0] = spaceship;
		System.arraycopy(bullets, 0, sprites, 1, bullets.length);
		System.arraycopy(asteroids, 0, sprites, 1 + bullets.length, asteroids.length);
		sprites[sprites.length - 1] = text;
		
		/* Reset the spaceship. */
		spaceship.reset();
		
		/* Hide the asteroids. */
		for (Asteroid a : asteroids) a.show = false;
		
		/* Set the visible text. */
		text.setText("Press SPACE to start");
	}

	/**
	 * Update the spaceship, bullets, asteroids, and text.
	 * @author Noah Kim
	 */
	public void update() {
		/* Check if alive and switch through states. */
		if (alive) {
			switch (state) {
			case (PREGAME):
				break;
			case (PLAYING):
				text.setText("");
				for (Sprite s : sprites) s.update();
				break;
			case (STOPPED):
				break;
			}
		}
	}
	
	/**
	 * Override the keyPressed method of Engine for convenience.
	 * @author Noah Kim
	 */
	public void keyPressed(KeyEvent keyEvent) {
		super.keyPressed(keyEvent);

		/* Use the space key for different things depending on the state. */
		if (key(KeyEvent.VK_SPACE)) {
			switch (state) {
			case (PREGAME):
				state = PLAYING;
				for (Asteroid a : asteroids) a.show = true;
				super.keys.remove(keyEvent.getKeyCode());
				break;
			case (PLAYING): 
				spaceship.fire();
				break;
			case (STOPPED): 
				state = PREGAME;
				start();
				break;
			}
		}
	}
	
	/**
	 * Render the spaceship, bullets, asteroids, and text.
	 * @author Noah Kim 
	 */
	public void render(Graphics2D g) {	
		if (alive) {
			for (Sprite s : sprites) s.paint(g);
		}
	}
		
	/**
	 * Stop the asteroids game.
	 * @author Noah Kim
	 */
	public void stop() {
		state = STOPPED;
	}

	/**
	 * Shut down the asteroids game.
	 * @author Noah Kim
	 */
	public void shutdown() {}
	
	/**
	 * MAIN!
	 * @param args system arguments.
	 * @author Noah Kim
	 */
	public static void main(String[] args) {
		Game d = new Game();
		d.build(600, 600);
		d.main();
	}
	
	/**
	 * Get the asteroids.
	 * @return asteroids.
	 * @author Noah Kim
	 */
	public Asteroid[] getAsteroids() {
		return asteroids;
	}
	
	/**
	 * Get the bullets.
	 * @return bullets.
	 * @author Noah Kim
	 */
	public Bullet[] getBullets() {
		return bullets;
	}
	
	/**
	 * Get the text object.
	 * @return text.
	 * @author Noah Kim
	 */
	public Text getText() {
		return text;
	}
	
	/**
	 * Get the sprites.
	 * @return sprites.
	 * @author Noah Kim
	 */
	public Sprite[] getSprites() {
		return sprites;
	}

}
