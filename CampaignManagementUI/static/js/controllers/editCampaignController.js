"use strict";
cubeRootApp = angular.module('CubeRootApp');
cubeRootApp.controller('editCampaignCtrl', ['$scope', '$http', '$validation', '$state', '$stateParams', '$filter', 'commonService', function ($scope, $http, $validation, $state, $stateParams, $filter, commonService) {

  if (!$stateParams.data) {
    $state.go('appView.campaigns.manage');
    return;
  }
  $scope.editMode = true;
  commonService.showLoading();

  var
    urlPrefix           = commonService.getUrlPrefix(),
    $validationProvider = $validation
    ;

  $scope.setCampaignType = function () {
    var obj                  = $scope.campaignObjectives[$scope.form.objective - 1];
    $scope.campaignTypeText  = obj.objectiveName;
    $scope.form.campaigntype = obj.campaignType;
    $scope.form.trackertype  = obj.trackerType;
  };

  $scope.setEditBinding = function (obj) {
    //$scope.triggerDateEvent   = false;
    $scope.form               = {};
    $scope.form               = obj;
    $scope.setCampaignType($scope.form.objective);
    $scope.form.submit = function (form) {
      $validationProvider.validate(form)
        .success(function () {
          var campaignForm = angular.element(document.getElementsByName('campaignForm'));
          commonService.showLoading();

          $scope.form.startdate = $filter('date')($scope.form.startdate, "yyyy-MM-dd hh:mm:ss");
          $scope.form.enddate = $filter('date')($scope.form.enddate, "yyyy-MM-dd hh:mm:ss");

          $http({
            method : 'POST',
            data   : $scope.form,
            headers: {
              'Content-Type': 'application/json'
            },
            url    : urlPrefix + '/campaign/updatecampaigndetails'
          }).then(function successCallback(response) {
            if (response.data.type === "success") {
              $state.go('appView.campaigns.manage');
            }
            else if (response.data.type === "error") {
              commonService.commonErrorCallback(response.data);
            }
            commonService.hideLoading();
          });
        }, commonService.commonErrorCallback);
    };

/*
    $scope.form.startdate = $filter('date')($scope.startDate, "yyyy-MM-dd hh:mm:ss");
    $scope.form.enddate   = $filter('date')($scope.endDate, "yyyy-MM-dd hh:mm:ss");
*/
    commonService.hideLoading();

  };

  commonService.getFormData()
    .then(function (response) {
      $scope.campaignObjectives = response.data.objective;
      $http({
        url    : '/campaign/getcampaignIddetails?id=' + $stateParams.data.id,
        method : 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(function (response) {
          $scope.setEditBinding(response.data);
          commonService.hideLoading();
          $scope.startDate=new Date($scope.form.startdate);
          $scope.endDate=new Date($scope.form.enddate);



        });
    });

  $scope.startDate      =  $scope.endDate = undefined;

  var dt             = $scope.startDate || new Date();
  $scope.dateOptions = {
    /* dateDisabled: disabled,*/
    formatYear : 'yy',
    maxDate    : new Date((dt.getFullYear() + 1) + '-' + (dt.getMonth()) + '-' + dt.getDate()),
    minDate    : dt,
    startingDay: 1
  };


  $scope.$on('datesLoaded',function (event) {
    event.stopPropagation();
  });
  $scope.$on('startDateChanged',function (event,date) {
    event.stopPropagation();
    $scope.form.startdate = $filter('date')(date, "yyyy-MM-dd hh:mm:ss");
  });
  $scope.$on('endDateChanged',function (event,date) {
    event.stopPropagation();
    $scope.form.enddate = $filter('date')(date, "yyyy-MM-dd hh:mm:ss");
  });

  /*
  $scope.$watch('startDate', function () {
    if(!!$scope.startDate)
      $scope.form.startdate = $filter('date')($scope.startDate, "yyyy-MM-dd hh:mm:ss");
  });

  $scope.$watch('endDate', function () {
    if(!!$scope.endDate)
      $scope.form.enddate = $filter('date')($scope.endDate, "yyyy-MM-dd hh:mm:ss");
  });
*/
}]);