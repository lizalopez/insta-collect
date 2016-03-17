angular.module('app.landing', ['app.services'])

.controller('landingController', function($scope, $http, $location) {
  $scope.getAlbums = function() {
    return $http.get('/albums') 
    .then(function(results) {
      $scope.imageResults = results.data;
    })
    .catch(function(err) {
      console.log('Error fetching created albums', err);
    })
  }
});
  