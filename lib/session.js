// require all modules
var _ = require('lodash')
//var padctrl = require('midi-launchpad')
var NESEmulator = require("nesnes")

/*
* Session class
*/
function Session(canvas, settings) {
  // default settings
  settings = settings || {
    midiport: 0
  }

  // get midi connection
  /*var midiconnect = padctrl.connect(settings.midiport)
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
    launchpad.on('press', pressed.bind(this))
    launchpad.on('release', released.bind(this))
  }).bind(this))*/

  // initialize nes emulator
  this.emulator = new NESEmulator(canvas)
  // load it
  this.emulator.load('/glitchnes.nes', true)
  // set input to kbd
  this.emulator.input.configure(0, "keyboard", {
		"z": "a",
		"x": "b",
		"shift": "select",
		"return": "start",
		"up": "up",
		"down": "down",
		"left": "left",
		"right": "right"
	})
}

Session.prototype.bindto = function(btn) {

}

function pressed(btn) {

}

function released(btn) {

}

// exports
module.exports = Session
