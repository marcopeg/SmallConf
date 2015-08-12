var path = require('path');
var express = require('express');
var compression = require('compression');

var app = express();
app.use(compression({
    level: 1
}));

if (process.env.NODE_ENV === 'release') {
    app.use(express.static(path.join(__dirname, '..', 'builds', 'release')));

    // pushstate support
    app.get('*', function(request, response){
        response.sendfile(path.join(__dirname, '..', 'builds', 'release', 'index.html'));
    });
} else {
    app.use(express.static(path.join(__dirname, '..', 'builds', 'develop')));
    app.use(express.static(path.join(__dirname, '..', 'app', 'assets')));
    app.use(express.static(path.join(__dirname, '..', 'node_modules')));

    // pushstate support
    app.get('*', function(request, response){
        response.sendfile(path.join(__dirname, '..', 'builds', 'develop', 'index.html'));
    });
};

var server = app.listen(8080, function() {
    var port = server.address().port;
    console.log('Example app listening at http://localhost:%s', port);
});
