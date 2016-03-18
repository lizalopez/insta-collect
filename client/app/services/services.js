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

//factory for authentication
.factory('Auth', function($http, $location) {
  var auth = {};
  auth.user = { password: '' };
  auth.pass = '';

  auth.clearPassword = function() {
    auth.user.password = '';
    auth.pass = '';
  };

  auth.login = function(user) {
    return $http.post('/login', user) 
      .then(function(result) {
        console.log('Auth Login Hit');
        if (result.data) {
          console.log('Login results', result);
          console.log('Username', user.username);
          auth.getUser(user.username)
          .then(function() {
            auth.clearPassword();
            $location.path('/myAlbums');
          });
        } else {
          //stay in login page
          auth.clearPassword();
          var loginError = 'Please Try Again';
          return loginError;
        }
      })
      .catch(function(err) {
        console.log("INVALID");
        var loginError = 'Please Try Again';
        return loginError;
      });
    };

    auth.signup = function(userData) {
      auth.pass = userData.password;
      if (userData.password !== userData.confirmPassword) {
        auth.clearPassword();
        var signUpError = 'Passwords do not match';
        return signUpError;
      } else {
        
        return $http.post('/signup', userData)
        .then(function(result) {
          if (result.data) {
            //entry with username already exists in DB
            console.log('USER CREATED----', result.data);
            auth.user = result.data;
            auth.user.password = auth.pass;
            auth.login(auth.user);
            $location.path('/myAlbums');
          }
        })
        .catch(function(err) {
            auth.clearPassword();
            var signUpError = 'Username Taken';
            return signUpError;       
        })
      }
    }

    auth.getUser = function(username) {
      return $http.get('/user/'+ username)
      .then(function(result) {
        console.log('Retrieved user from db:', result.data);
        auth.user = result.data;
      })
    };

    return auth;
});

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