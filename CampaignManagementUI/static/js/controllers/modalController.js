"use strict";
angular.module('CubeRootApp')
    .controller('modalViewCtrl', function ($scope, $uibModal, $log) {

    $scope.items = ['item1', 'item2', 'item3'];

    $scope.open = function (size) {

        var modalInstance = $uibModal.open({
            templateUrl: 'myModalContent.html',
            controller: 'modalViewInstanceCtrl',
            size: size,
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
})

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.
.controller('modalViewInstanceCtrl', function ($scope, $uibModalStack, items) {

    $scope.items = items;
    $scope.selected = {
        item: $scope.items[0]
    };

    $scope.ok = function () {
        $modalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});