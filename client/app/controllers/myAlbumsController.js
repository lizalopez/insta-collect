angular.module('app.myAlbums', ['app.services'])

.controller('MyAlbumsController', function($scope, $http, $location) {
  $scope.getAlbums = function() {
    return $http.get('/albums') 
    .then(function(results) {
      $scope.imageResults = results.data;
    })
    .catch(function(err) {
      console.log('Error fetching created albums', err);
    })
  }
  $scope.getAlbums();
  $scope.viewAlbum = function (index) {
    $scope.id = $scope.imageResults[index].id
    $location.path('/album/' + $scope.id);
  };
})