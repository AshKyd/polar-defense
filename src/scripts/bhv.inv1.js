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
		this.lastAlt = performance.now();
	},
	tick: function(delta){
		var speedModD = this.speedModD || 1;
		var speedModR = typeof this.speedModR == 'undefined' ? 1 : this.speedModR;
		var amount = this.max/60;
		var pNow = performance.now();

		if(this.altFreqD && pNow-this.lastAlt > this.altFreqD*1000){
			this.dir = this.dir == 1 ? -1 : 1;
			this.lastAlt = pNow;
		}

		if(this.pos.r > this.dest){
			this.posInc(-delta/200*amount,0);
		} else {
			this.posInc(-delta/2000*amount*speedModR,this.dir*delta/2000*amount*speedModD);

			// Create a missile.
			if(!lastMissile || (m.random()>0.9 && this.pos.r < this.max && pNow - lastMissile > (this.missileInterval || 5000))){
				sounds.play('shoot');
				lastMissile = pNow;

				this.mkSprite({
					behaviour: 'invmiss',
					cull:1
				},this.pos.r, this.pos.d);

			}
		}
	}
};