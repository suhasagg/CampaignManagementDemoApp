"use strict";

cubeRootApp = angular.module('CubeRootApp');
cubeRootApp.controller('manageCampaignCtrl', ['$scope', 'commonService', '$http', '$log', '$filter', function ($scope, commonService, $http, $log, $filter) {
  commonService.showLoading();
  var
    urlPrefix = commonService.getUrlPrefix()
    ;

  /**
   *
   * @param obj
   * @param channel
   */
  $scope.updateStatus = function (obj, channel) {
    //console.log(obj);

    var formObj = {
          id    : obj.id,
          status: obj.status
        },
        url     = '',
        channel = channel || false
      ;

    url = (!!channel) ? urlPrefix + '/campaign/updatecampaignstatuschannel' : urlPrefix + '/campaign/updatecampaignstatus';


    commonService.showLoading();
    $http({
      method : 'POST',
      data   : formObj,
      headers: {
        'Content-Type': 'application/json'
      },
      url    : url
    }).then(function successCallback(response) {
      if (response.data.type === "success") {
        //loadCampaignDetails();
        commonService.hideLoading();
      }
      else if (response.data.type === "error") {
        commonService.commonErrorCallback();
      }
    }, commonService.commonErrorCallback)
  };

  $scope.enableColumnFiltering = true;
  $scope.rowHeight             = 35;
  $scope.statusOptions         = [
    {key: 'Active', value: 'Active'},
    {key: 'Pause', value: 'Pause'},
    {key: 'Stop', value: 'Stop'}
  ];

  function loadCampaignDetails() {
    commonService.getCampaignDetails()
      .then(function successCallback(response) {
        if (response.data.length > 0) {
          var data = response.data;

          data.forEach(function (d) {
            d.startdate = $filter('date')(d.startdate.split(" ")[0], "dd MMM yyyy");
            d.enddate   = $filter('date')(d.enddate.split(" ")[0], "dd MMM yyyy");
            if (d.channelwiseData.length > 0) {
              d.channelwiseData.forEach(function (e) {
                e.startdate = $filter('date')(e.startdate.split(" ")[0], "dd MMM yyyy");
                e.enddate   = $filter('date')(e.enddate.split(" ")[0], "dd MMM yyyy");
              })
            }
            //debugger;
          });

          $scope.expandableRow    = true;
          $scope.gridOptions      = {
            expandableRowTemplate    : './views/expandableRowTemplate.html',
            enableExpandableRowHeader: false,
            /*expandableRowHeight      : 150,*/
            //subGridVariable will be available in subGrid scope
            expandableRowScope       : {
              subGridVariable: 'subGridScopeVariable',
              statusOptions  : $scope.statusOptions,
              updateStatus   : $scope.updateStatus,
              showHeader     : false
            }
          };
          $scope.gridOptions.data = [];

          $scope.columnDefs = [
            {
              field          : 'name',
              displayName    : 'Campaign Name',
              enableFiltering: true,
              wordWrap       : true,
              cellTemplate   : '<div class="ui-grid-cell-contents rel" title="{{row.entity.name}}">' +
              '<a ui-sref="appView.campaigns.editCampaign({data:{id:row.entity.id}})"><i class="edit-icon icon-pencil icon-flipped" data-title="Edit Campaign" title="Edit Campaign"></i></a> &nbsp;' +
              '{{row.entity.name}}' +
              '<a ui-sref="appView.campaigns.addChannel({data:row.entity})"><i class="edit-icon icon-add icon-flipped pull-right" data-title="Add New Channel" title="Add New Channel"></i></a>' +
              '</div>',
              width          : 200
            },
            {
              field          : 'startdate',
              displayName    : 'Start Date',
              enableFiltering: true,
              /*cellTemplate   : '<div class="ui-grid-cell-contents">' +
               "{{row.entity.startdate.split(' ')[0]" +
               " $filter('date')( (row.entity.startdate.split(' ')[0]), \"dd-MM-yyyy\") }}" +
               '</div>',*/
            },
            {
              field          : 'enddate',
              displayName    : 'End Date',
              enableFiltering: true,
              /* cellTemplate   : '<div class="ui-grid-cell-contents">' +
               "{{ $filter('date')(row.entity.enddate.split(' ')[0], \"dd-MM-yyyy\") }}" +
               '</div>',*/
              //width          : 100
            },
            {
              field      : 'impression',
              displayName: 'Impression',
              /*              cellTemplate: '<div class="ui-grid-cell-contents">' +
               '<span ng-if="(row.entity.Impression || row.entity.click || row.entity.ctr)">' +
               '{{row.entity.Impression}}' +
               '</span>' +
               '</div>',*/
              //width      : 100
            },
            {
              field      : 'click',
              displayName: 'Click',
              //width      : 75
            },
            {
              field      : 'ctr',
              displayName: 'CTR',
              cellFilter: 'number: 2',
              width      : 65
            },
            {
              field      : 'conversion',
              displayName: 'Conversion'
            },
            {field: 'cost', displayName: 'Cost'},
            {
              field       : 'status',
              displayName : 'Status',
              cellTemplate: '<div class="ui-grid-cell-contents" >' +
              '<select ' +
              'ng-model="row.entity.status" ' +
              'ng-change="grid.appScope.updateStatus(row.entity)">' +
              '<option value="{{obj.key}}" ng-repeat="obj in grid.appScope.statusOptions">{{obj.value}}</option>' +
              '</select>' +
              '</div>',
              width:90
            }
          ];

          for (var i = 0; i < data.length; i++) {
            data[i].subGridOptions            = {};
            data[i].subGridOptions.data       = [];
            data[i].subGridOptions.columnDefs = [
              {
                name        : "Channel",
                field       : "channel",
                cellTemplate: '<div class="ui-grid-cell-contents" title="{{row.entity.channel}}">' +
                '<a ui-sref="appView.campaigns.editCampaignChannel({data:row.entity})"><i class="edit-icon icon-pencil icon-flipped" data-title="Edit Channel" title="Edit Channel"></i></a> &nbsp;' +
                '{{row.entity.channel}}' +
                '</div>'
              },
              {
                field          : 'startdate',
                displayName    : 'Start Date',
                enableFiltering: true,
                //width          : 100
              },
              {
                field          : 'enddate',
                displayName    : 'End Date',
                enableFiltering: true,
                // width          : 100
              },
              {
                field      : 'impression',
                displayName: 'Impression',
                //width      : 90
              },
              {
                field      : 'click',
                displayName: 'Click',
                //width      : 50
              },
              {
                field      : 'ctr',
                displayName: 'CTR',
                //width      : 50
              },
              {
                field      : 'conversion',
                displayName: 'Conversion '/*, cellTemplate:'<div class="ui-grid-cell-contents">{{row.entity.cpm }}</div>'*/
              },
              {field: 'cost', displayName: 'Cost'},
              {
                field       : 'status',
                displayName : 'Status',
                cellTemplate: '<div class="ui-grid-cell-contents" >' +
                '<select ' +
                /*'data-ng-options="status.key as status.value for status in grid.appScope.statusOptions track by status.key"' +*/
                /*'ng-options="obj.key for obj in grid.appScope.statusOptions"' +*/
                'ng-model="row.entity.status" ' +
                'ng-change="grid.appScope.updateStatus(row.entity,true)">' +
                '<option value="{{obj.key}}" ng-repeat="obj in grid.appScope.statusOptions">{{obj.value}}</option>' +
                '</select>' +
                '</div>'
              }
            ];
            data[i].subGridOptions.data       = data[i].channelwiseData;
          }
          $scope.tabularData = data;
          //console.log(JSON.stringify(data));
          commonService.hideLoading(2);
        }
      });
  };

  loadCampaignDetails();
}]);