var sounds = require('./audio');
var lastMissile = 0;
var colors = {
	yellow: {
		'#f00': '#ff0',
		'#800000': '#ff9e2a'
	},
	purple: {
		'#f00': '#8800ff',
		'#800000': '#000088'
	},
	green: {
		'#f00': '#1dff00',
		'#800000': '#11aa00'
	}
};
module.exports = {
	init: function(opts){
		this.src = this.src || 'invader';
		this.score = this.score || 100;
		this.kinetic = 1;
		this.invader = 1;
		if(opts.color){
			this.colors = colors[opts.color];
		}
	},
	tick: function(delta){
		var speedModD = (this.speedModD || 1);
		var speedModR = (this.speedModR || 1);
		var amount = this.max/60;
		if(this.pos.r > this.dest){
			this.posInc(-delta/200*amount,0);
		} else {
			this.posInc(-delta/2000*amount*speedModD,this.dir*delta/2000*amount*speedModR);

			// Create a missile.
			if(!lastMissile || (m.random()>0.9 && this.pos.r < this.max && performance.now() - lastMissile > (this.missileInterval || 5000))){
				sounds.play('shoot');
				lastMissile = performance.now();

				this.mkSprite({
					behaviour: 'invmiss',
					cull:1
				},this.pos.r, this.pos.d);

			}
		}
	}
};