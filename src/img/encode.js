var fs = require('fs');
var files = fs.readdirSync('.');
var pkg = {};
files.forEach(function(file){
	if(!file.match(/\.svg$/)){
		return;
	}
	var fileContents = fs.readFileSync(file,'utf8');

	// These are kinda useless so let's get rid of 'em.
	['stroke-linecap','stroke-linejoin'].forEach(function(attr){
		fileContents = fileContents.replace(new RegExp(' '+attr+'="[^"]+"','g'),'');
	});

	fileContents = fileContents.replace(/#800000/,'#800');

	pkg[file.replace('.svg','')] = fileContents//.match(/^<svg[^>]>$/);
});

fs.writeFileSync('index.js','module.exports = '+JSON.stringify(pkg));

//3.21