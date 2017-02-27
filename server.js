var http = require('http')
var fs = require('fs')
var path = require('path')
var url = require('url')
var _ = require('lodash')
var log = new (require('log'))('debug')
var spawn = require('child_process').spawn
var onExit = require('on-exit')
var keypress = require('keypress')
var sleep = require('sleep')
var ffi = require('ffi')
var ref = require('ref')
var struct = require('ref-struct')
var fs = require('fs')
var path = require('path')
var voidPtr = ref.refType(ref.types.void)
var lpdword = ref.refType(ref.types.uint32)

// filenames
var execfile = './bin/nestopia.exe'
var romfile = './rom/glitchnes.nes'

// get windows functions
var user32  = ffi.Library('user32.dll', {
  EnumWindows: ['bool', [voidPtr, 'int32']],
  GetWindowThreadProcessId: ['uint32', ['long', lpdword]],
  PostMessageW: ['int', ['long', 'uint', 'long', 'ulong']],
  PostThreadMessageW: ['int', ['ulong', 'uint', 'uint', 'int']]
});

// spawning child process
var emu = spawn(execfile, [romfile], {detached: false})
log.info("Spawning child process.")
// wait for window to open
sleep.msleep(500)
// getting hwnd
emu.hwnd = 0
var wincal = ffi.Callback('bool', ['long', 'int32'], function(hwnd, lParam) {
  var lpdwProcessId = ref.alloc(ref.types.uint32)
  var thread = user32.GetWindowThreadProcessId(hwnd, lpdwProcessId)
  if (lpdwProcessId.deref() === emu.pid) {
    emu.hwnd = hwnd
    emu.thread = thread
    return false
  }
  return true
});
user32.EnumWindows(wincal, 0)

// if child process is killed, exit program
emu.on('close', function(code, signal) {
  // log
  log.info("Child process killed. Exiting.")
  // clear launchpad
  launchpad.clear()
  // quit
  process.exit()
})
// if process is killed, kill child process and clean
process.on('exit', function(code, signal) {
  // log
  log.info("Main process killed. Exiting.")
  // clear launchpad
  launchpad.clear()
  // quit
  emu.exit()
})

// connect a new launchpad
var launchpad = require('./lib/midi-launchpad/launchpad-midi.js').connect(0, 1)
// create the button list
var buttons = _.map(new Array(9), function() { return [] })
// load from file
var map = JSON.parse(fs.readFileSync('./maps/default.json')) || {}
var buttondecls = map.buttons || []
// dock all buttons
buttondecls.forEach(buttondecl => {
  // resolve path to absolute
  buttondecl.type = path.resolve(buttondecl.type)
  // check if file exists
  if (!(fs.existsSync(buttondecl.type) && path.extname(buttondecl.type) === '.js')){
    throw "The .js file " + buttondecl.type + " doesn't exist."
  }
  // require the module
  let buttonrequired = require(buttondecl.type)
  let buttonctr = typeof buttonrequired === "function" ? buttonrequired : buttonrequired.default
  // create it
  var colordecl = buttondecl.color
  var color
  if (typeof colordecl === 'string') {
    color = { down:launchpad.colors[colordecl], up:0 }
  } else {
    color = { down:launchpad.colors[colordecl.down], up:launchpad.colors[colordecl.up] }
    if (colordecl.middle) { color.middle = launchpad.colors[colordecl.middle] }
  }
  buttons[buttondecl.position[0]][buttondecl.position[1]] = new buttonctr(launchpad, color, buttondecl.args || {});
})

// setting a global update method
launchpad.updateAll = function() {
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      if (buttons[i][j]) {
        buttons[i][j].init(launchpad.getButton(i, j))
      }
    }
  }
}

// wait for it to be ready
launchpad.on("ready", function() {
  // log
  log.info("Launchpad registered")
  // clear
  launchpad.clear()
  // init all buttons
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      if (buttons[i][j]) {
        buttons[i][j].init(launchpad.getButton(i, j))
      }
    }
  }
  // log
  log.info("Buttn map initialized")
  // button press
  launchpad.on("press", function(btn) {
    // press button at (btn.x, btn.y)
    if (buttons[btn.x][btn.y]) {
      buttons[btn.x][btn.y].pressed(btn)
    }
    // update grid
    for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
        if (buttons[i][j] && buttons[i][j].update) {
          buttons[i][j].update(launchpad.getButton(i, j))
        }
      }
    }
  })
  // button release
  launchpad.on("release", function(btn) {
    // press button at (btn.btn.x, btn.btn.y)
    if (buttons[btn.x][btn.y]) {
      buttons[btn.x][btn.y].released(btn)
    }
    // update grid
    for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
        if (buttons[i][j] && buttons[i][j].update) {
          buttons[i][j].update(launchpad.getButton(i, j))
        }
      }
    }
  })

})
