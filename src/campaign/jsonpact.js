var fs = require('fs');

function parseLevel(level){
    var json = fs.readFileSync('./level'+level+'.json','utf8');

    // Minify JSON.
    json = JSON.parse(json);

    var keys = [
        'level',
        'wave',
        'rows',
        'cols',
        'src',
        'dest',
        'dir',
        'w',
        'color',
        'start',
        'missileInterval',
        'speedModR',
        'speedModD',
        'hp',
        'sound',
        'altFreqD'
    ];

    json.waves.forEach(function(wave){
        var config = [];
        wave.sprites.forEach(function(sprites){
            keys.forEach(function(key){
                config.push(sprites[key] || undefined);
            });
        });
        wave.sprites = config.join(';');
    });

    return json;
}


var levels = [];
for(var i=1;i<5;i++){
    levels.push(parseLevel(i));
}

fs.writeFileSync('levels-compiled.json',JSON.stringify(levels));