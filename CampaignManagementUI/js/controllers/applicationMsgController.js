"use strict";
angular.module('CubeRootApp')
.controller('applicationMessageCtrl', ['$scope','$rootScope' , '$uibModalStack',
    function ($scope, $rootScope, $uibModalStack) {
        $scope.appviewMsg = $rootScope.appViewMsg;

        $scope.ok = function () {
            $rootScope.modalInstance.dismiss('ok');
        };

        $scope.cancel = function () {
            $rootScope.modalInstance.dismiss('cancel');
        };
    }]);