// Unicodes worth looking at ☢☣☠
var campaign = require('../campaign');

// Since we're going for size, alias 'Math' to 'm' globally.
window.m = Math;
window.t = setTimeout;
var doc = document;

var Game = require('./game');
var sounds = require('./audio');
var touch;
var canvas;

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

/**
 * Log an event to Loggly during the beta phase.
 * Note: remove this before release.
 */
window.log = function(key,data){
	window.console && console.log('Sending debug data',key,data);
	var src = 'http://logs-01.loggly.com/inputs/76186e9d-1441-4b41-aca0-24182e4f56cf.gif?from=pd';
	data = data || {};
	data.key = key;
	data.ua = navigator.userAgent;
	data.resX = innerWidth;
	data.resY = innerHeight;

	for(var i in data){
		src += '&'+encodeURIComponent(i)+'='+encodeURIComponent(data[i]);
	}
	var pxl = doc.createElement('img');
	pxl.src = src;
};

window.onerror = function(a,b,c){
	log('onerror',{
		message: a,
		url: b,
		lineNumber: c
	});
};

function gameOver(stats){
	showMessage(campaign.messages.gameOver);
	log('started',stats);
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
	message.className = ''; // hide the menu.
	var game = new Game(canvas,{
		gameOver: gameOver,
		flash: flash,
		rumble: rumble,
		level: {
		    "size":10,
		    "fill":"#00d400",
		    "stroke":"#00aa00",
		    "r": 0.95,
		    waves:'zen'
		}
	});
	// showMessage({
	// 	heading: 'Under construction',
	// 	message: '<p>Zen mode is under construction. &lt;construction.giv&gt;'
	// });
}

function mainMenu(){
	var options = {
		'☢;New Campaign': newGame,
		'☣;Zen Mode': zenMode,
		'🔉;Toggle Sound': toggleSound,
		'ℹ;About': about
	};
	var div = doc.createElement('p');
	for(var i in options){
		var a = doc.createElement('a');
		var text = i.split(';');
		a.innerHTML = text[1];
		a.className="menu";
		a.onclick = options[i];
		a.onmouseenter = function(){
			sounds.play('menuItem');
		}

		var icon = doc.createElement('span');
		icon.innerHTML = text[0];
		a.appendChild(icon);
		div.appendChild(a);
	}
	showMessage({
		heading: 'Polar Defender',
		message: '',
		dom: div
	});
}

function newGame(){
	var level = 0;
	var touchSupport = 'ontouchstart' in document.documentElement;
	var game;

	function gameWon(stats){
		showMessage(campaign.messages.gameWon);
		log('started',stats);
	}

	function nextLevel(stats){
		if(game){
			game.end = true;
		}

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
				score: stats.score
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
		showMessage(campaign.messages.unsupported);
		return;
	}

	touch = require('./touch');
	canvas = doc.querySelector('#c');

	mainMenu();
	log('started');
};