var express = require('express');
var app = express();

app.use(express.static('dist'));

var server = app.listen(8080, function() {
    var host = 'localhost';
    var port = server.address().port;

    console.log('Point your browser at: http://%s:%s', host, port);
});
