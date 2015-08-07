var express = require('express');
var app = express();

if (process.env.NODE_ENV === 'release') {
	app.use(express.static('builds/release'));
} else {
	app.use(express.static('builds/develop'));
	app.use(express.static('src/assets'));
	app.use(express.static('node_modules'));
};

var server = app.listen(8080, function () {
    var port = server.address().port;
    console.log('Example app listening at http://localhost:%s', port);
});
