var campaign = require('./levels-compiled');

// Extract our levels.
campaign.levels.forEach(function(level){
    level.waves.forEach(function(wave){
        wave.sprites = wave.sprites.map(function(sprites){
            sprites = sprites.split(',');
            var val = {};
            sprites.forEach(function(prop,i){
                if(prop){
                    val[campaign.keys[i]] = prop;
                }
            });
            return val;
        });
    });
});

module.exports = campaign;