module.exports = {
	init: function(){
		this.src = 'missile1';
		this.w = 10;
	},
	tick: function(delta){
		this.posInc(delta/5,0);
	}
};