angular.module('app.create', ['app.services'])

.controller('CreateAlbumController', function($scope, $http, $location) {
  $scope.album = [];

  $scope.startAlbum = function() {
    if (!$scope.formData.hashtag || !$scope.formData.albumName) {
      return;
    } else {
      $scope.formCompleted = true;
      var unixTime = function(dateString) {
        var unixDate = Date.parse(dateString).getTime()/1000;
        return unixDate;
      };
      var dataToFetch = {
        hashtag: $scope.formData.hashtag, 
        starDate: 11,
        endDate: 11
        //changed for testing dataflow
        // startDate: unixTime($scope.formData.startDate),
        // endDate: unixTime($scope.formData.endDate)
      };
      var JSONformData = JSON.stringify(dataToFetch);
      console.log("JSONED DATA", JSONformData);
      $http.get('/images?hashtag=' + dataToFetch.hashtag + '&startDate='+ dataToFetch.startDate + '&endDate='+ dataToFetch.endDate) 
        .then(function(data) {
          console.log("FETCHED DATA:", data.data);
          $scope.images = data.data;
        })
        .catch(function(err) {
          console.log("Error Fetching Inital Batch Images:", err);
        })
    }
  };

  $scope.addToAlbum = function() {
    if ($scope.album.length === 0) {
      $scope.albumImage = this.item.image;
      console.log("ADDED IMAGE TO ALBUM", $scope.albumImage);
    }
    $scope.album.push(this.item);
  };

  $scope.removeFromAlbum = function() {
    var index = $scope.album.indexOf(this.image);
    $scope.album.splice(index, 1);
  };

  $scope.saveAlbum = function() {
    var albumObj = {
      name: $scope.formData.albumName,
      tag: $scope.formData.hashtag,
      images: $scope.album,
      albumImage: $scope.albumImage
    };
    var albumToSave = JSON.stringify(albumObj);
    createAlbumOnDB(albumToSave);
  };

  var createAlbumOnDB = function(albumData) {
    $http.post('/albums', albumData)
    .then(function() {
      console.log('Album created');
      $location.path('/myAlbums');
    })
    .catch(function(err) {
      console.log('Error Creating Album:', err);
    })
  };

});

var formatDate = function(d) {
  d = Number(d* 1000);
  date = new Date(d)
  var dd = date.getDate(); 
  var mm = date.getMonth()+1;
  var yyyy = date.getFullYear(); 
  if(dd<10){dd='0'+dd} 
  if(mm<10){mm='0'+mm};
  return d =  mm + '/'+ dd+'/'+ yyyy+'';
};