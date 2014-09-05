var colors = ["#ffffff", "#ffe9c4", "#d4fbff"];
var images = require('../img/');
var draw = require('./canv');
function drawStarfield(w, h){
    var canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    var ctx = canvas.getContext('2d');
    var img = document.createElement('img');
    img.width = w;
    img.height = h;
    img.src = 'data:image/svg+xml;base64,'+btoa(unescape(encodeURIComponent(images.background)));
    ctx.globalAlpha = .3;
    ctx.drawImage(img,0,0,w,h);
    for(var i=0; i<w; i++){
        var x = m.random()*w;
        var y = m.random()*h;
        var r = m.random()*1;
        var color = colors[m.round(m.random()*(colors.length-1))];
        ctx.globalAlpha = m.random();
        draw.circle(ctx,{x:x,y:y},{
            width: r,
            fill: color
        });
    }
    return canvas;
}

function drawPlanet(opts){
    var mkGradient = draw.grad;
    var canvas = document.createElement('canvas');
    canvas.width = opts.r*2.4;
    canvas.height = opts.r*2.4;
    var ctx = canvas.getContext('2d');

    // Halo
    mkGradient(ctx,{
        r1: opts.r,
        r2: opts.r*1.2,
        c1: opts.h1,
        c2: opts.h2
    });

    // Translate to edge of halo.
    var offset = opts.r*1.2-opts.r;
    ctx.translate(offset, offset);

    /// Create planet outline clip
    ctx.beginPath();
    ctx.arc(opts.r, opts.r, opts.r, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.clip();

    // Fill the ocean
    mkGradient(ctx,{
        r1: 0,
        r2: opts.r,
        c1: opts.o2,
        c2: opts.o1
    });

    // Add some continents
    for(var i=0;i<opts.r; i++){
        ctx.globalAlpha = .8;
        var x = Math.random()*opts.r*2;
        var y = Math.random()*opts.r*2
        ctx.beginPath();
        ctx.arc(x, y, Math.random()*(opts.r/5), 0, 2 * Math.PI);
        ctx.fillStyle = i > opts.r/2 ? opts.c3 : opts.c2;
        ctx.fill();
    }
    ctx.globalAlpha = 1;
    // Add some atmosphere
    mkGradient(ctx,{
        r1: opts.r/2,
        r2: opts.r,
        c1: 'rgba(255,255,255,0)',
        c2: 'rgba(255,255,255,.5)'
    });


    if(!opts.radiant){
      mkGradient(ctx,{
          r1: opts.r*1.3,
          r2: opts.r*2,
          c1: 'rgba(0,0,0,0)',
          c2: 'rgba(0,0,0,.8)',
          x: -opts.r/8
      });
    }
    return canvas;
}

module.exports = {
    drawStarfield: drawStarfield,
    drawPlanet: drawPlanet
}