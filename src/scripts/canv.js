module.exports = {
	line: function(ctx, line, opts){
		opts = opts || {};
		ctx.strokeStyle = opts.stroke || '#fff';
		ctx.lineWidth = opts.w || 2;
	    ctx.beginPath();
	    var point=line.pop();
	    ctx.moveTo(point.x,point.y);
	    while(line.length){
	    	point = line.pop();
	    	ctx.lineTo(point.x,point.y);
	    }
	    ctx.closePath();
	    ctx.stroke();
	},
	circle: function(ctx, pos, opts){
		opts = opts || {};
		ctx.strokeStyle = opts.stroke;
		ctx.fillStyle = opts.fill;
		ctx.beginPath();
		ctx.arc(pos.x,pos.y,opts.width||10,0,m.PI*2);
		if(opts.stroke){
			ctx.lineWidth = opts.w || 1;
			ctx.stroke();
		}
		if(opts.fill){
			ctx.fill();
		}
	}
};