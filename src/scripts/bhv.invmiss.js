module.exports = {
	kinetic: true,
	ignore: ['inv1'],
	init: function(){
		this.w = 10;
		var _this = this;
		window.setTimeout(function(){
			console.log(_this);
		},1000)
	},
	tick: function(delta){
		this.posInc(0-delta/10,0);
	}
};