"use strict";

var cubeRootApp = angular.module('CubeRootApp');
cubeRootApp.controller('tabularCtrl', ['$scope', '$http', '$filter', 'uiGridConstants', 'commonService',
  function ($scope, $http, $filter, uiGridConstants, commonService) {

    if (!$scope.$parent.loggedIn) {
      return;
    }

    $scope.columns     = undefined;
    $scope.gridOptions = {
      enableSorting            : true,
      columnDefs               : $scope.columns,
      enableGridMenu           : false,
      enableSelectAll          : false,
      enableHorizontalScrollbar: 0,
      onRegisterApi            : function (gridApi) {
        $scope.gridApi = gridApi;
      }
    };

    $scope.$watch('columnDefs', function () {
      var enableFiltering = $scope.$parent.enableColumnFiltering;
      try {
        if (!!$scope.$parent.gridOptions && !!$scope.$parent.gridOptions.expandableRowTemplate) {
          var parentGridOpts = $scope.$parent.gridOptions;

          $scope.gridOptions.expandableRowTemplate = parentGridOpts.expandableRowTemplate;
          $scope.gridOptions.expandableRowHeight   = parentGridOpts.expandableRowHeight;
          //subGridVariable will be available in subGrid scope
          $scope.gridOptions.expandableRowScope    = parentGridOpts.expandableRowScope
        }
        $scope.gridOptions.enableFiltering = (enableFiltering === undefined) ? true : enableFiltering;
        $scope.Data                        = $scope.$parent.tabularData;
        $scope.columns                     = $scope.$parent.columnDefs;

        if (!!$scope.columns) {
          for (var i = 0, len = $scope.columns.length; i < len; i++) {
            if (!!enableFiltering && $scope.columns[i].enableFiltering === undefined) {
              $scope.columns[i].enableFiltering = false;
            }

            /* if($scope.columns[i].cellEditableCondition === undefined){
             $scope.columns[i].cellEditableCondition = false;
             }*/

            $scope.columns[i].minWidth = 100;
          }
        }
        $scope.gridOptions.columnDefs = $scope.columns;
        $scope.gridOptions.data       = $scope.Data;
        if (!!$scope.$parent.rowHeight) {
          $scope.gridOptions.rowHeight = $scope.$parent.rowHeight;
        }
      } catch (e) {
      }
    });
  }]);
