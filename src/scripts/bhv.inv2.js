module.exports = {
	kinetic: true,
	init: function(){
		this.src='invader2';
	},
	tick: function(delta){
		// this.posInc(-delta/50,-delta/500);
		if(this.pos.r > this.max*.5){
			this.posInc(-delta/25,delta/150);
		} else {
			this.posInc(-delta/200,delta/100);
		}
	}
};