(function () {

    var injectParams = ['$location', '$scope', '$routeParams', 'adminAuthService'];

    var AdminSignupController = function ($location, $scope, $routeParams, adminAuthService) {
        var vm = this,
            path = '/';

        vm.email = null;
        vm.password = null;
        vm.errorMessage = null;
        $scope.signupData = {
            username: '',
            password: ''
        }
        $scope.signup = function () {
            console.log($scope.signupData);
            adminAuthService.signup($scope.signupData).then(function (status) {
                if (!status) {
                    vm.errorMessage = 'Unable to login';
                    return;
                }

                if (status && $routeParams && $routeParams.redirect) {
                    path = path + $routeParams.redirect;
                }

                $location.path(path);
            });
        };
    };

    AdminSignupController.$inject = injectParams;

    angular.module('taskManagementApp')
        .controller('AdminSignupController', AdminSignupController);

}());
