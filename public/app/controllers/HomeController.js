(function() {

  var homeController = function($scope,$state,$http,$rootScope,AuthenticationService, $timeout) {
    $rootScope.userDetails = AuthenticationService.getUserCredentialsFromStorage();
  };

  homeController.$inject = ['$scope','$state','$http','$rootScope','AuthenticationService','$timeout'];

  angular.module('app').controller('homeController', homeController);

}());