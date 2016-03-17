angular.module('app.album', ['app.services'])

.controller('AlbumController', function ($scope, $http, $routeParams) {
//stores the trip postgres id
  $scope.id = $routeParams.id;

  $scope.getAlbumData = function(id) {
    return $http.get('/album/' + id)
    .then(function(results) {
      var item = results.data;
      console.log('Album data:', results);
      $scope.name = item.data.name;
      $scope.tag = item.data.tag;
      $scope.images = item.images;
    })
    .catch(function(err) {
      console.log('Error getting album data:', err);
    })
  };
  $scope.getAlbumData($scope.id);
})