var REVOLUTION = 360;
var m = Math;

var rad2deg = function(rad){
	return rad / (m.PI/180);
};
var deg2rad = function(rad){
	return rad * (m.PI/180);
};


/**
 * Creates a polar coordinate object
 * @param {Integer} radius the radius of the line from the centre to the point.
 * @param {Integer} theta  The degree around the clock.
 */
var PolarCoordinate = function(radius,degree){
	this.r = Number(radius);
	this.d = Number(degree);
};

var pp = PolarCoordinate.prototype;

pp.toCartesian = function(){
	var x = this.r * m.cos(deg2rad(this.d));
	var y = this.r * m.sin(deg2rad(this.d));
	return new CartesianCoordinate(x,y);
};

pp.abs = function(){
	while(this.d<0){
		this.d += REVOLUTION;
	}
	while(this.d >= REVOLUTION){
		this.d -= REVOLUTION;
	}
	return this;
};

pp.rad = function(){
	return deg2rad(this.d);
}
pp.clone = function(){
	return new PolarCoordinate(this.r,this.d);
};

/**
 * Creates a cartesian coordinate
 * @param {Integer} x
 * @param {Integer} y
 */
var CartesianCoordinate = function(x,y){
	this.x = Number(x);
	this.y = Number(y);
};
var cp = CartesianCoordinate.prototype;
cp.toPolar = function(){
	var radius = m.sqrt(m.pow(this.x,2) + m.pow(this.y,2));
	var degree = rad2deg(m.atan(this.y/this.x));

	// Negative values are transposed to positive values, so 
	// counteract that here
	if(this.x < 0){
		degree += 180;
	}
	
	return new PolarCoordinate(radius,degree);
};
cp.toString = function(){
	return round(this.x) + "," + round(this.y);
};

module.exports = {
	polar : PolarCoordinate,
	cartesian : CartesianCoordinate
};