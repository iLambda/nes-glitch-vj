var robot = require('robotjs')

module.exports = function (launchpad, color, args) {
  args = args || {}

  this.color = color
  this.key = args.key || ''
  this.launchpad = launchpad

  this.init = (function(btn) {}).bind(this)
  this.pressed = (function(btn) {
    // light up
    btn.light(color.down.high ? color.down.high : 0)
    // key press
    robot.keyToggle(this.key, 'down')
  }).bind(this)
  this.released = (function(btn) {
    // light down
    btn.light(color.up.high ? color.up.high : 0)
    // key press
    robot.keyToggle(this.key, 'up')
  }).bind(this)
}
