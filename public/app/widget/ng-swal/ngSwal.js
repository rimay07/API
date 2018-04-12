(function () {
    'use strict';

    angular
        .module('app')
        .factory('ngSwal', ngSwal);

    function ngSwal(swangular) {
        var service = {
            showSwangular: showSwangular,
        };

        return service;

        function showSwangular(text) {
            swangular.swal({
                title: 'Oops!',
                text: text,//$translate.instant('COMMON.SERVER_ERROR.MSG_2'),
                type: 'error',
                showCancelButton: false,
                confirmButtonColor: '#18AF5C',
                confirmButtonText: 'OK'//$translate.instant('COMMON.OK'),
            });
        }
    }
})();
