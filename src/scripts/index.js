var p = require('./polar');
var Cartesian = p.cartesian;
var Polar = p.polar;
var math = Math;

var Sprite = require('./sprite');

var Game = function(canv,opts){
	opts = opts ||{};
	var w = window.innerWidth;
	var h = window.innerHeight;
	canv.width = w;
	canv.height = h;
	var max = math.max(w,h);
	var planet = max/(opts.size||15);

	var ctx = canv.getContext('2d');
	var time = 0;

	var player = new Sprite({
		src: 'player',
		w: planet/2.5
	}).pos(planet,0);

	var invaders = [];

	for(var i=0; i<10; i++){
		invaders.push(new Sprite({
			behaviour: 'inv1',
			src: 'invader',
			w: planet/2.5
		}).pos(i*planet+max,i*5*math.PI));
	}

	ctx.translate(w/2,h/2);

	function drawLine(line,opts){
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
	}
	function drawCircle(pos,opts){
		opts = opts || {};
		ctx.strokeStyle = opts.stroke;
		ctx.fillStyle = opts.fill;
		ctx.beginPath();
		ctx.arc(pos.x,pos.y,opts.width||10,0,math.PI*2);
		if(opts.stroke){
			ctx.stroke();
		}
		if(opts.fill){
			ctx.fill();
		}
	}
	function drawGrid(){
		var steps = 30;
		for(var i=0;i<steps; i++){
			drawLine([
				new Polar(planet, 360*(i/steps)).toCartesian(),
				new Polar(max, 360*(i/steps)).toCartesian()
			],{
				stroke: '#333'
			});
		}

		drawCircle(new Polar(0,0).toCartesian(),{
			fill:'green',
			stroke:'lightgreen',
			width:planet,
			w:5
		});

		player.posInc(0,1).draw(0,ctx);
		invaders.forEach(function(invader){
			invader.draw(0,ctx);
		});
	}
	function render(){
		ctx.clearRect(-w/2,-h/2,w,h);
		drawGrid();
		window.requestAnimationFrame(render);
	}

	window.requestAnimationFrame(render);
};

window.onload = function(){
	new Game(document.querySelector('#g'));
};