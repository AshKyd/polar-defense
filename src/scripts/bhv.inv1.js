var sounds = require('./audio');
var lastMissile = 0;
module.exports = {
	init: function(){
		this.kinetic = 1;
		this.invader = 1;
	},
	tick: function(delta){
		var amount = this.max/60;
		if(this.pos.r > this.dest){
			this.posInc(-delta/200*amount,0);
		} else {
			this.posInc(-delta/2000*amount,this.dir*delta/2000*amount);

			if(!lastMissile || performance.now() - lastMissile > 5000){
				sounds.play('shoot');
				console.log('creating invmis');
				lastMissile = performance.now();

				this.mkSprite({
					behaviour: 'invmiss',
					cull:1
				},this.pos.r, this.pos.d);

			}
		}
	}
};