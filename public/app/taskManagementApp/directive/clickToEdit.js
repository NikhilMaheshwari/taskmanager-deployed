angular.module('taskManagementApp').directive("clickToEdit", function () {
    var editorTemplate = '' +
        '<div class="click-to-edit">' +
        '<div ng-hide="view.editorEnabled">' +
        '{{value}} ' +
        '<a class="btn btn-primary tiny" ng-click="enableEditor()">Edit</a>' +
        '</div>' +
        '<div ng-show="view.editorEnabled">' +
        '<input type="text" class="small-12.columns form-control" ng-model="view.editableValue">' +
        '<a class="btn btn-primary tiny" ng-click="save()">Save</a>' +
        ' or ' +
        '<a class="btn btn-primary tiny" ng-click="disableEditor()">cancel</a>' +
        '</div>' +
        '</div>';

    return {
        restrict: "A",
        replace: true,
        template: editorTemplate,
        scope: {
            value: "=clickToEdit",
        },
        link: function (scope, element, attrs) {
            scope.view = {
                editableValue: scope.value,
                editorEnabled: false
            };

            scope.enableEditor = function () {
                scope.view.editorEnabled = true;
                scope.view.editableValue = scope.value;
                setTimeout(function () {
                    element.find('input')[0].focus();
                    //element.find('input').focus().select(); // w/ jQuery
                });
            };

            scope.disableEditor = function () {
                scope.view.editorEnabled = false;
            };

            scope.save = function () {
                scope.value = scope.view.editableValue;
                scope.disableEditor();
            };

        }
    };
});
