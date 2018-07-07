var app = require('./app');
var http = require('http');

app.set('port', process.env.PORT || 3000);

var server = http.createServer(app);
server.listen(app.get('port'));
console.log('Express + Routing server listening on port ' + server.address().port);

//var server = app.listen(app.get('port'), function() {
//    console.log('Express + Routing server listening on port ' + server.address().port);
//});

