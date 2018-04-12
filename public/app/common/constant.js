(function () {
    'use strict';

    angular
        .module('app')
        .constant('USER_FORMATS', {
            //Regex source http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
            EMAIL_REGEX: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,
            NUMBER_REGEX: /^\d+$/,
            DATE: 'DD-MMM-YYYY',
        })
        .constant('CONFIG', {
            AUTH_USER_KEY: 'authUser',
			AUTH_SESSION_ID: 'sessID',
            API_REFRESH_TOKEN_KEY: 'api-refresh-key',
            API_AUTHORIZATION_PREFIX: 'Bearer',
        }).constant("URLS", {
            "API_SERVER":"/"
        }).constant("MESSAGES", {
            "INFO_AUTO_LOGOUT":"You have been logged out due to inactivity.",
			"EBAY_DECLINED":"Unfortunately the required permission to connect with your eBay account has not been granted. Please try again. If you face this issue once more then please contact our support team."
        });
})();
