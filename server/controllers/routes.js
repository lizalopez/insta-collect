var controller = require('../controllers/controller.js');
var DBcontroller = require('../controllers/DBcontroller.js');


module.exports = function(app, express) {
  app.get('/user/:username', DBcontroller.accessUser);
  app.post('/login', DBcontroller.login);
  app.post('/signup', DBcontroller.signup);

  app.get('/images', controller.fetchImages);
  app.get('/album/:id', DBcontroller.accessAlbum, DBcontroller.fetchAlbumImages);
  app.get('/albums', DBcontroller.getAllAlbums);
  app.post('/albums', DBcontroller.createAlbum, DBcontroller.saveImages);

}