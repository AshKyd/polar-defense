var p = require('./polar');
var Cartesian = p.cartesian;
var Polar = p.polar;
var Sprite = require('./sprite');
var sounds = require('./audio');
var colors = require('./colors');
var ambience = require('./ambience');

var starfields = {};
var planets = {};

var Game = function(canv,opts){

    opts = opts || {};

    // Apparently this resets the previous transform. :?
    var max = canv.width;
    canv.width = max;

    opts.score = opts.score || 0;
    opts.lives = opts.lives || 3;
    opts.powerups = opts.powerups || {};

    var fps = 30;
    var fpsMin = 100;
    var fpsMax = 0;
    var fpsTotal = 0;
    var frameCount = 0;

    var planet = max/opts.level.size;
    var offset = max/15;
    var lastFrame = performance.now();

    var ctx = canv.getContext('2d');
    ctx.translate(max/2,max/2);
    var paused = false;

    var sprites = [];

    // So this is weird, but I decided halfway through I want sprites to be able
    // to spawn new sprites at will.
    Sprite.prototype.max = max;
    Sprite.prototype.planet = planet;
    function mkSprite(opts,r,d){
        var sprite = new Sprite(opts);
        if(r){
            sprite.setpos(r,d);
        }
        sprites.push(sprite);
        return sprite;
    }
    Sprite.prototype.mkSprite = mkSprite;

    var starfield,planetImg;
    if(starfields[planet]){
        starfield = starfields[planet];
        planetImg = planets[planet];
    } else {
        starfield = ambience.drawStarfield(max,max);
        starfields[planet] = starfield;

        opts.level.p.r = planet*4;
        planetImg = ambience.drawPlanet(opts.level.p);
        planets[planet] = planetImg;
    }

    var planetSprite = mkSprite({
        kinetic:false,
        img: planetImg,
        w:planet*2
    },-planet,0);


    // 1p
    var player = mkSprite({
        src: 'player',
        w: offset/2.5,
        kinetic:true
    },planet*opts.level.r,0);
    sounds.play('respawn');

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
            cullMax: true
        },player.pos.r+player.h, player.pos.d);
        if(opts.powerups.triplefire){
            mkSprite({
                behaviour: 'missile1',
                kinetic: true,
                cullMax: true
            },player.pos.r+player.h, player.pos.d+5);
            mkSprite({
                behaviour: 'missile1',
                kinetic: true,
                cullMax: true
            },player.pos.r+player.h, player.pos.d-5);
        }
        sounds.play('shoot');
    };

    var waveNum = 0;
    /**
     * Spawn a new wave of invaders.
     */
    var newGaming = false;
    function newWave(invadersRemaining){
        if(opts.level.waves == 'zen'){
            return zenWave(invadersRemaining);
        }
        var nextWave = opts.level.waves[waveNum];
        if(newGaming || (nextWave && invadersRemaining > nextWave.proceedAfter) || (!nextWave && invadersRemaining > 0)){
            return;
        }
        if(!nextWave){
            newGaming = true;
            window.setTimeout(function(){
                paused = true;
                opts.nextLevel(opts);
            },5000);
            return;
        }
        if(nextWave.flash){
            opts.flash();
        }
        if(nextWave.powerup){
            mkPowerup(nextWave.powerup);
        }
        nextWave.sprites.forEach(function(wave){
            for(var i=0; i<wave.rows; i++){
                for(var j=0; j<wave.cols; j++){
                    var conf = {};
                    for(var k in wave){
                        conf[k] = wave[k];
                    }
                    conf.behaviour = 'inv1';
                    conf.dest = j*offset+offset*conf.dest;
                    conf.w = offset/conf.w;
                    mkSprite(conf,max*wave.start+j*offset,(conf.d||0)+i*4*m.PI);
                }
            }
        });
        waveNum++;
    }

    function mkPowerup(d){
        var powerup = 'triplefire';
        if(opts.powerups[powerup]){
            powerup = '+1';
        }
        mkSprite({
            behaviour: 'powerup',
            type: powerup
        },max,d||m.random()*360);
    }

    function zenWave(invadersRemaining){
        var effectiveWaveNum = m.min(waveNum,200);
        if(invadersRemaining > effectiveWaveNum/3){
            return;
        }
        var colorKey = Object.keys(colors);

        var modifier = (effectiveWaveNum)/100;
        var cols = (10*modifier)+4;
        var rows = (5*modifier)+1+m.round(m.random());
        var color = colorKey[m.round(m.random()*(colorKey.length-1))];
        var dir = m.round(m.random()*3)-2;
        var d = m.random()*360;
        var missileInterval = 5000/((1+modifier))/(!dir?2:1);


        if(waveNum % 8 == 0){
            mkPowerup();
        }
        waveNum++;

        // Every 10 waves, spawn a boss!
        if(effectiveWaveNum%10 == 0){
            opts.flash();
            for(var i=0; i<m.min(effectiveWaveNum/20); i++){
                mkSprite({
                    behaviour:'inv1',
                    dest:offset*5,
                    w: offset/0.75,
                    src: "boss1",
                    dir: dir,
                    color: color,
                    start: 1,
                    missileInterval: missileInterval/2,
                    speedModD: 0.5,
                    speedModR: 0,
                    hp: effectiveWaveNum/16+10,
                    sound:"boom",
                    altFreqD: 20,
                    score:1000
                },max,d+i*60);
            }


            mkSprite({
                behaviour:'particle',
                kinetic: false,
                stroke:'#fff',
                text: 'lol',
                textSize:m.random()*30+30,
                w: 100,
                life: 1500,
                pos: new Polar(planet/2,m.random()*360),
                momentum: [m.random()/10,m.random()-.5]
            },max,d+180);
            return;
        }

        for(var i=0; i<cols; i++){
            var rowOffset = 5;
            for(var j=0; j<rows; j++){
                var conf = {
                    behaviour:'inv1',
                    dest:j*offset+offset*5+j,
                    w: (offset/2.5)*(1-(modifier/4)),
                    src: "i1",
                    dir: dir,
                    color: color,
                    start: 1,
                    rows:rows,
                    cols:cols,
                    // hp: 2,
                    missileInterval: missileInterval
                };
                mkSprite(conf,max+j*offset,d+i*4*m.PI+0.5);
            }
        }
    }
    newWave();

    function getStats(){
        return {
            score: opts.score,
            waveNum: waveNum,
            gameType: opts.level.waves === 'zen' ? 'zen' : 'campaign',
            levelNum: opts.levelNum,
            lives: opts.lives
        }
    }

    /**
     * Explode a sprite in a most dramatic fashion.
     * @param  {Sprite} sprite The sprite to explode
     */
    function explodeSprite(sprite,subtlety){
        if(sprite.dead || sprite.behaviour == 'particle'){
            return;
        }

        // Here's where it starts to slow down. Throttle when we're
        // looking iffy.
        var throttle = fps < 25 || sprites.length > 250 ? 2 : 10;

        var hitpoint = deHp(sprite);
        if(hitpoint && subtlety !== false){
            sounds.play('miss');
            if(hitpoint === 1){
                for(var i=0; i<throttle*2; i++){
                    mkSprite({
                        behaviour:'particle',
                        kinetic: false,
                        fill: '#fff',
                        w: 2,
                        life: m.random()*throttle*150,
                        pos: new Polar(sprite.pos.r,sprite.pos.d),
                        momentum: [(m.random()-.5)/10,(m.random()-0.5)]
                    });
                }
            }
            return;
        }
        sprite.dead = true;

        for(var i=0; i<throttle; i++){
            mkSprite({
                behaviour:'particle',
                kinetic: false,
                fill: m.random > 0.5 ? '#222' : '#333',
                w: sprite.w/4 || planet/8,
                life: m.random()*(throttle*200)+throttle*100,
                pos: new Polar(sprite.pos.r,sprite.pos.d),
                momentum: [(m.random()-.5)/10,(m.random()-0.5)]
            });
        }
        if(sprite.score){
            opts.score += sprite.score;
        }

        if(subtlety === true){
            sprite.die();
            return;
        }

        for(var i=0; i<(subtlety||throttle); i++){
            mkSprite({
                behaviour:'particle',
                life: m.random()*1000+1000*m.min(i,10),
                w: m.random()*(sprite.w/2 || planet/8),
                pos: new Polar(sprite.pos.r,sprite.pos.d),
                momentum: [(m.random()-.5)/5,(m.random()-0.5)]
            });
        }
        for(var i=0; i<(subtlety||throttle); i++){
            mkSprite({
                behaviour:'particle',
                kinetic: false,
                life: m.random()*500,
                pos: new Polar(sprite.pos.r,sprite.pos.d),
                momentum: [m.random(),m.random()]
            });
        }
        sounds.play(sprite.sound||'explode');
        if(sprite.score){
            mkSprite({
                behaviour:'particle',
                kinetic: false,
                stroke:'#fff',
                text: sprite.score,
                textSize:12,
                w: 15,
                life: 800,
                pos: sprite.pos,
                momentum: [-.01,0]
            });
        }
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

        t(function(){
            sounds.play('boom');
            opts.rumble();
            explodeSprite(mkSprite({w:planet/10},0.1,0),100);
            explodeSprite(mkSprite({w:planet/10},0.1,90),100);
            planetSprite.dead = 1;
            t(function(){
                opts.gameOver();
            },5000)
        },1000);

    }

    /**
     * Detonate a doomsday device and clear out all enemies for a certain distance
     */
    var doomsdaying = false;
    function doomsday(distance){

        if(doomsdaying){ // If already doomsdaying, don't do it again.
            return;
        } else if(!--opts.lives){ // Decrement lives counter. When it's 0, game over.
            gameover();
            return;
        }

        // Sorry, you lose all your powerups.
        opts.powerups = {};

        // Prevent doomsday happening twice at once.
        doomsdaying = 1;

        sprites.forEach(function(currentSprite,i){
            // Kill all sprites within distance
            if(currentSprite.kinetic && currentSprite.pos.r < distance){
                t(function(){
                    explodeSprite(currentSprite,false);
                }, m.max(0,(currentSprite.pos.r-planet)*2+1500));
            }
        });

        // Play some sounds. Three alerts then explosions everywhere!
        for(var i=0; i<3; i++){
            sounds.play('siren',i*500);
        }
        t(function(){
            sounds.play('boom');
            opts.rumble();
            ['☢','☠','☢','☢','☠','☢'].forEach(function(icon){
                mkSprite({
                    behaviour:'particle',
                    kinetic: false,
                    stroke:'#fff',
                    text: icon,
                    textSize:m.random()*30+30,
                    w: 100,
                    life: 1500,
                    pos: new Polar(planet/2,m.random()*360),
                    momentum: [m.random()/10,m.random()-.5]
                });
            });

        },1010);

        // Set timeout so we can start again.
        t(function(){
            doomsdaying = gameovering;
            if(opts.lives>0){
                player.dead = 0;
                sprites.push(player);
                sounds.play('respawn');
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
            // Remove any sprites that are outside of bounds
            if(!currentSprite.kinetic || currentSprite.behaviour == 'powerup'){
                return;
            }
            if(currentSprite.pos.r <= planet && currentSprite.invader){
                dead = true;
                currentSprite.die && currentSprite.die();

                // Don't count this as scoring any points.
                currentSprite.score = 0;
                return;
            }

            // Check for collisions
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
                // Check for powerups
                if(currentSprite.src == 'player' || currentSprite.behaviour == 'missile1'){
                    collisions
                        .filter(function(sprite){return sprite.behaviour == 'powerup'})
                        .forEach(function(powerup){
                            powerup.b.go.call(powerup,opts);
                            powerup.dead = true;
                            powerup.die();
                        });
                } else {
                    explodeSprite(currentSprite);
                }
                collisions.forEach(explodeSprite);
            }
        });

        if(dead || player.dead){
            doomsday(planet+max/5);
        }
    }


    /**
     * Remove a hitpoint from specified sprite.
     * If this sprite has hitpoints, subtract one and quit, providing the
     * sprite hasn't just been hit. The lastHit check is to prevent
     * explosion particles from missiles from continuing to inflict damage.
     * @return {number} 0 = dead, 1 = decremented, 2 = neither
     */
    function deHp(sprite){
        if(sprite.hp && sprite.hp > 0){
            if(typeof sprite.lastHit == 'undefined' || performance.now()-sprite.lastHit > 1000){
                sprite.lastHit = performance.now();
                sprite.hp--;
                return 1;
            } else {
                return 2;
            }
        }

        // Sprite has no hitpoints.
        return 0;
    }

    function drawWorld(delta){
        for(var i in sprites){
            sprites[i].draw(delta,ctx);
        }

        var invaders = 0;
        sprites = sprites.filter(function(currentSprite){
            if(currentSprite.dead){
                return false;
            }
            if(currentSprite.cullMax && currentSprite.pos.r > max*.75){
                currentSprite.score = 0;
                return false;
            }

            if(currentSprite.cullMin && currentSprite.pos.r < planet){
                currentSprite.score = 0;
                if(currentSprite.kinetic){
                    explodeSprite(currentSprite);
                } else {
                    if(currentSprite.behaviour == 'particle' && player.dead){
                        return true;
                    }
                    return false;
                }
            }
            // Count up our invaders.
            if(currentSprite.invader){
                invaders++;
            }
            return true;
        });

        if(!player.dead){
            newWave(invaders);
        }

        ctx.font = 'bold 20px Arial';
        ctx.fillStyle = '#fff';
        ctx.fillText("Score: "+opts.score, -max/2+10, -max/2+30);

        ctx.fillText(m.round(fps)+'fps - '+
            +m.round(fpsMin)+'fpsMin - '+m.round(fpsMax)+'fpsMax - '+sprites.length+' sprites', -max/2+10, max/2-100);


        var livesText = '';
        ctx.font = 'bold 30px Arial';
        for(var i=0;i<opts.lives;i++){
            livesText += '♥ ';
        }
        ctx.fillStyle = '#f22';
        ctx.fillText(livesText, -max/2+10, -max/2+60);


    }


    function render(){
        if(paused){
            //get out.
            return;
        }
        var x = -max/2;
        ctx.clearRect(x,x,max,max);
        ctx.drawImage(starfield, x, x)
        var delta = performance.now() - lastFrame;

        fps = (fps*9 + 1000/delta)/10;
        frameCount++;
        fpsMax = m.max(fps,fpsMax);
        fpsMin = m.min(fps,fpsMin);
        lastFrame = performance.now();

        if(touch.hStart){
            // From 0 to 6 in 1 seconds.
            var diff = m.min(6, (performance.now() - touch.hStart)/1000*6);
            player.posInc(0,touch.h*(max/1000+diff));
        } else {
            // FIXME: This mightn't work on different sized screens.
            player.posInc(0,touch.h/planet*(delta/2));
        }

        collisionDetection();
        drawWorld(delta);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);

};
module.exports = Game;