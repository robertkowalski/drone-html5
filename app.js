
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

var engine = require('engine.io');
var wsserver = engine.listen(3001);

wsserver.on('connection', function(socket) {
  var splittedData,
      json,
      takenOff;

  console.log('=====> incoming connection...');
  socket.on('message', function(data) {
    console.log('=====> data:  ' + data);
    if (data.charAt(0) == '{') {
      json = JSON.parse(data);
      takenOff && controlDroneWithOrientation(json);

    } else {
      splittedData = data.split('|');
      if (splittedData[0] == 'takeoff') {
        setTimeout(function() {
          takenOff = true;
        }, 2000);
      }
      if (splittedData && splittedData[0]) {
        client[splittedData[0]](splittedData[1]);
      }
    }

  });
  socket.on('close', function () { 
    console.log('=====> lost connection...');
  });
});

function controlDroneWithOrientation(json) {
  var speed = 0.1 * (-Math.abs(json.beta) / 10),
      rotationSpeed = 0.4 * (Math.abs(json.gamma) / 10);

  if (json.beta > 10) {
    client.front(speed);
  } else if (json.beta < -10) {
    client.back(speed);
  } else {
    client.front(0);
  }

  if (json.gamma > 10) {
    client.clockwise(rotationSpeed);
  } else if (json.gamma < -10) {
    client.counterClockwise(rotationSpeed);
  } else {
    client.clockwise(0);
  }
}