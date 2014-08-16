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
  ],
  explode: [
    [3,,0.5335,0.2935,0.6665,0.1265,,-0.305,,,,-0.627,,,,,,,1,,,,,0.3865],
    [3,,0.2845,0.6979,0.6065,0.0788,,,,,,-0.1731,0.7409,,,0.768,,,1,,,,,0.3865],
    [3,,0.1029,0.2024,0.4658,0.0841,,-0.2592,,,,,,,,,-0.2329,-0.1724,1,,,,,0.3865]
  ],
  powerup: [
    [0,,0.0524,0.3794,0.1961,0.642,,,,,,0.4749,0.6502,,,,,,1,,,,,0.3865]
  ],
  spooky: [
    [2,0.4434,0.7579,0.2864,0.2487,0.2264,,0.375,0.0102,-0.5051,-0.6651,-0.5013,-0.149,-0.9655,-0.0012,0.9662,0.1451,-0.0006,0.8608,0.0963,0.9535,0.6313,,0.5],
    [2,0.4434,0.7579,0.2864,0.2487,0.2664,,0.375,0.0102,-0.5051,-0.6651,-0.5013,-0.149,-0.9655,-0.0012,0.9662,0.1451,-0.0006,0.8608,0.0963,0.9535,0.6313,,0.5],
    [2,0.4434,0.7579,0.2864,0.2487,0.3265,,0.375,0.0102,-0.5051,-0.6651,-0.5013,-0.149,-0.9655,-0.0012,0.9662,0.1451,-0.0006,0.8608,0.0963,0.9535,0.6313,,0.5],
  ],
  siren: [
    [1,,0.3589,,0.1592,0.4013,,0.1556,,,,,,,,0.7307,,,1,,,,,0.5]
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