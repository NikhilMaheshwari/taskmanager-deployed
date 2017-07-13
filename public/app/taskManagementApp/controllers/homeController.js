(function () {

    var injectParams = ['$scope', '$window', '$location', '$routeParams', 'authService', 'userService'];

    var HomeController = function ($scope, $window, $location, $routeParams, authService, userService) {
        var vm = this,
            path = '/';

        $scope.isLoggedIn = false;
        var profileInfoFetch = function () {
            $scope.isLoggedIn = authService.loginCheck().then(function (results) {
                $scope.isLoggedIn = results.data.data.status;
                console.log($scope.isLoggedIn);
                if ($scope.isLoggedIn) {
                    $window.location.href = '#/tasks';
                }
            });
        }
        profileInfoFetch();
    };

    HomeController.$inject = injectParams;

    angular.module('taskManagementApp')
        .controller('HomeController', HomeController);

}());
