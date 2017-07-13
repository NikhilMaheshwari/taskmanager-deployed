(function () {

    var injectParams = ['$http', '$rootScope', '$q'];

    var taskFactory = function ($http, $rootScope, $q) {
        var serviceBase = '/api/',
            factory = {
                user: {
                    isAuthenticated: false,
                    roles: null
                }
            };

        factory.getUserTask = function () {
            var deferred = $q.defer();
            $http.post(serviceBase + 'task').
            success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).
            error(function (data, status, headers, config) {
                deferre.resolve(data);
            });
            return deferred.promise;
        };


        factory.createNewTask = function (data) {
            return $http.post(serviceBase + 'task/create', data).then(
                function (results) {
                    return results.data;
                });
        };

        factory.startTask = function (task_id) {
            return $http.post(serviceBase + 'task/' + task_id + '/start').then(
                function (results) {
                    return results.data;
                });
        };

        factory.endTask = function (task_id) {
            return $http.post(serviceBase + 'task/' + task_id + '/stop').then(
                function (results) {
                    return results.data;
                });
        };

        return factory;
    };

    taskFactory.$inject = injectParams;

    angular.module('taskManagementApp').factory('taskService', taskFactory);

}());
