var direction = 0;

var exported = {
	x: 0,
	y: 0
};
module.exports = exported;

var addEventListener = function(l,fn){
	document.body.addEventListener(l,fn, false);
};

var touchStart;
addEventListener('touchstart', function(e){
	exported.x = 0;
	exported.y = 0;
	touchStart = e.targetTouches[0];
	e.preventDefault();
	return false;
});
addEventListener('touchmove', function(e){
	exported.x = e.targetTouches[0].clientX - touchStart.clientX;
	exported.y = e.targetTouches[0].clientY - touchStart.clientY;
	e.preventDefault();
	return false;
});

addEventListener('touchend', function(e){
	if(m.abs(exported.x) < 10 && m.abs(exported.y) < 10){
		exported.click();
	}
	exported.x = 0;
	exported.y = 0;
});

addEventListener('keydown',function(e){
	if(e.which == 37){
		exported.x = -800;
	}
	if(e.which == 39){
		exported.x = +800;
	}
	if(e.which == 32){
		exported.click();
	}
});

addEventListener('keyup',function(e){
	if(e.which == 37){
		exported.x += 800;
	}
	if(e.which == 39){
		exported.x -= 800;
	}
});