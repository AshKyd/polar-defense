// Since we're going for size, alias 'Math' to 'm' globally.
window.m = Math;
window.t = setTimeout;

/**
 * Tiny shimlike bit for performance.now since Webkit mightn't have it.
 */
window.now = function(){
    if(performance.now){
        return performance.now();
    }
    return Date.now();
}

/**
 * rAF polyfill for old browsers.
 */
window.requestAnimationFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          function( callback ){
            window.setTimeout(callback, 1000 / 30);
          };
})();

/**
 * Mobile debugging like it's 1999.
 */
// window.onerror = function(a,b,c){
//     alert('Line '+c+"\n"+a);
//     return false;
// }


var doc = document;

var Game = require('./game');
var ambience = require('./ambience');
var storage = require('./storage');
var sounds;
var touch;
var canvas;
var campaign;
var message;
function showMessage(opts,cb){
    if(message){
        doc.body.removeChild(message);
    }
    message = document.createElement('div');
    message.innerHTML = '<h1>'+opts.heading+'</h1>'+opts.message;
    if(opts.dom){
        message.appendChild(opts.dom);
    }
    doc.body.appendChild(message);
    t(function(){
        message.className = 'visible '+(opts.className||'');
    });
    touch.click = function(){
        message.className = '';
        if(cb){
            cb();
        } else {
            mainMenu();
        }
        return false;
    };
    sounds.play('menu',500);
}

function gameOver(stats){
    showMessage(campaign.messages.gameOver);
}

/**
 * Flash the screen red. Useful for bosses.
 */
function flash(){
    canvas.className = 'warn';
    t(function(){
        canvas.className = '';
    },6000);
}

function rumble(){
    canvas.className = 'rumble';
    t(function(){
        canvas.className = '';
    },500);
}

function about(){
    showMessage(campaign.messages.about);
}

function toggleSound(){
    sounds.mute = !sounds.mute;
    showMessage({
        heading: 'Audio '+(sounds.mute?'muted':'enabled'),
        message: ''
    });
}
function zenMode(){
    if(!storage.cache.zen){
        return showMessage(campaign.messages.zen);
    }
    message.className = ''; // hide the menu.
    var game = new Game(canvas,{
        gameOver: gameOver,
        flash: flash,
        rumble: rumble,
        level: {
            "size":10,
            "r": 0.95,
            waves:'zen',
            p: campaign.levels[0].p
        }
    });
}

function createA(html){
    var a = doc.createElement('a');
    a.innerHTML = html;
    a.className = 'menu';
    a.href = '#';
    a.onmouseenter = function(){
        sounds.play('menuItem');
    }
    return a;
}

function levelChooser(){
    var div = doc.createElement('p');
    campaign.levels.forEach(function(level,i){
        if(!level.p){
            return;
        }
        var unlocked = i<1 || storage.cache['l'+i];
        var a = createA(level.class);

        var planetDef = level.p;
        if(!unlocked){
            // dark planet
            planetDef = {
                "o1": "#000",
                "o2": "#000",
                "c2": "#000",
                "c3": "#000",
                "h1": "rgba(255,86,132,.6)",
                "h2": "rgba(97,0,210,0)"
            }
        } else {
            a.onclick = function(){
                newGame(i);
            };
        }
        planetDef.r = 100;
        var p = ambience.drawPlanet(planetDef);
        p.className = 'menu';
        a.appendChild(p);
        div.appendChild(a);
    });
    showMessage({
        heading: 'Campaign Mode',
        message: '',
        dom: div,
        className: 'main levels'
    });
}

function mainMenu(){
    var options = {
        '☢;New Campaign': levelChooser,
        '☣;Infinite Mode': zenMode,
        '♪;Toggle Sound': toggleSound,
        'ℹ;About': about
    };
    var div = doc.createElement('p');
    for(var i in options){
        var text = i.split(';');
        var a = createA(text[1]);
        a.onclick = options[i];
        var icon = doc.createElement('span');
        icon.innerHTML = text[0];
        a.appendChild(icon);
        div.appendChild(a);
    }
    showMessage({
        heading: 'Polar Defender',
        message: '',
        dom: div,
        className: 'main'
    });
}

function newGame(i){
    var level = i;
    var touchSupport = 'ontouchstart' in document.documentElement;
    var game;

    function gameWon(stats){
        storage.set('zen',1);
        showMessage(campaign.messages.gameWon);
    }

    function nextLevel(stats){
        if(game){
            game.end = true;
        }
        storage.set('l'+level, 1);
        var thisLevel = campaign.levels[level];

        if(!thisLevel){
            return gameWon();
        }

        var extra = '';
        if(thisLevel.spielM && touchSupport){
            extra+=thisLevel.spielM;
        } else if(thisLevel.spielD) {
            extra += thisLevel.spielD;
        }

        showMessage({
            heading:thisLevel.title,
            message:thisLevel.spiel+extra
        },function(){
            game = new Game(canvas,{
                nextLevel: nextLevel,
                gameOver: gameOver,
                flash: flash,
                rumble: rumble,
                level: thisLevel,
                levelNum: level++,
                lives: stats.lives,
                score: stats.score,
                powerups: stats.powerups
            });
        });
    }
    nextLevel({
        lives:3,
        score:0
    });

}

window.onload = function(){
    if(!Array.prototype.forEach){
        return showMessage(campaign.messages.unsupported);
    }

    canvas = doc.querySelector('#c');

    var max = m.min(innerHeight,innerWidth);
    canvas.width = max;
    canvas.height = max;

    // Scale with CSS on resize.
    window.onresize = function(){
        var max = m.min(innerHeight,innerWidth)+'px';
        canvas.style.width = max;
        canvas.style.height = max;
    }

    var ctx = canvas.getContext('2d');
    ctx.drawImage(ambience.drawStarfield(max,max), 0, 0, max, max);

    // Improve perceived load performance on slow devices.
    t(function(){
        sounds = require('./audio');
        touch = require('./touch');
        campaign = require('../campaign');
        mainMenu();
    })
};