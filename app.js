
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , arDrone = require('ar-drone')
  , client  = arDrone.createClient();

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

http.createServer(app).listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});


/* WS */
var engine = require('engine.io');
var wsserver = engine.listen(3001);

wsserver.on('connection', function(socket) {
  console.log('=====> connection...');
  socket.on('message', function(data) {
    console.log('=====> sending data:  ' + data);

    client[data]();
  });
  socket.send('hi');
  socket.on('close', function () { });
});
