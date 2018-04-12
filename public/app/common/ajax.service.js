(function () {
    'use strict';
    /* jshint -W064 */
    angular
        .module('app')
        .service('AjaxService', AjaxService);

    /* @ngInject*/

    function AjaxService($rootScope, $http, $q, CONFIG, CookieStorageService, ngSwal) {

        var service = {
            doGet: doGet,
            doPost: doPost,
            doPut: doPut,
            doDelete: doDelete,
            doPatch: doPatch,
            getAuthHeaders: getAuthHeaders,
        };

        return service;

        function errorObject(reason, underlyingObject) {
            return {
                reason: reason,
                underlyingObject: underlyingObject,
            };
        }

        /**
         * This will get the authentication header (token)
         */
        function getAuthHeaders() {
            var headers = {};
            var authUserCredentials = CookieStorageService.getObjectFromStorage(CONFIG.AUTH_USER_KEY);

            if (authUserCredentials) {
                var authHeader = CONFIG.API_AUTHORIZATION_PREFIX + ' ' + authUserCredentials.token;
                headers.Authorization = authHeader;
            }

            return headers;
        }

        // this will do the ajax thing
        function doRequest(url, method, urlParams, data, headers, cache, canceler, withoutLoadingBar) {
            var deferred = $q.defer();

            // default to empty string if undefine
            var apiUrl = '';

            url = apiUrl + url;
            var config = { url: url };
            config.method = method;
            
            if (urlParams) {
                config.params = urlParams;
            }

            config.data = data;
            
            var authHeaders = getAuthHeaders();

            if (headers) {
                config.headers = angular.extend(headers, authHeaders);
            } else {
                config.headers = authHeaders;
            }
            
            $http(config).
                then(function (response) {
                    var data = response.data;

                    // need to double check for api send 200 status even when server has error, eg. not authorized
                    if (data.statusCode >= 400) {
                        deferred.reject(errorObject(data.reasonPhase, data));
                    }

                    deferred.resolve(data);
                }).
                catch(function (data) {
                    var statusText = data.statusText;
                    if (data.status === 500) {
                        ngSwal.showSwangular();
                    }

                    $rootScope.loading = false;
                    deferred.reject(errorObject(statusText, { data: data }));
                });
        

            return deferred.promise;
        }

        function doGet(url, urlParams, headers, cache, canceler, withoutLoadingBar) {
            return doRequest(url, 'GET', urlParams, {}, headers, cache, canceler, withoutLoadingBar);
        }

        function doPost(url, urlParams, data, headers, canceler, withoutLoadingBar) {
            return doRequest(url, 'POST', urlParams, data, headers, null, canceler, withoutLoadingBar);
        }

        function doPut(url, urlParams, data, headers, canceler, withoutLoadingBar) {
            return doRequest(url, 'PUT', urlParams, data, headers, null, canceler, withoutLoadingBar);
        }

        function doDelete(url, urlParams, headers, canceler, withoutLoadingBar) {
            return doRequest(url, 'DELETE', urlParams, {}, headers, null, canceler, withoutLoadingBar);
        }

        function doPatch(url, urlParams, headers, withoutLoadingBar) {
            return doRequest(url, 'PATCH', urlParams, {}, headers, withoutLoadingBar);
        }
    }
})();
