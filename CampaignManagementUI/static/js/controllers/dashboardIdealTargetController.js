"use strict";
var cubeRootApp = angular.module('CubeRootApp');
cubeRootApp.controller("dashboardIdealTargetCtrl", ["$scope", "$http", "commonService", function ($scope, $http, commonService) {

  $scope.performanceMetrics = commonService.getPerformanceMetric();
  $scope.metric             = "";
  $scope.idealTargetParams  = $scope.idealTargetImg = null;


  var
    urlPrefix = commonService.getUrlPrefix(),
    $_        = commonService.getId;

  $scope.$on('campaignIdsAvailable', function () {

    if (!$scope.campaign_id) {
      /*            $scope.campaign_id = "";
       commonService.hideLoading();

       $_("#performanceMetric").attr('disabled',true);*/

      $scope.campaign_id = '390878914';
      $scope.metric      = 'ctr';
      commonService.hideLoading();
      $scope.onCampaignSelect();
      $scope.loadITP();

    }
  });

  $scope.onCampaignSelect = function () {
    $scope.idealTargetParams = null;
    if ($scope.campaign_id !== "" && $scope.campaign_id !== undefined) {
      $_("#performanceMetric").removeAttr('disabled');
    } else {
      $_("#performanceMetric").attr('disabled', true);
    }
  };

  var singleObject = commonService.singleObject,
      urls         = {
        "ctr"           : urlPrefix + "/b5/report/14/390878914",
        "cpc"           : urlPrefix + "/b5/report/15/390878914",
        "conversionRate": urlPrefix + "/b5/report/16/6038591740429"
      };


  $scope.loadITP = function () {
    $scope.idealTargetParams = null;
    commonService.showLoading();
    var url = urls[$scope.metric];
    if ($scope.metric !== "" || $scope.metric !== undefined) {

      commonService.loadITP(url)
        .then(function (response) {
          commonService.hideLoading(2);
          var obj = singleObject(response.data);
          $scope.idealTargetParams = obj;
          $scope.idealTargetImg = (!!obj.age) ?
            commonService.getIdealTargetImg(obj.age.p1, obj.gender.p1) :
            'unknown';

        }, function (response) {

        });

    }
  };


  angular.element(commonService.getId("#dashboardLinks")).addClass('active');
}]);

