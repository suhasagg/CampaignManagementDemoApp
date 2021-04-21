"use strict";
cubeRootApp = angular.module('CubeRootApp');
cubeRootApp.controller('manageCreativeCtrl', ['$scope', 'commonService', '$http', function ($scope, commonService, $http) {
  commonService.showLoading();
  var
    urlPrefix         = commonService.getUrlPrefix()
    ;
  $scope.updateStatus = function (obj, selectObj) {
    //console.log(obj);

    var formObj = {
      id       : obj.id,
      title    : obj.title,
      channel  : obj.channel,
      type     : obj.type,
      size     : obj.size,
      dateAdded: obj.dateAdded,
      status   : obj.status
    };

    commonService.showLoading();
    $http({
      method : 'POST',
      data   : formObj,
      headers: {
        'Content-Type': 'application/json'
      },
      url    : urlPrefix + '/creative/updatecreativedetails'
    }).then(function successCallback(response) {
      if (response.data.type === "success") {
        //loadCreativeDetails();
        commonService.hideLoading();
      }
    }, commonService.commonErrorCallback)
  };

  $scope.enableColumnFiltering = true;
  $scope.rowHeight             = 35;
  $scope.statusOptions         = [
    {key: 'active', value: 'Active'},
    {key: 'pause', value: 'Pause'},
    {key: 'stop', value: 'Stop'}
  ];

  $scope.showCreative = commonService.showCreative;
  $scope.showAppMsg   = commonService.showAppMsg;

  function loadCreativeDetails() {
    commonService.getCreativeDetails(urlPrefix)
      .then(function successCallback(response) {
        if (response.data.length > 0) {
          $scope.creativesData = response.data;
          $scope.columnDefs    = [
            {
              field          : 'title',
              displayName    : 'Title',
              enableFiltering: true,
              cellTemplate   : '<div class="ui-grid-cell-contents" title="{{row.entity.title}}">' +
              '<a ui-sref="appView.creatives.editCreative({data:row.entity})"><i class="edit-icon icon-pencil icon-flipped"></i></a> &nbsp;' +
              '{{row.entity.title}}' +
              '</div>',
              width:200
            },
            {
              field          : 'description',
              displayName    : 'Description',
              enableFiltering: true
            },
            {
              field      : 'channel',
              displayName: 'Channel '
            },
            {
              field       : 'type',
              displayName : 'Type ',
              cellTemplate: '<div class="ui-grid-cell-contents">' +
              '{{row.entity.type}} ' +
              '<a ng-if="!!row.entity.type && row.entity.type!==\'null\'" ng-click="grid.appScope.showCreative({\'type\':row.entity.type,\'url\':\'/creative/geturldetails?id=\'+row.entity.id+\'&channel=\'+row.entity.channel})">View</a> &nbsp;' +
              '</div>'
            },
            {
              field: 'size', displayName: 'Size', width:60
            },
            {
              field: 'dateAdded', displayName: 'Date Added', cellFilter: $scope.dateFormat
            }
            ,
            {
              field       : 'status',
              displayName : 'Status',
              cellTemplate: '<div class="ui-grid-cell-contents" >' +
              '<select ' +
              /*'data-ng-options="status.key as status.value for status in grid.appScope.statusOptions track by status.key"' +*/
              /*'ng-options="obj.key for obj in grid.appScope.statusOptions"' +*/
              'ng-model="row.entity.status" ' +
              'ng-change="grid.appScope.updateStatus(row.entity)">' +
              '<option value="{{obj.key}}" ng-repeat="obj in grid.appScope.statusOptions">{{obj.value}}</option>' +
              '</select>' +
              '</div>',
              width:90
            }
          ]
          ;

          $scope.tabularData = $scope.creativesData;
          commonService.hideLoading(2);
        }
      })
    ;
  }

  loadCreativeDetails();
}]);