var jsfxr = require('../vendor/jsfxr.min.js');
function ArcadeAudio() {
  this.sounds = {};
}
ArcadeAudio.prototype.play = function( key ) {
  var sound = this.sounds[ key ];
  window.setTimeout(function(){
    var soundData = sound.length > 1 ? sound[ m.floor( m.random() * sound.length ) ] : sound[ 0 ];
    soundData.pool[ soundData.tick ].play();
    soundData.tick < soundData.count - 1 ? soundData.tick++ : soundData.tick = 0;
  });
};

// Start custom stuff.
var audioInstance = new ArcadeAudio();
var sounds = {
  shoot: [
    // [3,0.3935,0.01,,,0.0465,,0.209,,,,,,0.5404,,,,,0.8525,,,,,0.5],
    // [3,,0.259,0.7212,0.2539,0.1365,,0.2605,,,,,,,,,,,1,,,,,0.5],
    [3,,0.1039,0.7729,0.4932,0.0206,,-0.0191,,,,0.2871,0.7986,,,,,,1,,,,,0.5]
  ]
};

for(var key in sounds){
  audioInstance.sounds[ key ] = [];
  sounds[key].forEach( function( elem, index ) {
    audioInstance.sounds[ key ].push( {
      tick: 0,
      count: 5,
      pool: []
    } );
    for( var i = 0; i < 5; i++ ) {
      var audio = new Audio();
      audio.src = jsfxr( elem );
      audioInstance.sounds[ key ][ index ].pool.push( audio );
    }
  }, audioInstance );
}
module.exports = audioInstance;