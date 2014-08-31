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

module.exports = {
    drawStarfield: drawStarfield
}