var sounds = require('./audio');
var lastMissile = 0;
var colors = {
	yellow: {
		'#F00': '#ff0',
		'#800000': '#880'
	},
	purple: {
		'#F00': '#8800ff',
		'#800000': '#000088'
	},
	green: {
		'#F00': '#1dff00',
		'#800000': '#11aa00'
	}
};
module.exports = {
	init: function(opts){
		this.src = 'invader';
		this.kinetic = 1;
		this.invader = 1;
		if(opts.color){
			this.colors = colors[opts.color];
		}
	},
	tick: function(delta){
		var amount = this.max/60;
		if(this.pos.r > this.dest){
			this.posInc(-delta/200*amount,0);
		} else {
			this.posInc(-delta/2000*amount,this.dir*delta/2000*amount);

			// Create a missile.
			if(!lastMissile || (this.pos.r < this.max && performance.now() - lastMissile > 5000)){
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