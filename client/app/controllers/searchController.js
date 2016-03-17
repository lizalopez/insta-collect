var searchCtrl = angular.module('searchCtrl', ['app.services']);

searchCtrl.controller('searchCtrl', function($scope, $http, geolocation) {
  $scope.startAlbum = function() {
    console.log('start album');
    

    $http.get('/images/' + $scope.hashtag)
      .success(function(data) {
        
      })
  };
})