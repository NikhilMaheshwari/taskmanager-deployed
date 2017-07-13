(function () {

    var injectParams = ['$http', '$rootScope', '$window'];

    var authFactory = function ($http, $rootScope, $window) {
        var serviceBase = '/api/',
            factory = {
                loginPath: '/login',
                user: {
                    isAuthenticated: false,
                    roles: null
                }
            };

        factory.loginCheck = function () {
            return $http.get(serviceBase + 'loginCheck');
        }

        factory.logout = function () {
            return $http.get(serviceBase + 'logout').then(
                function (results) {
                    return results.data;
                }
            );
        };

        return factory;
    };

    authFactory.$inject = injectParams;

    angular.module('taskManagementApp').factory('authService', authFactory);

}());
