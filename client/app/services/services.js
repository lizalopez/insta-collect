angular.module('app.services', [])

.factory('ImagesDataFactory', function($http, $location) {
  var data = {};

  $scope.createAlbumOnDB = function(albumData) {
    $http.post('/albums', albumData)
    .then(function(response) {
      console.log('Album created:', response);
      $location.path('/myAlbums');
    })
    .catch(function(err) {
      console.log('Error Creating Album:', err);
    })
  }
})

// .controller('CreateAlbumController', function($scope, $http, ImagesData) {
//   $scope.startAlbum = function() {
//     console.log('start album');

//     $http.get('/images/' + $scope.hashtag)
//       .success(function(data) {})
//   }

// })

// .factory('GalleryData', function($http, $location){
//   var data = {};
//   data.searchedTag = {};
//   data.tagCache = {};
//   data.getImages = function(tag) {
//     if (data.searchedTag[tag]) {
//       return data.tagCache[tag]
//     }
//     return $http.get('/images/' + tag)
//     .then(function(results) {
//       console.log('getImages success data: ', results)
//       data.searchedTag[tag] = true;
//       data.tagCache = results;
//         return results;
//     })
//     .catch(function(err) {
//       console.log('Error getting tag data: ', err)
//     });
//   };
//   return data;
// })