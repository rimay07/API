(function(){

    var authenticationService = function(AjaxService, URLS, CONFIG, CookieStorageService, $rootScope) {
        var factory = {};
        
        // for hiding loading on certain requests
        var withoutLoadingBar = true;

        factory.getUserCredentialsFromStorage = function () {
            return CookieStorageService.getObjectFromStorage(CONFIG.AUTH_USER_KEY);
        }
		
		factory.getSessionIdFromStorage = function () {
            return CookieStorageService.getObjectFromStorage(CONFIG.AUTH_SESSION_ID);
        }

        factory.removeStorage = function () {
            CookieStorageService.removeObjectInStorage(CONFIG.AUTH_USER_KEY)   
        }

        factory.saveCredentialsToCookie = function (response) {

            var authUser = {
                token: response.access_token,
                expiry: response.expires_in,
                tokenType: response.token_type,
                role: response.authorities[0].authority,
                firstName : response.first_name,
                lastName : response.last_name,
                name : response.first_name + " " + response.last_name,
                userName : response.username,
                email : response.email,
                timeoutInterval : response.timeoutInterval,
				eBayApiRuName : response.eBayApiRuName,
				apiEbaySigninPath : response.apiEbaySigninPath
            };

            // save authentication credentials in cookie
            CookieStorageService.setObjectInStorage(CONFIG.AUTH_USER_KEY, authUser);
        }
		
		factory.saveSessionIdToCookie = function(id){
			var sessID = {
				sessionId: id
			};
			
            CookieStorageService.setObjectInStorage(CONFIG.AUTH_SESSION_ID, sessID);
	    }

        factory.login = function (credentials) {
            var url = URLS.API_SERVER+"api/token";
            return AjaxService.doPost(url, {},credentials, null, null, withoutLoadingBar);
        }
		
		factory.addEbayIntegration = function(){
			var url = URLS.API_SERVER+"integrations/ebay/new";
            return AjaxService.doPost(url, {},null, null, null, withoutLoadingBar);
		}
		
		factory.getEbayToken = function(sessId){
			var data = new Object();
			data.id = sessId;
			var url = URLS.API_SERVER+"marketplaces/ebay/accepted";
            return AjaxService.doPost(url, {},data, null, null, withoutLoadingBar);
		}
		
		factory.addEbayToken = function(token){
			var url = URLS.API_SERVER+"integrations/ebay";
            return AjaxService.doPost(url, {},token, null, null, withoutLoadingBar);
		}
		
		factory.removeIntegration = function(id){
			var data = new Object();
			data.id = id;
			var url = URLS.API_SERVER+"integrations/ebay/id";
			return AjaxService.doPut(url, {},data, null, null, withoutLoadingBar);
		}
		
		factory.getIntegrations = function(){
			var url = URLS.API_SERVER+"integrations";
            return AjaxService.doGet(url, {},null, null, null, withoutLoadingBar);
		}
        
        return factory;

    };

    authenticationService.$inject = ['AjaxService', 'URLS', 'CONFIG', 'CookieStorageService', '$rootScope'];

    angular.module('app').factory('AuthenticationService', authenticationService);

}());