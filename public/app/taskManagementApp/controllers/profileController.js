(function () {

    var injectParams = ['$scope', '$location', '$routeParams', 'authService', 'profileService', 'taskService'];

    var ProfileController = function ($scope, $location, $routeParams, authService, profileService, taskService) {
        var vm = this,
            path = '/';

        profileService.getUserProfile().then(function (successResponse) {
            $scope.profileInfo = successResponse;
            console.log($scope.profileInfo);
        });

        taskService.getUserTask().then(function (successResponse) {
            console.log("success : " + successResponse);
            $scope.taskList = successResponse;
            console.log($scope.taskList);
        });

        $scope.createNewTask = function () {
            taskService.createNewTask($scope.task).then(function (successResponse) {
                console.log($scope.task);
                $scope.taskCreateResponse = successResponse;
                console.log($scope.taskCreateResponse);
            });
        };

    };

    ProfileController.$inject = injectParams;

    angular.module('taskManagementApp')
        .controller('ProfileController', ProfileController);

}());
