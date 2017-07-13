(function () {

    var injectParams = ['$scope', '$location', 'authService', 'profileService', 'adminAuthService'];

    var NavbarController = function ($scope, $location, authService, profileService, adminAuthService) {
        var vm = this,
            appTitle = 'Task Management';

        vm.appTitle = appTitle;
        $scope.isLoggedIn = false;

        $scope.isAdminUser = $location.path().indexOf('admin') !== -1 ? true : false;

        var profileInfoFetch = function () {
            if ($scope.isAdminUser) {
                $scope.isLoggedIn = adminAuthService.loginCheck();
                console.log($scope.isLoggedIn)
                //$scope.isLoggedIn = results.data.data.status;
                $scope.profileInfo = {
                    'photos': '',
                    'name': 'Admin'
                }




            } else {
                authService.loginCheck().then(function (results) {
                    $scope.isLoggedIn = results.data.data.status;
                    console.log($scope.isLoggedIn);
                    if ($scope.isLoggedIn) {
                        profileService.getUserProfile().then(function (successResponse) {
                            $scope.profileInfo = successResponse;
                            console.log($scope.profileInfo);

                        });
                    }
                });
            }
        }

        profileInfoFetch();


        $scope.loginOrOut = function () {
            if (!$scope.isAdminUser) {
                authService.loginCheck().then(function (results) {
                    $scope.isLoggedIn = results.data.data.status;
                    if ($scope.isLoggedIn) { //logout 
                        authService.logout().then(function () {
                            $location.path('/');
                            return;
                        });
                    } else {
                        $location.path('/');
                    }
                });
            } else {
                $scope.isLoggedIn = adminAuthService.loginCheck
                if ($scope.isLoggedIn) {
                    adminAuthService.logout().then(function () {
                        $location.path('/#/admin/login');
                        return;
                    });
                } else {
                    $location.path('/#/admin/login');
                }
            }
        }
        $scope.$watch('profileInfo', function () {
            console.log('Profile info modified');
            $scope.isProfileReady = true;
        });
    };

    NavbarController.$inject = injectParams;

    angular.module('taskManagementApp').controller('NavbarController', NavbarController);

}());
