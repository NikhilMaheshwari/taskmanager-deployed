(function () {

    var injectParams = ['$http', '$rootScope', '$q'];

    var taskLogFactory = function ($http, $rootScope, $q) {
        var serviceBase = '/api/',
            factory = {
                user: {
                    isAuthenticated: false,
                    roles: null
                }
            };

        factory.getTaskLog = function (task_id) {
            var deferred = $q.defer();
            $http.post(serviceBase + 'task/' + task_id + '/log').
            success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).
            error(function (data, status, headers, config) {
                deferred.resolve(data);
            });
            return deferred.promise;
        };

        factory.createNewTaskLog = function (data) {
            return $http.post(serviceBase + 'task/' + data.task_id + '/log/create', data).then(
                function (results) {
                    return results.data;
                });
        };

        factory.updateTaskLog = function (data) {
            return $http.post(serviceBase + 'task/' + data.task_id + '/log/update', data).then(
                function (results) {
                    return results.data;
                });
        };

        return factory;
    };

    taskLogFactory.$inject = injectParams;

    angular.module('taskManagementApp').factory('taskLogService', taskLogFactory);

}());
