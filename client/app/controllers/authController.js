angular.module('app.auth', ['app.services'])

.controller('AuthController', function ($scope, $http, $location) {
  var auth = {};
  $scope.login = function (user) {
    $scope.error = '';
    if(!user) {
      var userData = {
        "username":$scope.username,
        "password":$scope.password
      };
    } 
    console.log("Attempting to login", userData);
    return $http.post('/login', user)
      .then(function(result){
        console.log("Auth Login Hit")
        if(result.data){
          console.log("login results", result)
          console.log("Username", user.username)
          $scope.getUser(user.username)
          .then(function() {
            auth.clearPassword();
            $location.path("/myAlbums");
          });
        } else {
          //stay on login
          var loginError = "Please Try Again"
          return loginError;
        }
      })
    $location.path('/');

  };
  $scope.getuser = function(username) {
    return $http.get('user/'+ username)
    .then(function(result){
      console.log("Result of getUser", result.data)
      auth.user = result.data;
    })
  }

  $scope.signup = function () {
    $scope.signUpError = '';
    var userData = {
      "username":$scope.signUpUsername,
      "password":$scope.signUpPassword
    }
    console.log('User entered signup data',userData)
    // <h4> Auth.signup </h4>
    // Is a function that posts to /signup to log the user in
    auth.pass = userData.password;
    return $http.post('/signup', userData)
    .then(function(message){
      $location.path('/');
      if(Array.isArray(result.data)){
        var signUpError = "Username Taken";
        return signUpError;
      } else {
        auth.user = result.data;
        auth.user.password = auth.pass;
        auth.login(auth.user);
      }
    })
    .then(function(message) {
      $scope.clearFields();
      $scope.signUpError = message;
    })

  $scope.clearFields = function (){
    $scope.signUpUsername='';
    $scope.signUpPassword='';
    $scope.username='';
    $scope.password='';
  };

  };

  // function that clears all the text input fields
  $scope.clearFields = function (){
    $scope.signUpUsername='';
    $scope.signUpPassword='';
    $scope.username='';
    $scope.password='';
  };
});

