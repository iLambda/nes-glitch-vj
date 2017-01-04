/*
 * Resize the canvas
 */
function resize() {
  // store size
  var width, height
  // get aspect ratio
  var canvasRatio = canvas.height / canvas.width
  var windowRatio = window.innerHeight / window.innerWidth
  // check difference
  if (windowRatio < canvasRatio) {
    height = window.innerHeight
    width = height / canvasRatio
  } else {
    width = window.innerWidth
    height = width * canvasRatio
  }
  // set width
  canvas.style.width  = width + 'px'
  canvas.style.height = height + 'px'
}

/*
 * Load the page
 */
function load() {
  // get canvas and context
  canvas = document.getElementById("canvas")
  context = canvas.getContext("2d")
  // first resize the canvas
  resize()

  // create session
  session = new glitchnes.Session(canvas)
}
