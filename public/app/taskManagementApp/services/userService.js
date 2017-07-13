(function () {

    var injectParams = ['$http', '$rootScope'];

    var userFactory = function ($http, $rootScope) {
        var serviceBase = '/api/',
            factory = {
                loginPath: '/login',
                user: {
                    isAuthenticated: false,
                    roles: null
                }
            };

        factory.getUserData = function () {
            return $http.get(serviceBase + 'home').then(
                function (results) {
                    return results;
                });
        };

        return factory;
    };

    userFactory.$inject = injectParams;

    angular.module('taskManagementApp').factory('userService', userFactory);

}());
