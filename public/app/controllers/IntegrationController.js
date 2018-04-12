(function() {
    var newContent;
    var integrationController = function($scope,$state,$http,$rootScope,AuthenticationService, $timeout) {
    $rootScope.userDetails = AuthenticationService.getUserCredentialsFromStorage();
	$scope.addEbayIntegration = function(){
        AuthenticationService.addEbayIntegration()
        .then(function (response) {
            if(response.statusCode === 200) {
				$rootScope.userDetails = AuthenticationService.getUserCredentialsFromStorage();
				AuthenticationService.saveSessionIdToCookie(response.body.getsessionidresponse.sessionid);
				window.open($rootScope.userDetails.apiEbaySigninPath + "?" + "SignIn&RuName="+ $rootScope.userDetails.eBayApiRuName + "&SessID=" + response.body.getsessionidresponse.sessionid, "_self");
            }
        }, function (error){
            if (error && error.reason){
                    toastr.error('Unfortunately our system is down & we are currently trying to resolve the issue. Please try again soon.');
            }
        });
	}
	
	$scope.removeIntegration = function(id){
		AuthenticationService.removeIntegration(id)
		.then(function (response){
			if (response.statusCode == 200){
				$window.location.href = '/integrations';
			}
		}, function (error) {
			if (error && error.reason){
                    toastr.error('Unfortunately our system is down & we are currently trying to resolve the issue. Please try again soon.');
            }
		});
	}
	
	function init(){
		AuthenticationService.getIntegrations()
		.then(function (response){
			if (response.statusCode == 200){
				$scope.content = response.body.content; 
			}
		}, function (error) {
			if (error && error.reason){
                    toastr.error('Unfortunately our system is down & we are currently trying to resolve the issue. Please try again soon.');
            }
		});
	}
	
	init();
  };

  integrationController.$inject = ['$scope','$state','$http','$rootScope','AuthenticationService','$timeout'];

  angular.module('app').controller('integrationController', integrationController);

}());