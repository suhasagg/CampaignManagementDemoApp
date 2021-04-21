'use strict';
cubeRootApp = angular.module('CubeRootApp');
cubeRootApp.controller('editCampaignChannelCtrl', ['$scope', '$http', '$validation', '$state', '$stateParams', '$filter', 'commonService', '$timeout', '$interval',
  function ($scope, $http, $validation, $state, $stateParams, $filter, commonService, $timeout, $interval) {

    var
      urlPrefix           = commonService.getUrlPrefix(),
      $validationProvider = $validation
      ;

    if (!$stateParams.data) {
      $state.go('appView.campaigns.manage');
      return;
    }

    $scope.formData             = {};
    $scope.editMode             = true;
    $scope.showCreativesOptions = $scope.autoPopulateDate = false;
    $scope.parentData = $stateParams.data || {};
    $scope.form       = {};
    $scope.performanceMetrics = commonService.getPerformanceMetric();

    var dt           = new Date();
    $scope.startDate = dt;
    $scope.endDate   = new Date(dt.getFullYear() + '-' + (dt.getMonth() + 3) + '-' + dt.getDate());

    $scope.dateOptions = {
      formatYear : 'yy',
      maxDate    : new Date((dt.getFullYear() + 1) + '-' + (dt.getMonth()) + '-' + dt.getDate()),
      minDate    : dt,
      startingDay: 1
    };

    $scope.$on('datesLoaded', function (event) {
      event.stopPropagation();
    });
    $scope.$on('startDateChanged', function (event, date) {
      event.stopPropagation();
      $scope.form.startdate = $filter('date')(date, "yyyy-MM-dd hh:mm:ss");
    });
    $scope.$on('endDateChanged', function (event, date) {
      event.stopPropagation();
      $scope.form.enddate = $filter('date')(date, "yyyy-MM-dd hh:mm:ss");
    });


    $scope.setCreative = function () {
      $scope.selectedCreative = JSON.parse($scope.form.creativeid);
    };

    $scope.toggleCreativeList = function () {
      $scope.showCreativesOptions = !$scope.showCreativesOptions;
    };

    $scope.setChannelName = function () {
      var e                  = document.getElementById("channelSelect");
      $scope.selectedChannel = e.options[e.selectedIndex].text;
      $scope.form.creativeid = null;
    };

    $scope.showCampaignList = function () {
      if ($scope.form.idealTargeting === true && !$scope.campaignIds) {
        commonService.showLoading();
        commonService.getCampaignDetails()
          .then(function successCallback(response) {
            $scope.campaignIds = response.data;
            commonService.hideLoading(2);
          })
      }
    };

    commonService.showLoading();
    commonService.getFormData()
      .then(function (response) {
        console.log(response.data);
        $scope.formData                  = response.data;
        $scope.incomeLevels              = $scope.formData.inc;
        $scope.creativeChannels          = $scope.formData.channel;
        $scope.formData.audienceSegments = [];
        $scope.formData.audienceSegmentData.forEach(function (d) {
          if (d.subcategory.length > 0) {
            d.subcategory.forEach(function (e) {
              e.audienceSegmentName = d.audienceSegmentName + ' : ' + e.audienceSegmentName;
              $scope.formData.audienceSegments.push(e);
            })
          } else {
            $scope.formData.audienceSegments.push(d);
          }
        });

        commonService.getCreativeDetails(urlPrefix)
          .then(function successCallback(response) {
            if (response.data.length > 0) {
              $scope.creativesData = response.data;
              //console.log(response.data);
            }
            /*****
             * Fetching campaign channel related data
             */

            var url = urlPrefix + '/campaign/getcampaignchanneldetails?id=' + $scope.parentData.id + '&channelid=' + $scope.parentData.channelid;

            $http({
              method : 'GET',
              data   : $scope.form,
              headers: {
                'Content-Type': 'application/json'
              },
              url    : url
            }).then(function successCallback(response) {
              //debugger;
              $scope.form      = response.data;
              $scope.startDate = new Date($scope.form.startdate);
              $scope.endDate   = new Date($scope.form.enddate);

              $scope.form.submit = function (form) {
                $validationProvider.validate(form)
                  .success(function () {
                    commonService.showLoading();
                    $scope.form.startdate = $filter('date')($scope.form.startdate, "yyyy-MM-dd hh:mm:ss");
                    $scope.form.enddate   = $filter('date')($scope.form.enddate, "yyyy-MM-dd hh:mm:ss");


                    if($scope.form.targettype === 'automatic'){
                      delete $scope.form.interestsegmentid;
                      delete $scope.form.geographyid;
                      delete $scope.form.agerange;
                      delete $scope.form.gender;
                      delete $scope.form.incomelevel;
                      delete $scope.form.deviceid;
                      delete $scope.form.operatingsystemid;
                      delete $scope.form.resolutionid;
                      delete $scope.form.clicktracker;
                      delete $scope.form.comments;
                    } else if($scope.form.targettype === 'manual'){
                      delete $scope.form.idealTargeting;
                      delete $scope.form.campId;
                      delete $scope.form.optimumParameter;
                    }


                    $http({
                      method : 'POST',
                      data   : $scope.form,
                      headers: {
                        'Content-Type': 'application/json'
                      },
                      url    : urlPrefix + '/campaign/updatecampaigndetailschannel'
                    }).then(function successCallback(response) {
                      if (response.data.type === "success") {
                        $state.go('appView.campaigns.manage');
                      } else if (response.data.type === "error") {
                        commonService.commonErrorCallback(response.data);
                      }
                    });
                  }, commonService.commonErrorCallback);
              };
              commonService.hideLoading(2);
            });
          });
      });
    var singleObject = commonService.singleObject;

    $scope.fetchIdealTargetParameters = function () {
      $scope.idealTargetParams = null;
      commonService.showLoading();
      var url = urlPrefix + '/campaign/getidealparamcampdetails/' + $scope.form.campId + '/' + $scope.form.optimumParameter;
      if ($scope.metric !== "" || $scope.metric !== undefined) {

        commonService.loadITP(url)
          .then(function (response) {
            commonService.hideLoading(2);
            var obj                  = singleObject(response.data);
            $scope.idealTargetParams = obj;
            $scope.idealTargetImg    = (!!obj.age) ?
              commonService.getIdealTargetImg(obj.age.p1, obj.gender.p1) :
              'unknown';

          }, function (response) {

          });

      }
    };



  }]);