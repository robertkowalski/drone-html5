exports.index = function(req, res) {
  var os = require('os');

  res.render('index', { ip: os.hostname() + ':3001', title: 'html5-copter' });
};