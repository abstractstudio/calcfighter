package com.noahbkim.calcfighter.core;

import java.awt.*;
import java.awt.event.*;
import java.util.*;

/**
 * A very basic game engine. In order to use, extend this class (see com.noahbkim.asteroids.Game).
 * 
 *    +-------+
 *    | setup |
 *    +-------+
 *        v
 *    +-------+
 *    | start |--------+
 *    +-------+        |
 *        |            |
 *        +--------+   |
 *        v        |   |
 *    +--------+   |   | 
 *    | update |   |   |
 *    +--------+   |   |
 *        |        |   |
 *        +<-------+   | 
 *        v            |
 *    +------+         |
 *    | stop |<--------+
 *    +------+
 *        v
 *    +----------+
 *    | shutdown |
 *    +----------+
 * 
 * @author Noah Kim
 */

public abstract class Engine extends Canvas implements Runnable, KeyListener {
	
	private static final long serialVersionUID = 42L;
	
	/* Private GameEngine attributes */
	protected Set<Integer> keys = new HashSet<Integer>();
	private Thread thread;
	protected boolean alive;
	
	/* Graphical attributes */
	private Frame frame;
	private int bufferWidth;
    private int bufferHeight;
    private Image bufferImage;
    private Graphics bufferGraphics;
    
    /* Reference properties */
    public long lastRender;

    /** 
     * Initializer method for the GameEngine. 
     * @author Noah Kim
     */
	public Engine() {
		super();
	}
	
	/** 
	 * Main method for the GameEngine. 
	 * @author Noah Kim
	 */
	public void main() {
		setup();
		start();
		thread = new Thread(this);
		thread.start();
		alive = true;
	}
	
	/** 
	 * Quit from the game loop. 
	 * @author Noah Kim
	 */
	public void quit() {
		alive = false;
		try {thread.join();} catch (InterruptedException e) {}
		frame.dispatchEvent(new WindowEvent(frame, WindowEvent.WINDOW_CLOSING));
	}
	
	/** Occurs before the game loop starts. Any static code should be here. */
	public abstract void setup();
	
	/** Start and restart the game. Called before the update loop begins. */
	public abstract void start(); 
	
	/** Update game members. */
	public abstract void update();
	
	/** 
	 * Draw the game members.
	 * @param g canvas graphics object to draw to.
	 */
	public abstract void render(Graphics2D g);
	
	/** Ends the update loop and allows for cleanup. */
	public abstract void stop(); 
	
	/** Called at the very end of the application's runtime. For clean up and goodbyes. */
	public abstract void shutdown();
	
	/** 
	 * High level access function to check if a key is pressed. 
	 * @param key the KeyEvent key to test for.
	 * @return if the key is pressed.
	 * @author Noah Kim
	 */
	public boolean key(int key) {
		return keys.contains(key);
	}
	
	/** 
	 * Buffered paint. 
	 * @author Noah Kim
	 */
	public void paint(Graphics g) {
        if (bufferWidth != getSize().width || bufferHeight != getSize().height || bufferImage == null || bufferGraphics == null) reset();
        if (bufferGraphics != null) {
            bufferGraphics.clearRect(0, 0, bufferWidth, bufferHeight);
            render((Graphics2D)bufferGraphics);
            g.drawImage(bufferImage, 0, 0, this);
        }
		lastRender = System.currentTimeMillis();
	}
	
	/** 
	 * Reset the graphical buffer. 
	 * @author Noah Kim
	 */
	public void reset() {
        bufferWidth = getSize().width;
        bufferHeight = getSize().height;
        if (bufferGraphics != null) {
            bufferGraphics.dispose();
            bufferGraphics = null;
        }
        if (bufferImage != null) {
            bufferImage.flush();
            bufferImage = null;
        }
        System.gc();
        bufferImage = createImage(bufferWidth, bufferHeight);
        bufferGraphics = bufferImage.getGraphics();
	}
	
	/** 
	 * Build the graphical interface for the game. 
	 * @param width the width of the frame to build.
	 * @param height the height of the frame to build to.
	 * @author Noah Kim
	 */
	public void build(int width, int height){
		frame = new Frame(); 
		frame.setSize(width, height);
		frame.setBackground(Color.black);
		frame.add(this);
		this.addKeyListener(this);
		WindowAdapter d = new WindowAdapter() {
			public void windowClosing(WindowEvent e) {
				System.exit(0);
			}
		};
		frame.addWindowListener(d);
		frame.setVisible(true); 
		this.requestFocus();
	}
	
	/** 
	 * Run the threaded game loop. 
	 * @author Noah Kim
	 */
	public void run() {
		while (Thread.currentThread() == thread && alive) {
			update();			
			repaint();
			sleep(20);
		}
		shutdown();
	}
	
	/** 
	 * Thread sleep for the game loop. 
	 * @author Noah Kim
	 */
	public void sleep(long ms) {
		try {
			Thread.sleep(ms);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}
	
	/** 
	 * KeyListener override for when a key is pressed. 
	 * @author Noah Kim
	 */
	public void keyPressed(KeyEvent keyEvent) {
		keys.add(keyEvent.getKeyCode());
	}
	
	/** 
	 * KeyListener override for when a key is released.
	 * @author Noah Kim
	 */
	public void keyReleased(KeyEvent keyEvent) {
		keys.remove(keyEvent.getKeyCode());
	}

	/** 
	 * KeyListener override for when a key is typed.
	 * @author Noah Kim
	 */
	public void keyTyped(KeyEvent keyEvent) {}
	
}
