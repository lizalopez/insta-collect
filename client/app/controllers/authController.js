angular.module('app.auth', ['app.services'])

.controller('AuthController', function ($scope, $http, $location, Auth) {
  // var auth = {};
  $scope.login = function (user) {
    $scope.error = '';
    if(!user) {
      var userData = {
        "username":$scope.username,
        "password":$scope.password
      };
    } 
    console.log("Attempting to login", userData);

    Auth.login(userData)
      .then(function(message){
          $scope.clearFields();
          $scope.error = message;
    })
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
      "username": $scope.signUpUsername,
      "password": $scope.signUpPassword,
      "confirmPassword": $scope.confirmPassword
    }
    console.log('User entered signup data',userData)
    // <h4> Auth.signup </h4>
    // Is a function that posts to /signup to log the user in
    Auth.signup(userData)
      .then(function(message){
        $scope.clearFields();
        $scope.signUpError = message;
      })
    };
    // auth.pass = userData.password;
    // return $http.post('/signup', userData)
    // .then(function(message){
    //   $location.path('/');
    //   if(Array.isArray(result.data)){
    //     var signUpError = "Username Taken";
    //     return signUpError;
    //   } else {
    //     auth.user = result.data;
    //     auth.user.password = auth.pass;
    //     auth.login(auth.user);
    //   }
    // })
    // .then(function(message) {
    //   $scope.clearFields();
    //   $scope.signUpError = message;
    // })
  // };
  // function that clears all the text input fields
  $scope.clearFields = function (){
    $scope.signUpUsername='';
    $scope.signUpPassword='';
    $scope.username='';
    $scope.password='';
  };
});

