(function() {

    var logoutController = function($scope,$state,$http, AuthenticationService) {
        
        function init() {
          if(AuthenticationService.getUserCredentialsFromStorage() != undefined) {
            toastr.success("You have successfully logged out");
            AuthenticationService.removeStorage();
          }
          $state.go('login');
        }

        init();
    };

    logoutController.$inject = ['$scope','$state','$http', 'AuthenticationService'];

    angular.module('app').controller('logoutController', logoutController);

}());