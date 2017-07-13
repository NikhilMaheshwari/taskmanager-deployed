(function () {

    var injectParams = ['$scope', '$location', '$routeParams', 'authService', 'profileService', 'taskService', 'filteredListService'];

    var TaskController = function ($scope, $location, $routeParams, authService, profileService, taskService, filteredListService) {
        var vm = this,
            path = '/';

        $scope.filter = {
            $: ''
        };
        $scope.params = {};

        var fetchProfileData = function () {
            profileService.getUserProfile().then(function (successResponse) {
                $scope.profileInfo = successResponse;
                console.log($scope.profileInfo);
            });
        }

        var fetchTaskData = function () {
            taskService.getUserTask().then(function (successResponse) {
                $scope.taskList = successResponse.tasks;
                console.log($scope.taskList);
            });
        }

        $scope.createNewTask = function () {
            taskService.createNewTask($scope.task).then(function (successResponse) {
                console.log($scope.task);
                $scope.taskCreateResponse = successResponse;
                console.log(successResponse);
                if (!successResponse.isSuccess) {
                    showAlert("taskCreateDiv", "danger", successResponse.message);
                } else {
                    showAlert("taskCreateDiv", "success", "Task created successfully !");
                }

            });
        };

        $scope.startTask = function (task_id) {
            taskService.startTask(task_id).then(function (successResponse) {
                console.log($scope.task);
                $scope.taskCreateResponse = successResponse;
                console.log(successResponse);
                if (!successResponse.isSuccess) {
                    showAlert("taskPage", "danger", successResponse.message);
                } else {
                    showAlert("taskPage", "success", "Task started successfully !");
                }
                fetchTaskData();
            });


        }

        $scope.stopTask = function (task_id) {
            taskService.endTask(task_id).then(function (successResponse) {
                console.log($scope.task);
                $scope.taskCreateResponse = successResponse;
                console.log(successResponse);
                if (!successResponse.isSuccess) {
                    showAlert("taskPage", "danger", successResponse.message);
                } else {
                    showAlert("taskPage", "success", "Task completed successfully !");
                }
                fetchTaskData();
            });


        }

        fetchProfileData();
        fetchTaskData();
    };

    TaskController.$inject = injectParams;

    angular.module('taskManagementApp')
        .controller('TaskController', TaskController);

}());

function showAlert(containerId, alertType, message) {
    $("#" + containerId).append('<span class="alert alert-' + alertType + '" id="alert' + containerId + '">' + message + '</span>');
    $("#alert" + containerId).alert();
    window.setTimeout(function () {
        $("#alert" + containerId).alert('close');
    }, 10000);
}
