var p = require('./polar');
var Polar = p.polar;
var colors = require('./colors');
var sounds = require('./audio');
module.exports = {
    init: function(opts){
        if(opts.type == 'triplefire'){
            this.text = '⁂';
            this.stroke = '#fce94f';
            this.fill = '#222';
            this.action = function(opts){
                opts.powerups.triplefire = 1;
            }
        }
        if(opts.type == '+1'){
            this.text = '❤';
            this.stroke = '#f22';
            this.fill = '#fff';
            this.action = function(opts){
                opts.lives++;
            }
        }

        this.kinetic = 1;
        this.dest = this.max;
        this.w = this.max/90;
        this.textSize = this.max/60;
        this.start = 1;
        this.speedModR = 2;
        this.speedModD = 2;
        this.momentum = [-.1,2];
        this.h = this.w;
        this.outline = true;
        this.strokeWidth = 5;
    },
    tick: function(delta){
        this.posInc(delta/2*this.momentum[0],delta/100*this.momentum[1]);

        this.mkSprite({
            behaviour:'particle',
            kinetic: 0,
            fill: '#fff',
            life: m.random()*500,
            pos: new Polar(this.pos.r,this.pos.d),
            momentum: [(m.random()-.5)/5,m.random()-.5],
            w: this.w/8
        });
    },
    go: function(opts){
        this.action(opts);
        sounds.play('menu');
    }
};