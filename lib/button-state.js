var robot = require('robotjs')

module.exports = function (launchpad, color, args) {
  args = args || {}
  args.idx = args.idx || 0

  this.color = color
  this.launchpad = launchpad
  this.launchpad.states[args.idx] = false

  var updateLight = (function(btn) {
    // check mode
    if (this.launchpad.statemode == 1) {
      btn.light(this.launchpad.states[args.idx] ? color.up.high : 0)
    } else if (this.launchpad.statemode == 0) {
      btn.light(this.launchpad.states[args.idx] ? color.down.high : 0)
    } else {
      if (this.launchpad._oldmode == 0) {
        btn.light(this.launchpad.states[args.idx] ? color.up.low : 0)
      } else if (this.launchpad._oldmode == 1) {
        btn.light(this.launchpad.states[args.idx] ? color.down.low : 0)
      }
    }
  }).bind(this)

  this.init = (function(btn) {
    // update light
    updateLight(btn);
  }).bind(this)

  this.pressed = (function(btn) {
    // in save mode
    if (!this.launchpad.states[args.idx] && this.launchpad.statemode == 0) {
      this.launchpad.states[args.idx] = true
    }
    // in erase mode
    if (this.launchpad.states[args.idx] && this.launchpad.statemode == 2) {
      this.launchpad.states[args.idx] = false
    }
    // update grid
    this.launchpad.updateAll()
    // update light
    updateLight(btn);
  }).bind(this)

  this.released = (function(btn) { }).bind(this)
  this.update = (function(btn) {
    // update light
    updateLight(btn);
  }).bind(this)
}
