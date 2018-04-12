(function() {

    var loginController = function($scope,$state,$http,AuthenticationService,$rootScope, Idle) {
    	       
      $scope.isLogin = false;
    	$scope.login = function() {

        $scope.isLogin = true;
    		AuthenticationService.login($scope.user)
          .then(function (response) {
              if(response.statusCode === 200) {
                AuthenticationService.saveCredentialsToCookie(response.body);
                $scope.isLogin = false;
                $rootScope.userDetails = AuthenticationService.getUserCredentialsFromStorage();
                toastr.success('Welcome ' + $rootScope.userDetails.name);
                $state.go("home");
              }
          }, function (error){
            $scope.isLogin = false;
            if (error && error.reason){
				if(error.reason == "Bad Request"){
					toastr.error('The username or password is incorrect.');
				} else {
					toastr.error('Unfortunately our system is down & we are currently trying to resolve the issue. Please try again soon.');
				}
			}
          });
    	}

    };

	  loginController.$inject = ['$scope','$state','$http','AuthenticationService','$rootScope', 'Idle'];

    angular.module('app').controller('loginController', loginController);

}());
