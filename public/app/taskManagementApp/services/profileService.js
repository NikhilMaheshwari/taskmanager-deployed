(function () {

    var injectParams = ['$http', '$rootScope'];

    var profileFactory = function ($http, $rootScope) {
        var serviceBase = '/api/',
            factory = {
                user: {
                    isAuthenticated: false,
                    roles: null
                }
            };

        factory.getUserProfile = function () {
            return $http.get(serviceBase + 'profile').then(
                function (results) {
                    return results.data;
                });
        };

        return factory;
    };

    profileFactory.$inject = injectParams;

    angular.module('taskManagementApp').factory('profileService', profileFactory);

}());
