var jsfxr = require('../vendor/jsfxr.min.js');
function ArcadeAudio() {
  this.sounds = {};
  this.mute = false;
}
ArcadeAudio.prototype.play = function( key, delay ) {
  if(this.mute){
    return;
  }
  var sound = this.sounds[ key ];
  t(function(){
    var soundData = sound.length > 1 ? sound[ m.floor( m.random() * sound.length ) ] : sound[ 0 ];
    soundData.pool[ soundData.tick ].play();
    soundData.tick < soundData.count - 1 ? soundData.tick++ : soundData.tick = 0;
  },delay);
};

// Start custom stuff.
var audioInstance = new ArcadeAudio();
var sounds = {
  shoot: [
    [3,,0.1039,0.7729,0.4932,0.0206,,-0.0191,,,,0.2871,0.7986,,,,,,1,,,,,0.5]
  ],
  explode: [
    [3,,0.5335,0.2935,0.6665,0.1265,,-0.305,,,,-0.627,,,,,,,1,,,,,0.3865],
    [3,,0.2845,0.6979,0.6065,0.0788,,,,,,-0.1731,0.7409,,,0.768,,,1,,,,,0.3865],
    [3,,0.1029,0.2024,0.4658,0.0841,,-0.2592,,,,,,,,,-0.2329,-0.1724,1,,,,,0.3865]
  ],
  siren: [
    [1,,0.3589,,0.1592,0.4013,,0.1556,,,,,,,,0.7307,,,1,,,,,0.5]
  ],
  respawn: [
    [1,,0.354,,0.3135,0.2421,,0.1683,,,,,,,,,,,1,,,,,0.2465]
  ],
  boom: [
    // Explosion rumble
    [3,0.2065,0.82,0.5779,0.6265,0.4265,,-0.4399,,,,,,,,,,,1,,,,,0.5265],
    [3,,0.1894,0.4252,0.7465,0.1312,,,,,,,,,,,0.204,-0.0023,1,,,,,0.4265]
  ],
  miss: [
    [1,,0.0406,,0.1457,0.5369,,-0.5956,,,,,,,,,,,1,,,0.2074,,0.5],
    [1,,0.0244,,0.1947,0.6505,,-0.4682,,,,,,,,,,,1,,,,,0.5]
  ],
  done: [
    [0,,0.3193,,0.2593,0.2904,,0.2419,,,,,,,,,,,1,,,,,0.4265]
  ],
  menu: [
    [0,,0.0141,0.5771,0.3626,0.6261,,,,,,0.4309,0.5938,,,,,,1,,,,,0.5]
  ],
  menuItem: [
    [0,,0.0567,0.3019,0.2113,0.4684,,,,,,0.3035,0.533,,,,,,1,,,,,0.1735]
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