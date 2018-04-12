(function() {
    var newContent;
    var integrationController = function($scope,$state,$http,$rootScope,AuthenticationService, $timeout) {
    $rootScope.userDetails = AuthenticationService.getUserCredentialsFromStorage();
	$scope.addEbayIntegration = function(){
        AuthenticationService.addEbayIntegration()
        .then(function (response) {
            if(response.statusCode === 200) {
				$rootScope.userDetails = AuthenticationService.getUserCredentialsFromStorage();
				window.open($rootScope.userDetails.apiEbaySigninPath + "?" + "SignIn&RuName="+ $rootScope.userDetails.eBayApiRuName + "&SessID=" + response.body.getsessionidresponse.sessionid, "_self");
            }
        }, function (error){
            if (error && error.reason){
                    toastr.error('Unfortunately our system is down & we are currently trying to resolve the issue. Please try again soon.');
            }
        });
	}
	
	$scope.removeIntegration = function(id){
		alert(id);
	}
	
	function init(){
		AuthenticationService.getIntegrations()
		.then(function (response){
			if (response.statusCode == 200){
				$scope.content = response.body.content; //createTable(response.body.content);
			}
		}, function (error) {
			if (error && error.reason){
                    toastr.error('Unfortunately our system is down & we are currently trying to resolve the issue. Please try again soon.');
            }
		});
	}
	
	function createTable(content){
		console.log(content);
		let integrationArr = ["type", "name", "last_synced", "status", "action"];
		for (var a = 0; a < content.length; a++){
			var html = "";
			var x = document.createElement("tr");
			x.setAttribute("id", "myTr_" + a);
			document.getElementById("tableContent").appendChild(x);
			html = "<td>" + content[a].type + "</td>" +
				   "<td>" + content[a].name + "</td>" +
				   "<td>" + content[a].last_synced + "</td>" +
				   "<td>" + content[a].status + "</td>" +
				   "<td><button ng-click='removeIntegration(" + content[a].id + ")'>REMOVE</button></td>";
			document.getElementById("myTr_" + a).innerHTML = html;
		}
	}
	
	init();
  };

  integrationController.$inject = ['$scope','$state','$http','$rootScope','AuthenticationService','$timeout'];

  angular.module('app').controller('integrationController', integrationController);

}());