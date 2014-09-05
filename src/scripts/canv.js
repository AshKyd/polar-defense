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
    },
    grad: function(ctx, opts){
        ctx.rect(0, 0, opts.r2*2, opts.r2*2);

        var g = ctx.createRadialGradient(opts.x||opts.r2, opts.x||opts.r2, opts.r1, opts.x||opts.r2, opts.x||opts.r2, opts.r2);

        g.addColorStop(0, opts.c1);
        g.addColorStop(1, opts.c2);


        ctx.fillStyle = g;
        ctx.fill();
    }
};