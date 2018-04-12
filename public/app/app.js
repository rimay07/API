var app = angular.module('app',['ui.router','swangular','angular-cache','ngCookies','ngIdle']);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

    // use the HTML5 History API
    $locationProvider.html5Mode(true);

    /* Defaul Page */
    $urlRouterProvider.otherwise('login');

    $stateProvider

        .state('login', {
            url:'/login',
            templateUrl: 'app/pages/login.html',
            controller: 'loginController',
            resolve: {
                myBodyClass: function($rootScope, $state) {
                    $rootScope.bodyClass = 'login';
                }
            }
        })
        
        .state('home', {
            url:'/home',
            templateUrl: 'app/pages/home.html',
            controller: 'homeController',
            resolve: {
                myBodyClass: function($rootScope, $state){
                    $rootScope.bodyClass = 'nav-md';
                }
            },
            activetab: 'home',
            secure: true
        })
		
		.state('integrations', {
            url:'/integrations',
            templateUrl: 'app/pages/integrations.html',
            controller: 'integrationController',
            resolve: {
                myBodyClass: function($rootScope, $state){
                    $rootScope.bodyClass = 'nav-md';
                }
            },
            activetab: 'integrations',
            secure: true
        })
		
		.state('integrations/new', {
            url:'/integrations/new',
            templateUrl: 'app/pages/newIntegrations.html',
            controller: 'integrationController',
            resolve: {
                myBodyClass: function($rootScope, $state){
                    $rootScope.bodyClass = 'nav-md';
                }
            },
            activetab: 'integrations/new',
            secure: true
        })
		
		.state('integrations/ebay/new', {
            url:'/integrations/ebay/new',
            templateUrl: 'app/pages/newEbayIntegrations.html',
            controller: 'integrationController',
            resolve: {
                myBodyClass: function($rootScope, $state){
                    $rootScope.bodyClass = 'nav-md';
                }
            },
            activetab: 'integrations/ebay/new',
            secure: true
        })
		
		.state('integrations/zendesk/new', {
            url:'/integrations/zendesk/new',
            templateUrl: 'app/pages/newZendeskIntegrations.html',
            controller: 'integrationController',
            resolve: {
                myBodyClass: function($rootScope, $state){
                    $rootScope.bodyClass = 'nav-md';
                }
            },
            activetab: 'integrations/zendesk/new',
            secure: true
        })
		
		.state('marketplaces/ebay/accepted', {
            url:'/marketplaces/ebay/accepted',
            templateUrl: 'app/pages/acceptedEbayIntegrations.html',
            controller: 'eBayIntegrationController',
            resolve: {
                myBodyClass: function($rootScope, $state){
                    $rootScope.bodyClass = 'nav-md';
                }
            },
            activetab: 'marketplaces/ebay/accepted',
            secure: true
        })
		
		.state('marketplaces/ebay/declined', {
            url:'/marketplaces/ebay/declined',
            templateUrl: 'app/pages/declinedEbayIntegrations.html',
            controller: 'eBayIntegrationController',
            resolve: {
                myBodyClass: function($rootScope, $state){
                    $rootScope.bodyClass = 'nav-md';
                }
            },
            activetab: 'marketplaces/ebay/declined',
            secure: true
        })

        .state('logout', {
            url:'/logout',
            controller: 'logoutController',
            resolve: {
                myBodyClass: function($rootScope, $state){
                    $rootScope.bodyClass = 'nav-md';
                }
            },
            secure: true
        });

});

app.run(['$rootScope', '$state', '$stateParams','AuthenticationService','$templateCache','Idle','ngSwal','MESSAGES',
                 function($rootScope, $state, $stateParams, AuthenticationService, $templateCache, Idle, ngSwal,MESSAGES) {
    
    $rootScope.$state = $state;

    $rootScope.$on('IdleTimeout', function() {
        ngSwal.showSwangular(MESSAGES.INFO_AUTO_LOGOUT);
        $state.go("logout");
    });

    $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {

        $templateCache.remove(fromState.templateUrl);
        if (toState && toState.secure) {            
            
            if(toState.url !== '/logout') {
                Idle.watch();
            }
			
			if(toState.url === '/marketplaces/ebay/declined') {
                ngSwal.showSwangular(MESSAGES.EBAY_DECLINED);
            }

            var userObj = AuthenticationService.getUserCredentialsFromStorage();
            
            Idle.setTimeout(parseInt(userObj.timeoutInterval));

            if (userObj != undefined  && toState.url !== '/logout') {
                if(toState.url == '/login') {
                    $state.go("home");
                } 
                $rootScope.userDetails = userObj;
            } else if (toState.url === '/logout'){
				Idle.unwatch();
			} else if(toState.url !== '/logout') {
                $state.go("logout");
                event.preventDefault();
            }
        }

    });
}]);

app.config(['IdleProvider','TitleProvider', function(IdleProvider,TitleProvider) {
    IdleProvider.idle(500);
    IdleProvider.timeout(500);
    TitleProvider.enabled(false);
}]);