var p = require('./polar');
var draw = require('./canv');
var Cartesian = p.cartesian;
var Polar = p.polar;
var colors = require('./colors');

var images = require('../img/');
var cache = {};

var behaviours = {
    particle: require('./bhv.particle'),
    missile1: require('./bhv.missile1'),
    inv1: require('./bhv.inv1'),
    invmiss: require('./bhv.invmiss'),
    powerup: require('./bhv.powerup'),
};

/**
 * Super simpe sprite placeholder.
 */
var Sprite = function(opts){
    var _this = this;
    for(var i in opts){
        _this[i] = opts[i];
    }
    if(opts.behaviour){
        _this.b = behaviours[_this.behaviour];
        if(_this.b.init){
            _this.b.init.call(this, opts);
        }
    }
    if(_this.src){
        _this.createImg(_this.src);
    }
};

var sp = Sprite.prototype;

sp.createImg = function(img){
    var _this = this;

    var key = img + this.color;
    if(cache[key] && cache[key].width != 0){
        _this.img = cache[key];
        _this.h = _this.img.height * (_this.w / _this.img.width);
    } else {
        _this.img = document.createElement('img');
        // Calculate the height based on the width provided.
        _this.img.onload = function(){
            _this.h = _this.img.height * (_this.w / _this.img.width);
        };
        var imgContents = images[img];
        if(_this.color){
            for(var original in colors[_this.color]){
                imgContents = imgContents.replace(new RegExp(original,'g'),colors[_this.color][original]);
            }
        }
        var uri = 'data:image/svg+xml;base64,'+btoa(unescape(encodeURIComponent(imgContents)));
        _this.img.src = uri;
        cache[key] = _this.img;
    }
};

/**
 * Set the position.
 * @param  {Number} h Height
 * @param  {Number} d Degree
 * @return {Object}   this
 */
sp.setpos = function(h,d){
    if(typeof d === 'undefined'){
        this.pos = h;
    } else {
        this.pos = new Polar(h,d);
    }
    return this;
};

/**
 * Increment a position. Useful for changing the position.
 * @param  {Number} h Height
 * @param  {Number} d Degree
 * @return {Object}   this
 */
sp.posInc = function(h,d){
    this.pos.d += d;
    this.pos.abs().r += h;
    return this;
};

/**
 * Draw this sprite somewhere.
 * @param  {Number} delta ms elapsed since last draw.
 * @param  {Object} ctx   Canvas context on which to draw.
 * @return {Object}       this
 */
sp.draw = function(delta, ctx){
    var _this = this;
    var img = _this.img;
    var xy = _this.pos.toCartesian();
    if(_this.b){
        _this.b.tick.call(_this,delta);
    }

    ctx.save();
    if(!isNaN(this.alpha)){
        ctx.globalAlpha = this.alpha;
    }
    if(img && img.width){
        ctx.translate(xy.x,xy.y);
        ctx.rotate(_this.pos.rad()+(m.PI/2));
        ctx.drawImage(
            img,
            0-_this.w/2,
            0-_this.h,
            _this.w,
            _this.h
        );
    } else {
        var cartesian = _this.pos.toCartesian();
        var textSize = _this.textSize||30;

        if(!this.text || this.outline){
            draw.circle(ctx,cartesian,{
                width: _this.w,
                fill: _this.fill || '#fff',
                stroke: _this.stroke,
                width: _this.w,
                w: _this.strokeWidth
            });
        }

        if(this.text) {
            ctx.font = textSize+'px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle'
            ctx.fillStyle = _this.stroke;
            ctx.fillText(_this.text,cartesian.x,cartesian.y);
        }
    }
    ctx.restore();

    // DEBUG STUFF. Display bounding boxes.
    // Commented out because 13k.
    // if(this.kinetic){
    //     var bb = _this.box();
    //     draw.line(ctx,[
    //         bb[0].toCartesian(),
    //         new Polar(bb[0].r,bb[1].d).toCartesian(),
    //         bb[1].toCartesian(),
    //         new Polar(bb[1].r,bb[0].d).toCartesian()
    //     ]);
    // }

    return _this;
};

/**
 * Calculate a loose bounding box.
 * This is actually super inaccurate because I didn't realise how complex it was
 * going to be, and didn't account for it.
 */
sp.box = function(){
    var _this = this;
    var dMod;
    if(!this.img){
        dMod = _this.pos.r/50;
    } else {
        dMod = _this.pos.r/25;
    }
    return [
        new Polar(this.pos.r+_this.h,this.pos.d-_this.w/dMod),
        new Polar(this.pos.r,this.pos.d+_this.w/dMod)
    ];
};

module.exports = Sprite;