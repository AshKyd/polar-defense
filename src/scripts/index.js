var p = require('./polar');
var Cartesian = p.cartesian;
var Polar = p.polar;
var math = Math;

var Sprite = require('./sprite');

var Game = function(canv,opts){
	opts = opts ||{};
	var max = math.min(innerHeight,innerWidth);
	canv.width = max;
	canv.height = max;

	var planet = max/(opts.size||15);

	var ctx = canv.getContext('2d');
	var lastFrame = performance.now();

	var sprites = [];

	sprites.push(new Sprite({
		src: 'halo',
		w: planet*6,
		kinetic:false
	}).pos(-planet*3,0));

	var player = new Sprite({
		src: 'player',
		w: planet/2.5
	}).pos(planet,0);
	sprites.push(player);

	var touch = require('./touch');

	// Fire
	touch.click = function(){
		console.log('Fire!');
		sprites.push(new Sprite({
			behaviour: 'missile1'
		}).pos(player.pos.r, player.pos.d));
	};

	for(var i=0; i<10; i++){
		for(var j=0; j<3; j++){
			sprites.push(new Sprite({
				behaviour: 'inv1',
				src: 'invader',
				w: planet/2.5
			}).pos(j*planet/3+max/2,i*2*math.PI));
		}
	}

	ctx.translate(max/2,max/2);

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
			ctx.lineWidth = opts.w || 1;
			ctx.stroke();
		}
		if(opts.fill){
			ctx.fill();
		}
	}
	function drawWorld(delta){

		sprites.forEach(function(sprite){
			sprite.draw(delta,ctx);
		});

		var crust = planet/4;
		drawCircle(new Polar(0,0).toCartesian(),{
			fill:'#00d400',
			stroke:'#00aa00',
			width:planet-crust/2,
			w:crust
		});
	}

	function collisionDetection(){
		sprites.forEach(function(sprite){
			
		});
	}

	function render(){
		ctx.clearRect(-max/2,-max/2,max,max);
		var delta = performance.now() - lastFrame;

		player.posInc(0,touch.x/(max/4));
		lastFrame = performance.now();
		drawWorld(delta);

		requestAnimationFrame(render);
	}

	requestAnimationFrame(render);

};

window.onload = function(){
	new Game(document.querySelector('#c'));
};