(function () {

    var injectParams = ['$http', '$rootScope', '$q'];

    var adminTaskFactory = function ($http, $rootScope, $q) {
        var serviceBase = '/api/',
            factory = {
                user: {
                    isAuthenticated: false,
                    roles: null
                }
            };

        factory.getUserTask = function () {
            var deferred = $q.defer();
            $http.post(serviceBase + 'admin/task').
            success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).
            error(function (data, status, headers, config) {
                deferred.resolve(data);
            });
            return deferred.promise;
        };


        return factory;
    };

    adminTaskFactory.$inject = injectParams;

    angular.module('taskManagementApp').factory('adminTaskService', adminTaskFactory);

}());
