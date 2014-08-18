module.exports = {
	init: function(opts){
		this.cull=true;
		this.w = opts.w || m.random()*3+1;
		this.h = this.w;
		var red = 128+m.round(m.random()*128);
		this.fill = opts.fill || 'rgb('+red+','+m.round(m.random()*red)+',0)';
		this.elapsed = 0;
	},
	tick: function(delta){
		// Update the position based on the momentum.
		this.posInc(delta/2*this.momentum[0],delta/100*this.momentum[1]);
		// Kill them particles once they reach the end of the specified lifetime
		this.elapsed += delta;
		if(this.elapsed > this.life){
			this.dead = true;
		}

		this.alpha = 1-m.min(this.elapsed,this.life)/this.life;
	}
};