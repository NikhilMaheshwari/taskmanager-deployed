(function () {

    var app = angular.module('taskManagementApp', ['ngRoute', 'ngAnimate', 'ui.bootstrap', 'siTable']);

    app.config(['$routeProvider', function ($routeProvider) {
        var viewBase = '/app/taskManagementApp/views/';

        $routeProvider
            .when('/', {
                controller: 'HomeController',
                templateUrl: viewBase + 'home.html',
                controllerAs: 'vm'
            })
            .when('/tasks', {
                controller: 'TaskController',
                templateUrl: viewBase + 'task.html',
                controllerAs: 'vm'
            })
            .when('/task/:taskId', {
                controller: 'TaskLogController',
                templateUrl: viewBase + 'tasklog.html',
                controllerAs: 'vm'
            })
            .when('/login/:redirect*?', {
                controller: 'LoginController',
                templateUrl: viewBase + 'login.html',
                controllerAs: 'vm'
            })
            .when('/admin/login', {
                controller: 'AdminLoginController',
                templateUrl: viewBase + 'admin/login.html',
                controllerAs: 'vm'
            })
            .when('/admin/tasks', {
                controller: 'AdminTasksController',
                templateUrl: viewBase + 'admin/task.html',
                controllerAs: 'vm'
            })
            .when('/admin/signup', {
                controller: 'AdminSignupController',
                templateUrl: viewBase + 'admin/signup.html',
                controllerAs: 'vm'
            })
            .otherwise({
                redirectTo: '/'
            });

    }]);

    app.run(['$rootScope', '$location', 'authService',
        function ($rootScope, $location, authService) {

            //Client-side security. Server-side framework MUST add it's 
            //own security as well since client-based security is easily hacked
            $rootScope.$on("$routeChangeStart", function (event, next, current) {
                if (next && next.$$route && next.$$route.secure) {
                    if (!authService.user.isAuthenticated) {
                        $rootScope.$evalAsync(function () {
                            authService.redirectToLogin();
                        });
                    }
                }
            });

    }]);

}());
