(function () {

    var injectParams = ['$location', '$routeParams', '$scope', 'adminAuthService', 'adminTaskService'];

    var AdminTasksController = function ($location, $routeParams, $scope, adminAuthService, adminTaskService) {

        $scope.filter = {
            $: ''
        };
        $scope.params = {};

        adminAuthService.loginCheck().then(function (results) {
            $scope.isLoggedIn = results.data.status;
            console.log($scope.isLoggedIn)
            if (!$scope.isLoggedIn) {
                $location.path('/#/admin/login');
            }
        });
        var fetchTaskData = function () {
            adminTaskService.getUserTask().then(function (successResponse) {
                $scope.taskList = successResponse.tasks;
                console.log($scope.taskList);
            });
        }

        fetchTaskData();
    };

    AdminTasksController.$inject = injectParams;

    angular.module('taskManagementApp')
        .controller('AdminTasksController', AdminTasksController);

}());
