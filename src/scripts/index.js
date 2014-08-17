var p = require('./polar');
var Cartesian = p.cartesian;
var Polar = p.polar;
var draw = require('./canv');
// Unicodes worth looking at ☢☣☠
// 
// Since we're going for size, alias 'Math' to 'm' globally.
window.m = Math;
window.t = setTimeout;

var Sprite = require('./sprite');
var sounds = require('./audio');

var Game = function(canv,opts){
	opts = opts ||{};
	var max = m.min(innerHeight,innerWidth);
	canv.width = max;
	canv.height = max;

	var lives = 3;

	for(var i=0;i<4;i++){
		t(function(){
			sounds.play('spooky');
		},i*1000);
	}

	var planet = max/(opts.size||15);
	var lastFrame = performance.now();

	var ctx = canv.getContext('2d');
	ctx.translate(max/2,max/2);

	var sprites = [];

	// So this is weird, but I decided halfway through I want sprites to be able
	// to spawn new sprites at will.
	Sprite.prototype.max = max;
	function mkSprite(opts,r,d){
		var sprite = new Sprite(opts);
		if(r){
			sprite.setpos(r,d);
		}
		var before = sprites.length;
		sprites.push(sprite);
		console.log(sprites.length);
		return sprite;
	}
	Sprite.prototype.mkSprite = mkSprite;

	// Halo around the planet. Static image.
	mkSprite({
		src: 'halo',
		w: planet*12,
		kinetic:false
	},-planet*6,0);

	// 1p
	var player = mkSprite({
		src: 'player',
		w: planet/2.5,
		kinetic:true
	},planet*0.95,0);

	// Import touch stuff.
	var touch = require('./touch');
	touch.max = max;

	// Fire ur missilez!
	touch.click = function(){
		if(player.dead){
			return;
		}
		mkSprite({
			behaviour: 'missile1',
			kinetic: true,
			cull: true,
			w: planet
		},player.pos.r+player.h, player.pos.d);
		sounds.play('shoot');
	};

	for(var i=0; i<10; i++){
		for(var j=0; j<3; j++){
			mkSprite({
				behaviour: 'inv1',
				src: 'invader',
				dest: j*planet+planet*5,
				dir:1,
				w: planet/2.5
			},max+j*planet,i*4*m.PI);

			mkSprite({
				behaviour: 'inv1',
				src: 'invader2',
				dest: j*planet+planet*8,
				dir: -1,
				w: planet/2.5
			},max*1.5+j*planet,i*4*m.PI);
		}
	}

	/**
	 * Explode a sprite in a most dramatic fashion.
	 * @param  {Sprite} sprite The sprite to explode
	 */
	function explodeSprite(sprite,subtlety){
		if(sprite.dead){
			return;
		}
		sprite.dead = true;
		for(var i=0; i<5; i++){
			mkSprite({
				behaviour:'particle',
				kinetic: false,
				fill: m.random > 0.5 ? '#222' : '#333',
				w: planet/8,
				life: m.random()*2000+1000,
				pos: new Polar(sprite.pos.r,sprite.pos.d),
				momentum: [(m.random()-.5)/10,m.random()-0.5]
			});
		}
		if(subtlety){
			return;
		}
		for(var i=0; i<10; i++){
			mkSprite({
				behaviour:'particle',
				life: m.random()*1000+1000,
				w: m.random()*(planet/8),
				pos: new Polar(sprite.pos.r,sprite.pos.d),
				momentum: [(m.random()-.5)/5,m.random()-0.5]
			});
		}
		for(var i=0; i<10; i++){
			mkSprite({
				behaviour:'particle',
				kinetic: i<3,
				life: m.random()*500,
				pos: new Polar(sprite.pos.r,sprite.pos.d),
				momentum: [m.random(),m.random()]
			});
		}
		sounds.play('explode');
	}

	var gameovering = false;
	function gameover(){
		if(gameovering){
			return;
		}
		sprites = sprites.filter(function(currentSprite){
			return currentSprite.pos.r < max;
		});
		doomsdaying = 0;
		gameovering = 1;
		doomsday(max);

		// explodeSprite(); // Explode planet.

	}

	/**
	 * Detonate a doomsday device and clear out all enemies for a certain distance
	 */
	var doomsdaying = false;
	function doomsday(distance){

		if(doomsdaying){ // If already doomsdaying, don't do it again.
			return;
		} else if(!--lives){ // Decrement lives counter. When it's 0, game over.
			gameover();
			return;
		}

		// Prevent doomsday happening twice at once.
		doomsdaying = 1;
		sprites.forEach(function(currentSprite,i){
			// Kill all sprites within distance
			if(currentSprite.kinetic && currentSprite.pos.r < distance){
				t(function(){
					explodeSprite(currentSprite);
				}, m.max(0,(currentSprite.pos.r-planet)*2+1500));
			}
		});

		// Play some sounds. Three alerts then explosions everywhere!
		for(var i=0; i<10; i++){
			sounds.play(i<3 ? 'siren' : 'explode',i*500);
		}

		// Set timeout so we can start again.
		t(function(){
			doomsdaying = gameovering;
			if(lives){
				player.dead = 0;
				sprites.push(player);
			}
		},3000);
	}

	/**
	 * Some basic collision detection. Only does bounding boxes on a polar
	 * coord system.
	 */
	function collisionDetection(){

		var dead = false;

		sprites.forEach(function(currentSprite){
			if(!currentSprite.kinetic){
				return;
			}
			var thisBox = currentSprite.box();
			var collisions = sprites.filter(function(thatSprite){
				if(!thatSprite.kinetic || thatSprite.behaviour == currentSprite.behaviour){
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

			if(currentSprite.src != 'player' && currentSprite.pos.r <= planet){
				dead = true;
			}
		});

		if(dead || player.dead){
			doomsday(planet*3);
		}
	}

	function drawWorld(delta){
		sprites = sprites.filter(function(sprite){
			sprite.draw(delta,ctx);
			if(sprite.cull && (sprite.pos.r > max*.75 || sprite.pos.r < planet/2)){
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

	function render(){
		ctx.clearRect(-max/2,-max/2,max,max);
		var delta = performance.now() - lastFrame;

		player.posInc(0,touch.h);
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