(function () {

    var injectParams = ['$scope', '$location', '$routeParams', 'authService', 'profileService', 'taskService', 'filteredListService', 'taskLogService'];

    var TaskLogController = function ($scope, $location, $routeParams, authService, profileService, taskService, filteredListService, taskLogService) {
        var vm = this,
            path = '/';

        $scope.filter = {
            $: ''
        };
        $scope.params = {};
        console.log($routeParams.taskId);
        var getTaskLog = function () {
            taskLogService.getTaskLog($routeParams.taskId).then(function (successResponse) {
                $scope.taskLogList = successResponse.taskLog;
                $scope.taskInfo = successResponse.task;
                if ($scope.taskInfo.due_date != undefined) {
                    $scope.taskInfo.due_date = new Date($scope.taskInfo.due_date).toDateString();
                }
                var length = $scope.taskLogList.length;
                for (var i = 0; i < length; i++) {
                    var today = new Date();
                    var isToday = (today.toDateString() == new Date($scope.taskLogList[i].date).toDateString());
                    $scope.taskLogList[i].log_date = formatDate($scope.taskLogList[i].date);
                    $scope.taskLogList[i].hours_spend_earlier = $scope.taskLogList[i].hours_spend;
                    if (isToday) {
                        $scope.taskLogList[i].canEdit = true;
                    } else {
                        $scope.taskLogList[i].canEdit = false;
                    }
                }
                console.log($scope.taskLogList);
            });
        }
        getTaskLog();
        $scope.createNewTaskLog = function () {
            var request = {
                task_id: $routeParams.taskId,
                hours_spend: parseInt($scope.taskLog.hours_log)
            }
            taskLogService.createNewTaskLog(request).then(function (successResponse) {
                console.log($scope.task);
                $scope.taskCreateResponse = successResponse;
                console.log(successResponse);
                if (!successResponse.isSuccess) {
                    showAlert("taskLogCreate", "danger", successResponse.message);
                } else {
                    showAlert("taskLogCreate", "success", "Task Log created successfully !");
                }
                getTaskLog();
            });
        };

        $scope.updateTaskHours = function (taskLog) {
            taskLog.hours_spend = parseInt(taskLog.hours_spend);
            taskLog.hours_spend_earlier = parseInt(taskLog.hours_spend_earlier);
            taskLogService.updateTaskLog(taskLog).then(function (successResponse) {
                console.log(successResponse);
                if (!successResponse.isSuccess) {
                    showAlert("taskLogCreate", "danger", successResponse.message);
                } else {
                    showAlert("taskLogCreate", "success", "Task Log created successfully !");
                }
                getTaskLog();
            });
        }

    };

    TaskLogController.$inject = injectParams;

    angular.module('taskManagementApp')
        .controller('TaskLogController', TaskLogController);

}());

function showAlert(containerId, alertType, message) {
    $("#" + containerId).append('<span class="alert alert-' + alertType + '" id="alert' + containerId + '">' + message + '</span>');
    $("#alert" + containerId).alert();
    window.setTimeout(function () {
        $("#alert" + containerId).alert('close');
    }, 10000);
}

function formatDate(date) {
    return new Date(date).toISOString().slice(0, 10);
}
