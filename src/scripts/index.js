var p = require('./polar');
var Cartesian = p.cartesian;
var Polar = p.polar;
var draw = require('./canv');

// Since we're going for size, alias 'Math' to 'm' globally.
window.m = Math;

var Sprite = require('./sprite');
var sounds = require('./audio');

var Game = function(canv,opts){
	opts = opts ||{};
	var max = m.min(innerHeight,innerWidth);
	canv.width = max;
	canv.height = max;

	var planet = max/(opts.size||15);

	var ctx = canv.getContext('2d');
	var lastFrame = performance.now();

	var sprites = [];

	// Halo around the planet.
	sprites.push(new Sprite({
		src: 'halo',
		w: planet*7,
		kinetic:false
	}).pos(-planet*3.5,0));

	var player = new Sprite({
		src: 'player',
		w: planet/2.5,
		kinetic:false
	}).pos(planet*0.95,0);
	sprites.push(player);

	var touch = require('./touch');

	// Fire
	touch.click = function(){
		sprites.push(new Sprite({
			behaviour: 'missile1'
		}).pos(player.pos.r, player.pos.d));
		sounds.play('shoot');
	};

	// for(var i=0; i<10; i++){
	// 	for(var j=0; j<3; j++){
	// 		sprites.push(new Sprite({
	// 			behaviour: 'inv1',
	// 			src: 'invader',
	// 			w: planet/2.5
	// 		}).pos(j*planet/3+max/1.25,i*2*m.PI));
	// 	}
	// }

	for(var i=0; i<10; i++){
		for(var j=0; j<3; j++){
			sprites.push(new Sprite({
				behaviour: 'inv1',
				src: 'invader',
				w: planet/2.5
			}).pos(j*planet+planet*3,i*4*m.PI));
		}
	}

	ctx.translate(max/2,max/2);

	function drawWorld(delta){
		sprites = sprites.filter(function(sprite){
			sprite.draw(delta,ctx);
			if(sprite.pos.r > max){
				return false;
			}
			return !sprite.dead;
		});

		var crust = planet/4;
		draw.circle(ctx, new Polar(0,0).toCartesian(),{
			fill:'#00d400',
			stroke:'#00aa00',
			width:planet-crust/2,
			w:crust
		});
	}

	/**
	 * Explode a sprite in a most dramatic fashion.
	 * @param  {Sprite} sprite The sprite to explode
	 */
	function explodeSprite(sprite){
		sprite.dead = true;
		for(var i=0; i<5; i++){
			sprites.push(new Sprite({
				behaviour:'particle',
				kinetic: false,
				fill: m.random > 0.5 ? '#222' : '#333',
				w: planet/8,
				life: m.random()*2000+1000,
				pos: new Polar(sprite.pos.r,sprite.pos.d),
				momentum: [(m.random()-.5)/10,m.random()-0.5]
			}));
		}
		for(var i=0; i<10; i++){
			sprites.push(new Sprite({
				behaviour:'particle',
				life: m.random()*1000+1000,
				w: m.random()*(planet/8),
				pos: new Polar(sprite.pos.r,sprite.pos.d),
				momentum: [(m.random()-.5)/5,m.random()-0.5]
			}));
		}
		for(var i=0; i<10; i++){
			sprites.push(new Sprite({
				behaviour:'particle',
				kinetic: true,
				life: m.random()*1000+1000,
				pos: new Polar(sprite.pos.r,sprite.pos.d),
				momentum: [m.random(),m.random()]
			}));
		}
	}

	/**
	 * Some basic collision detection. Only does bounding boxes on a polar
	 * coord system.
	 */
	function collisionDetection(){
		sprites.forEach(function(currentSprite){
			var thisBox = currentSprite.box();
			if(currentSprite.behaviour === 'missile1'){
				var collisions = sprites.filter(function(thatSprite){
					if(thatSprite.kinetic === false || thatSprite.behaviour == currentSprite.behaviour){
						return;
					}
					var thatBox = thatSprite.box();
					return (
						(
							(thisBox[1].d < thatBox[1].d && thisBox[1].d > thatBox[0].d) &&
							(thisBox[1].r > thatBox[1].r && thisBox[1].r < thatBox[0].r)
						) || (
							(thisBox[0].d > thatBox[0].d && thisBox[0].d < thatBox[1].d) &&
							(thisBox[0].r > thatBox[1].r && thisBox[0].r < thatBox[0].r)
						)
					);
				});
				if(collisions.length){
					currentSprite.dead = true;
					collisions.forEach(explodeSprite);
				}
			}
		});
	}

	function render(){
		ctx.clearRect(-max/2,-max/2,max,max);
		var delta = performance.now() - lastFrame;

		player.posInc(0,touch.x/(max/4));
		lastFrame = performance.now();
		drawWorld(delta);
		collisionDetection();

		requestAnimationFrame(render);
	}

	requestAnimationFrame(render);

};

window.onload = function(){
	new Game(document.querySelector('#c'));
};