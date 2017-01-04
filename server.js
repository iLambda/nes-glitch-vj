var http = require('http')
var fs = require('fs')
var path = require('path')
var url = require('url')
var log = new (require('log'))('debug')

// creating a server
http.createServer(function(req, res) {
  // read page
  var page = url.parse(req.url).pathname;
  // check for page requested
  var filename = '', type = 'text/html'
  if (page === '' || page === '/' || page === '/index.html') {
    // send index
    filename = './fixtures/index.html'
  } else if (page.match(/\/[a-zA-Z\-]+\.js/)) {
    // send main js script
    filename = './fixtures/' + path.basename(page)
  } else if (page.match(/\/[a-zA-Z\-]+\.nes/)) {
    // send main js script
    filename = './rom/' + path.basename(page)
    type = 'application/octet-stream'
  } else {
    // send 404
    res.writeHead(404)
  }

  // read the index file
  fs.readFile(filename, function(err, data) {
    // check for error
    if (err) {
      // send server error
      res.writeHead(500)
    } else {
      // send data
      res.writeHead(200, { 'Content-Type': type })
      res.end(data)
    }
  })
}).listen(1337)

// log
log.info("Server started.")
