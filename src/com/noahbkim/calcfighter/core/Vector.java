package com.noahbkim.calcfighter.core;

/**
 * Very simple vector rendition. Java is terrible because it has no operator overloading.
 * @author Noah
 */
public class Vector {

	/* Self explanatory. */
	public double x;
	public double y;
	
	/**
	 * Create a 0 vector.
	 * @author Noah Kim
	 */
	public Vector() {}
	
	/**
	 * Duplicate another vector.
	 * @param v vector to copy.
	 * @author Noah kim
	 */
	public Vector(Vector v) {
		this.x = v.x;
		this.y = v.y;
	}
	
	/**
	 * Create a vector from two doubles.
	 * @param x x vector member.
	 * @param y y vector member.
	 * @author Noah Kim
	 */
	public Vector(double x, double y) {
		this.x = x;
		this.y = y;
	}
	
	/**
	 * Get the magnitude of a vector.
	 * @return the vector magnitude.
	 */
	public double magnitude() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
	
	/**
	 * Essentially limit a vector to a magnitude.
	 * @param m magnitude limit.
	 * @return a clamped vector.
	 * @author Noah Kim
	 */
	public Vector clamp(double m) {
		if (magnitude() > m) return Vector.mul(this.normalize(), m);
		else return new Vector(this);
	}
	
	/**
	 * Normalize a vector.
	 * @return a unit vector.
	 * @author Noah Kim
	 */
	public Vector normalize() {
		double m = magnitude();
		if (m == 0) return new Vector(); 
		return new Vector(this.x / m, this.y / m);
	}
	
	/**
	 * Add two vectors. Curse you Java.
	 * @param a first vector.
	 * @param b second vector.
	 * @return sum of vectors.
	 * @author Noah Kim
	 */
	public static Vector add(Vector a, Vector b) {
		return new Vector(a.x + b.x, a.y + b.y);
	}
	
	/**
	 * Multiply a vector by a constant.
	 * @param a first vector
	 * @param b scalar
	 * @return product of vector and scalar.
	 * @author Noah Kim
	 */
	public static Vector mul(Vector a, double b) {
		return new Vector(a.x * b, a.y * b);
	}

	/**
	 * String a vector.
	 * @return string form.
	 * @author Noah Kim
	 */
	public String toString() {
		return "<" + x + ", " + y + ">";
	}
	
}
