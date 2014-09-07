var REVOLUTION = 360;

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

/**
 * Creates a cartesian coordinate
 * @param {Integer} x
 * @param {Integer} y
 */
var CartesianCoordinate = function(x,y){
    this.x = Number(x);
    this.y = Number(y);
};

module.exports = {
    polar : PolarCoordinate,
    cartesian : CartesianCoordinate
};