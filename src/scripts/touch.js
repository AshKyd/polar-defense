var direction = 0;

var exported = {
	x: 0,
	y: 0,
	h: 0,
	max:0
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
	var max = exported.max/2.5;
	exported.x = m.min(max,m.max(0-max,exported.x));
	exported.h = exported.x/(max/20);
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

addEventListener('mouseup', function(e){
	if(e.srcElement.nodeName === 'A'){
		return;
	}
	exported.click();
});


var firing = false;
var fireKeys = [32,27];
addEventListener('keydown',function(e){
	if(e.which == 37){
		exported.h = -6;
	}
	if(e.which == 39){
		exported.h = +6;
	}
	if(fireKeys.indexOf(e.which) != -1 && !firing){
		exported.click();
		firing = true;
	}
});

addEventListener('keyup',function(e){
	if(e.which == 37){
		exported.h += 6;
	}
	if(e.which == 39){
		exported.h -= 6;
	}
	if(fireKeys.indexOf(e.which) != -1){
		firing = false;
	}
});