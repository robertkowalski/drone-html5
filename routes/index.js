exports.index = function(req, res){
  res.render('index', { ip: '192.168.1.5:3001', title: 'html5-copter' });
};