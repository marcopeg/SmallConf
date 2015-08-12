var path = require('path');
var livereload = require('better-livereload');
var server = livereload.createServer();
server.watch(path.join(__dirname, '..', 'builds', 'develop'));
