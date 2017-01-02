// require all modules
var _ = require('lodash')

/*
* VJCommand class
*/
function VJCommand() {
  // default settings
  settings = settings || {
    midiport: 0,
    canvas: null
  }

  // get midi connection
  var midiconnect = padctrl.connect(settings.midiport)
  // get launchpad
  midiconnect.on('ready', (function (launchpad) {
    // save launchpad
    this.launchpad = launchpad
    // turn all lights off
    this.launchpad.clear()
    // turn all lights on for 3 sec
    this.launchpad.allLight()
    setTimeout((function(){
      this.launchpad.clear()
    }).bind(this), 3000)
    // listen to launchpad
    launchpad.on('press', this._pressed.bind(this))
    launchpad.on('release', this._released.bind(this))
  }).bind(this))

  // initialize nes emulator
  this.emulator = new NESEmulator(settings.canvas)
  // load it
  this.emulator.load('../rom/glitchnes.nes')
}

VJSession.prototype.bind = function() {

}

VJSession.prototype._pressed = function(btn) {

}

VJSession.prototype._released = function(btn) {

}

// exports
module.exports = VJSession
