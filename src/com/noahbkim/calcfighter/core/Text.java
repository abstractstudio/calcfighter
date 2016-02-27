package com.noahbkim.calcfighter.core;

import java.awt.*;
import java.awt.geom.*;

/**
 * Text class that serves as the player's instruction. Subclasses sprite.
 * @author Noah Kim
 */
public class Text extends Sprite {
	
	/* Self explanatory. */
	private String text;
	
	/**
	 * Construct a text  with the parent game engine.
	 * @param e parent engine. 
	 * @author Noah Kim
	 */
	public Text(Engine e) {
		super(e);
	}
	
	/**
	 * Set the message of the text.
	 * @param text new text to display.
	 * @author Noah Kim
	 */
	public void setText(String text) {
		this.text = text;
	}
	
	/**
	 * Override do-nothing update.
	 * @author Noah Kim
	 */
	public void update() {}
	
	/**
	 * Paint the text object.
	 * @author Noah Kim.
	 */
	public void paint(Graphics2D g) {
        FontMetrics fm = g.getFontMetrics();
        Rectangle2D r = fm.getStringBounds(text, g);
        int x = (e.getWidth() - (int)r.getWidth()) / 2;
        int y = (e.getHeight() - (int)r.getHeight()) / 2 + fm.getAscent();
        g.setColor(Color.red);
        g.drawString(text, x, y + 100);
	}

}
