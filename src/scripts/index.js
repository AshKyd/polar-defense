// Unicodes worth looking at ☢☣☠
var campaign = require('../campaign');

// Since we're going for size, alias 'Math' to 'm' globally.
window.m = Math;
window.t = setTimeout;
var doc = document;

var Game = require('./game');
var sounds = require('./audio');

var message;
function showMessage(opts,cb){
	// Import touch stuff.
	var touch = require('./touch');
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
		message.className = 'visible';
	});
	touch.click = function(){
		message.className = '';
		if(cb){
			cb();
		} else {
			mainMenu();
		}
	};
	sounds.play('menu',500);
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
	showMessage({
		heading: 'Under construction',
		message: '<p>Zen mode is under construction. &lt;construction.giv&gt;'
	});
}

function mainMenu(){
	var options = {
		'New Campaign': newGame,
		'Zen Mode': zenMode,
		'Toggle Sound': toggleSound,
		'About': about
	};
	var div = doc.createElement('p');
	for(var i in options){
		var a = doc.createElement('a');
		a.innerHTML = i;
		a.className="menu"
		a.onclick = options[i];
		div.appendChild(a);
	}
	showMessage({
		heading: 'Polar Defender',
		message: '',
		dom: div
	});
}

function newGame(){
	var canvas = doc.querySelector('#c');
	var level = 0;
	var touchSupport = 'ontouchstart' in document.documentElement;
	var game;

	function gameWon(){
		showMessage(campaign.messages.gameWon);
	}

	function gameOver(){
		showMessage(campaign.messages.gameOver);
	}

	/**
	 * Flash the screen red. Useful for bosses.
	 */
	function flash(){
		canvas.className = 'warn';
		window.setTimeout(function(){
			canvas.className = '';
		},6000);
	}

	function rumble(){
		canvas.className = 'rumble';
		window.setTimeout(function(){
			canvas.className = '';
		},500);
	}

	function nextLevel(){
		if(game){
			game.end = true;
		}

		var thisLevel = campaign.levels[level++];

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
				level: thisLevel
			});
		});
	}
	nextLevel();
	
}

window.onload = function(){

	if(!Array.prototype.forEach){
		showMessage(campaign.messages.unsupported);
		return;
	}

	mainMenu();
};