(function() {
    var eBayIntegrationController = function($scope,$state,$http,$rootScope,AuthenticationService, $timeout) {
    $rootScope.userDetails = AuthenticationService.getUserCredentialsFromStorage();
	
	function init(){
		if($state.url == "/marketplaces/ebay/accepted"){
			$rootScope.sessionDetails = AuthenticationService.getSessionIdFromStorage();
			AuthenticationService.getEbayToken($rootScope.sessionDetails.sessionId)
			.then(function (response){
				if (response.statusCode == 200){
					if (response.body.fetchtokenresponse.ack == "Success"){
						var tokenObj = new Object();
						tokenObj.ebay_api_user_token = response.body.fetchtokenresponse.ebayauthtoken;
						tokenObj.ebay_api_user_token_expiry = response.body.fetchtokenresponse.hardexpirationtime;
						AuthenticationService.addEbayToken(tokenObj)
						.then (function(response){
							if (response.statusCode == 200){
								toastr.success('eBay marketplace has been added successfully');
							}
						}, function (error) {
							if (error && error.reason){
								toastr.error('Unfortunately our system is down & we are currently trying to resolve the issue. Please try again soon.');
							}
						});
					}
				}
			}, function (error) {
				if (error && error.reason){
					toastr.error('Unfortunately our system is down & we are currently trying to resolve the issue. Please try again soon.');
				}
			});
		} else if ($state.url == "/marketplaces/ebay/declined"){
			
		}
	}
	
	init();
  };

  eBayIntegrationController.$inject = ['$scope','$state','$http','$rootScope','AuthenticationService','$timeout'];

  angular.module('app').controller('eBayIntegrationController', eBayIntegrationController);

}());