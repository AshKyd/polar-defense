var fs = require('fs');

var keys = [];

var campaign = {
    messages: require('./messages'),
    levels: []
}

function getKeys(level){
    var json = require('./level'+level+'.json');

    json.waves.forEach(function(wave){
        wave.sprites.forEach(function(sprite){
            for(key in sprite){
                if(keys.indexOf(key) == -1){
                    keys.push(key);
                }
            }
        });
    });
}

function encode(level){
    var json = require('./level'+level+'.json');

    json.waves.forEach(function(wave){
        wave.sprites = wave.sprites.map(function(sprite){
            return keys.map(function(key){
                return sprite[key] || '';
            }).join(',');
        });
    });
    return json;
}


for(var i=1;i<=6;i++){
    getKeys(i);
}

for(var i=1;i<=6;i++){
    campaign.levels.push(encode(i));
}

campaign.keys = keys;

fs.writeFileSync('levels-compiled.json',JSON.stringify(campaign,null,2));