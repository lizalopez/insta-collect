angular.module('app.album', ['app.services'])

.controller('AlbumController', function ($scope, $http, $routeParams) {
//stores the trip postgres id
  $scope.id = $routeParams.id;

  $scope.getAlbumData = function(id) {
    return $http.get('/album/' + id)
    .then(function(results) {
      var items = results.data;
      $scope.name = items.data.name;
      $scope.tag = items.data.tag;
      $scope.images = items.items;
    })
    .catch(function(err) {
      console.log('Error getting album data:', err);
    })
  };
  $scope.getAlbumData($scope.id);
})