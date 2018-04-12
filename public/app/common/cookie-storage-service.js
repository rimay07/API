(function () {
    'use strict';

    angular
        .module('app')
        .factory('CookieStorageService', CookieStorageService);

    /* @ngInject*/
    function CookieStorageService($cookies) {

        var service = {
            setObjectInStorage: setObjectInStorage,
            getObjectFromStorage: getObjectFromStorage,
            removeObjectInStorage: removeObjectInStorage,
        };

        return service;

        //Add or update cookie storage
        function setObjectInStorage(key, value) {
            $cookies.putObject(key, value);
        }

        //Gets an object from storage
        function getObjectFromStorage(key) {
            return $cookies.getObject(key);
        }

        //Removes an object from storage
        function removeObjectInStorage(key) {
            $cookies.remove(key);
        }
    }
})();
