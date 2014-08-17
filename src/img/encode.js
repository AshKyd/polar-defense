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
		fileContents = fileContents.replace(new RegExp(' attr="[^"]+"'));
	});


	pkg[file.replace('.svg','')] = fileContents;
});

fs.writeFileSync('index.js','module.exports = '+JSON.stringify(pkg));