var sounds = require('./audio');
module.exports = {
	kinetic: true,
	init: function(){
	},
	tick: function(delta){
		var amount = this.max/60;
		if(this.pos.r > this.dest){
			this.posInc(-delta/200*amount,0);
		} else {
			this.posInc(-delta/2000*amount,this.dir*delta/2000*amount);
			if(m.random()>0.999){
				sounds.play('shoot');
				console.log('creating invmis');

				this.mkSprite({
					behaviour: 'inv1',
					src: 'invader2',
					kinetic: false,
					dest:9999,
					cull: false,
					w: 100
				},this.pos.r-100, this.pos.d);
			}
		}
	}
};