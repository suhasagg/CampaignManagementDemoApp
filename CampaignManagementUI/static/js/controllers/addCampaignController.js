"use strict";
cubeRootApp = angular.module('CubeRootApp');
cubeRootApp.controller('addCampaignCtrl', ['$scope', '$http', '$validation', '$state', '$filter', 'commonService', function ($scope, $http, $validation, $state, $filter, commonService) {
  var
    urlPrefix           = commonService.getUrlPrefix(),
    $validationProvider = $validation
    ;

  commonService.showLoading();
  $scope.setCampaignType  = function () {
    console.log($scope.form.selectedObjective);
    var obj = JSON.parse($scope.form.selectedObjective);
    if (!obj || obj == '') {
      $scope.form.objective = $scope.form.campaigntype = $scope.form.trackertype = undefined;
      return;
    }
    $scope.form.objective    = obj.id;
    $scope.form.campaigntype = obj.campaignType;
    $scope.form.trackertype  = obj.trackerType;

  };
  $scope.triggerDateEvent = false;

  $scope.setupForm = function () {
    $scope.form = {
      reset: function (form) {
        $validationProvider.reset(form);
      },

      submit   : function (form) {
        $validationProvider.validate(form)
          .success(function () {
            var campaignForm = angular.element(document.getElementsByName('campaignForm'));
            commonService.showLoading();

            $http({
              method : 'POST',
              data   : $scope.form,
              headers: {
                'Content-Type': 'application/json'
              },
              url    : urlPrefix + '/campaign/addcampaign'
            }).then(function successCallback(response) {
              $state.go('appView.campaigns.manage');
              /*            if (response.data.type === "success") {
               $state.go('appView.campaigns.manage');
               }
               else if (response.data.type === "error") {
               commonService.commonErrorCallback(response.data);
               }*/
            });
          }, commonService.commonErrorCallback);
      },
      startdate: $filter('date')($scope.startDate, "yyyy-MM-dd hh:mm:ss"),
      enddate  : $filter('date')($scope.endDate, "yyyy-MM-dd hh:mm:ss")
    };
    /*    $scope.objective = '{ "key": "sendPeople", "campaignType": "CPC", "trackerType": "Click Tracker" }';
     $scope.setCampaignType();*/

    var dt           = new Date();
    $scope.startDate = dt;
    $scope.endDate   = new Date(dt.getFullYear() + '-' + (dt.getMonth() + 3) + '-' + dt.getDate());

    $scope.dateOptions = {
      /* dateDisabled: disabled,*/
      formatYear : 'yy',
      maxDate    : new Date((dt.getFullYear() + 1) + '-' + (dt.getMonth()) + '-' + dt.getDate()),
      minDate    : dt,
      startingDay: 1
    };

    $scope.$on('startDate', function () {
      $scope.form.startdate = $filter('date')($scope.startDate, "yyyy-MM-dd hh:mm:ss");
    });

    $scope.$on('endDate', function () {
      $scope.form.enddate = $filter('date')($scope.endDate, "yyyy-MM-dd hh:mm:ss");
    });

    commonService.hideLoading();
  };

  commonService.getFormData()
    .then(function (response) {
      $scope.campaignObjectives = response.data.objective;
      $scope.setupForm();
      commonService.hideLoading();
    })


}]);