var fs = require('fs');
var files = fs.readdirSync('.');
var pkg = {};
files.forEach(function(file){
	if(!file.match(/\.svg$/)){
		return;
	}
	var fileContents = fs.readFileSync(file,'utf8');

	// These are kinda useless so let's get rid of 'em.
	['stroke-linecap','stroke-linejoin','xmlns:dc','version','xmlns:cc','xmlns:rdf'].forEach(function(attr){
		fileContents = fileContents.replace(new RegExp(' '+attr+'="[^"]+"','g'),'');
	});

	// Replace some colors I've been having trouble with.
	fileContents = fileContents.replace(/#F00/,'#f00');
	fileContents = fileContents.replace(/#800000/,'#800');
	fileContents = fileContents.replace(/<metadata>.*<\/metadata>/,'');

	// Strop out floaters.
	fileContents = fileContents.replace(/(\d+\.\d+)/g,function(a){return Math.round(a);});

	pkg[file.replace('.svg','')] = fileContents//.match(/^<svg[^>]>$/);
});

fs.writeFileSync('index.js','module.exports = '+JSON.stringify(pkg));

//3.21