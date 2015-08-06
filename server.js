var express = require('express');
var app = express();

app.use(express.static('builds/develop'));
app.use(express.static('node_modules'));
app.use(express.static('src/assets'));

var server = app.listen(8080, function () {
    var port = server.address().port;
    console.log('Example app listening at http://localhost:%s', port);
});
