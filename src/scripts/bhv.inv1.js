var sounds = require('./audio');
module.exports = {
	kinetic: true,
	init: function(){
	},
	tick: function(delta){
		// this.posInc(-delta/50,-delta/500);
		if(this.pos.r > this.dest){
			this.posInc(-delta/25,this.dir*delta/150);
		} else {
			this.posInc(-delta/100,this.dir*delta/150);
			if(m.random()>0.999){
				sounds.play('shoot');
				console.log('creating invmis');

				this.mkSprite({
					behaviour: 'missile1',
					kinetic: false,
					cull: true,
					w: 100
				},this.pos.r, this.pos.d);
			}
		}
	}
};