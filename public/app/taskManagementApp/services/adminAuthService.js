(function () {

    var injectParams = ['$http', '$rootScope', '$window', '$q'];

    var adminAuthFactory = function ($http, $rootScope, $window, $q) {
        var serviceBase = '/api/admin/',
            factory = {
                user: {
                    isAuthenticated: false,
                    roles: null
                }
            };

        factory.loginCheck = function () {

            var deferred = $q.defer();
            $http.post(serviceBase + 'loginCheck').
            success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).
            error(function (data, status, headers, config) {
                deferred.resolve(data);
            });
            return deferred.promise;
        }

        factory.logout = function () {
            return $http.get(serviceBase + 'logout').then(
                function (results) {
                    console.log(results);
                    return results.data;
                }
            );
        };

        factory.signup = function (data) {
            return $http.post(serviceBase + 'signup', data).then(
                function (results) {
                    return results.data;
                }
            );
        };

        factory.login = function (data) {
            return $http.post(serviceBase + 'login', data).then(
                function (results) {
                    return results.data;
                }
            );
        };

        return factory;
    };

    adminAuthFactory.$inject = injectParams;

    angular.module('taskManagementApp').factory('adminAuthService', adminAuthFactory);

}());
