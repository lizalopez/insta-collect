// app is called app
// app.auth loads authentication controller
// app.album loads the galleryViewController
// app.landing loads the landing controller
// app.create loads the createAlbum controller
// app.services loads all factory/service functionality
// app.myAlbums loads myAlbums controller
// ngRoute is for angular routing

angular.module('app', ['app.landing', 'app.auth', 'app.album', 'app.services', 'app.create', 'app.myAlbums', 'ngRoute', 'ui.bootstrap'])

.config(function($routeProvider) {
  $routeProvider
  .when('/', {
    controller: 'MyAlbumsController',
    templateUrl: './app/templates/myAlbums.html'
  })
  .when('/login', {
    controller: 'AuthController',
    templateUrl: './app/templates/login.html'
  })
  .when('/signup', {
    controller: 'AuthController',
    templateUrl: './app/templates/signup.html'
  })
  .when('/create', {
    controller: 'CreateAlbumController',
    templateUrl: './app/templates/createAlbum.html'
  })
  .when('/myAlbums', {
    controller: 'MyAlbumsController',
    templateUrl: './app/templates/myAlbums.html'
  })
  .when('/album/:id', {
    controller: 'AlbumController',
    templateUrl: './app/templates/albumView.html'
  })
  .when('/logout', {
    controller: 'AuthController',
    templateUrl: './app/templates/login.html'
  })
  .otherwise({redirectTo: '/'});
});
