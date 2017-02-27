var robot = require('robotjs')

module.exports = function (launchpad, color, args) {
  this.STATEMODE_SAVE = 0
  this.STATEMODE_LOAD = 1
  this.STATEMODE_ERASE = 2

  this.color = color
  this.launchpad = launchpad
  this.launchpad.statemode = this.STATEMODE_SAVE
  this.launchpad.states = []

  var updateLight = (function(btn) {
    // check mode
    if (this.launchpad.statemode === this.STATEMODE_SAVE) {
      btn.light(color.down.high ? color.down.high : 0)
    } else if (this.launchpad.statemode === this.STATEMODE_LOAD) {
      btn.light(color.up.high ? color.up.high : 0)
    } else if (this.launchpad.statemode === this.STATEMODE_ERASE) {
      btn.light(color.middle.high ? color.middle.high : 0)
    }
  }).bind(this)

  this.init = (function(btn) {
    // update light
    updateLight(btn);
  }).bind(this)

  this.pressed = (function(btn) {
    // save time
    this._stamp = (new Date).getTime()
    this.launchpad._oldmode = this.launchpad.statemode
    this._erasedmode = false
    this._timeout = setTimeout((function(){
      this.launchpad.statemode = this.STATEMODE_ERASE
      this.launchpad.updateAll()
      this._erasedmode = true
      updateLight(btn)
    }).bind(this), 1000);
  }).bind(this)

  this.released = (function(btn) {
    // clear
    clearTimeout(this._timeout)
    // retrieve old mode
    this.launchpad.statemode = this.launchpad._oldmode
    // if button was never put in erase mode
    if (!this._erasedmode) {
      // toggle mode
      this.launchpad.statemode = ~~!this.launchpad.statemode
    }
    // update light
    updateLight(btn);
    // clear
    this._erasedmode = false
  }).bind(this)
}
