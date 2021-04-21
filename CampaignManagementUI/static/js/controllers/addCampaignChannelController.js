'use strict';
cubeRootApp = angular.module('CubeRootApp');
cubeRootApp.controller('addCampaignChannelCtrl', ['$scope', '$http', '$validation', '$state', '$filter', '$stateParams', 'commonService', '$timeout', '$interval',
  function ($scope, $http, $validation, $state, $filter, $stateParams, commonService, $timeout, $interval) {

    if (!$stateParams.data) {
      $state.go('appView.campaigns.manage');
      return;
    }
    var
      urlPrefix           = commonService.getUrlPrefix(),
      $validationProvider = $validation
      ;



    function filterExistingChannels(data, listToFilter) {
      var existingChannels = [], creativeChannels = [];
      data.channelwiseData.forEach(function (d) {
        existingChannels.push(d.channel);
      });

      listToFilter.forEach(function (d) {
        if (existingChannels.indexOf(d.channelName) === -1)
          creativeChannels.push(d)
      });
      return creativeChannels;
    }
    $scope.formData         = {};
    $scope.triggerDateEvent = $scope.showCreativesOptions = $scope.autoPopulateDate = false;
    $scope.parentData         = $stateParams.data || {};
    $scope.existingChannels   = [];
    $scope.performanceMetrics = commonService.getPerformanceMetric();

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

    $scope.$watch('startDate', function () {
      $scope.form.startdate = $scope.startDate;
    });
    $scope.$watch('endDate', function () {
      $scope.form.enddate = $scope.endDate;
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
        //console.log(response.data);
        $scope.formData         = response.data;
        $scope.incomeLevels     = $scope.formData.inc;
        $scope.creativeChannels = filterExistingChannels($scope.parentData, $scope.formData.channel);

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
            commonService.hideLoading(2);
          });


      });

    $scope.form = {
      targettype   : 'automatic',
      maxbid       : $scope.parentData.maxbid,
      expectedbid  : $scope.parentData.expectedbid,
      channelbudget: $scope.parentData.channelbudget,
      monthlycap   : $scope.parentData.monthlycap,
      dailycap     : $scope.parentData.dailycap,
      id           : $scope.parentData.id,
      reset        : function (form) {
        $validationProvider.reset(form);
      },
      submit       : function (form) {
        $validationProvider.validate(form)
          .success(function () {
            var campaignForm = angular.element(document.getElementsByName('campaignForm'));
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
              url    : urlPrefix + '/campaign/addcampaignchannel'
            }).then(function successCallback(response) {
              if (response.data.type === "success") {
                $state.go('appView.campaigns.manage');
              } else if (response.data.type === "error") {
                commonService.commonErrorCallback(response.data);
              }
            });
          }, commonService.commonErrorCallback);
      }
    };


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