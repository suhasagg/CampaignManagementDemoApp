"use strict";
var cubeRootApp = angular.module('CubeRootApp');
cubeRootApp.controller("dashboardPerformanceCtrl", ["$http", "$rootScope", "$scope", "commonService", function ($http, $rootScope, $scope, commonService) {


  $scope.currentChart = "impressions";
  $scope.updateChart  = commonService.updateChart($scope);
  var urlPrefix       = commonService.getUrlPrefix();
  commonService.addToolTip();

  $scope.loadChart = function (chartType) {
    /********
     * Usage chart(jsonPath, colorFamily, keyX, keyY, divisionRatio, nestKey)
     * ******/
    //debugger;

    //debugger;
    if (!$scope.campaign_id) {
      $scope.campaign_id = "all";
    }

    var
      startDate       = $scope.startDate,
      endDate         = $scope.endDate,
      dateString      = startDate.getFullYear() + "-" + (startDate.getMonth() + 1) + "-" + startDate.getDate() + "," +
        endDate.getFullYear() + "-" + (endDate.getMonth() + 1) + "-" + endDate.getDate(),
      reportsUrl      = "",
      accumulativeUrl = "",
      topFeaturesUrl  = ""
      ;

    if ($scope.campaign_id === "all") {
      reportsUrl      = urlPrefix + "/b9/report/";
      accumulativeUrl = urlPrefix + "/c1/report/";
      dateString += "/";
      topFeaturesUrl  = urlPrefix + "/c1/report/18/" + dateString
    } else {
      reportsUrl      = "/b7/report/";
      accumulativeUrl = "/c2/report/";
      dateString += "/" + $scope.campaign_id;
      topFeaturesUrl  = "/c2/report/18/" + dateString;
    }

    $scope.currentChart = chartType;

    if (accumulativeUrl != $rootScope.accumulativeUrl || $scope.ctr == undefined) {
      $rootScope.accumulativeUrl = accumulativeUrl;
      $http({
        method: 'GET',
        url   : topFeaturesUrl
      }).then(function (response) {
        $scope.ctr         = response.data[0].ctr.toFixed(4);
        $scope.eCPM        = response.data[0].cpm.toFixed(4);
        $scope.conversions = response.data[0].convrate.toFixed(4);
      });
    }

    var
      load_n_ProcessData    = commonService.load_n_ProcessData,
      improveData           = commonService.improveData,
      addInteractivity      = commonService.addInteractivity,
      streamGraphDimensions = commonService.getStreamGraphDimensions()
      ;


    switch (chartType) {
      case 'impressions':

        var url  = reportsUrl + "1/" + dateString;
        var url2 = accumulativeUrl + "1/" + dateString;
        load_n_ProcessData({
          jsonPath     : url,
          sortKey      : "date",
          commonService: commonService,
          viewScope    : $scope,
          callback     : function (dataObj) {

            var
              axisYkey    = "impressions",
              highestYKey = d3.max(dataObj.data, function (d) {
                return d[axisYkey];
              }),
              scaleDetails
              ;

            $scope.scaleDetails = scaleDetails = commonService.getDiv_n_Scale(highestYKey);
            streamGraphChart({
              targetID     : 'performanceChart',
              dataObj      : {data: dataObj.data, improveData: improveData},
              axis         : {
                axisXkey    : "date",
                axisYkey    : axisYkey,
                'x'         : true,
                'y'         : true,
                'xLabel'    : '',
                'yLabel'    : 'Impressions',
                scaleDetails: $scope.scaleDetails
              },
              margin       : {top: 10, right: 10, bottom: 45, left: 80},
              dimensions   : streamGraphDimensions,
              nestKey      : "channel",
              commonService: $scope.commonService
            });

            load_n_ProcessData({
              jsonPath     : url2,
              sortKey      : "date",
              commonService: commonService,
              viewScope    : $scope,
              callback     : function (dataObj2) {
                d3.select('#eCPMChart').style({'display': 'block'});
                dataObj.data         = dataObj.data.concat(dataObj2.data);
                var
                  axisYkey2          = "cpm",
                  highestYKey2       = d3.max(dataObj.data, function (d) {
                    return d[axisYkey2];
                  }),
                  scaleDetails2
                  ;
                $scope.scaleDetails2 = scaleDetails2 = commonService.getDiv_n_Scale(highestYKey2);
                multilineGraph({
                  targetID     : 'eCPMChart',
                  dataObj      : {data: dataObj.data, improveData: improveData},
                  axis         : {
                    axisXkey    : "date",
                    axisYkey    : "cpm",
                    'x'         : true,
                    'y'         : true,
                    'xLabel'    : '',
                    'yLabel'    : 'eCPM',
                    scaleDetails: $scope.scaleDetails2
                  },
                  margin       : {top: 30, right: 10, bottom: 45, left: 80},
                  dimensions   : streamGraphDimensions,
                  nestKey      : "channel",
                  commonService: $scope.commonService
                });

                var cpmScale      = (!!scaleDetails2.numberScale) ? '(in ' + scaleDetails2.numberScale + ')' : '';
                var impScale      = (!!scaleDetails.numberScale) ? '(in ' + scaleDetails.numberScale + ')' : '';
                $scope.columnDefs = [
                  {field: 'date', displayName: 'Date', cellFilter: $scope.dateFormat, enableFiltering: false},
                  {field: 'channel', displayName: 'Channel', enableFiltering: true},
                  {
                    field          : 'impressions',
                    displayName    : 'Impressions ' + impScale/*, cellTemplate:'<div class="ui-grid-cell-contents">{{row.entity.impressions}}</div>'*/,
                    enableFiltering: false
                  },
                  {
                    field          : 'cpm',
                    displayName    : 'CPM ' + cpmScale/*, cellTemplate:'<div class="ui-grid-cell-contents">{{row.entity.cpm }}</div>'*/,
                    enableFiltering: false
                  },
                  {field: 'cost', displayName: 'Cost', enableFiltering: false}
                ];

                $scope.tabularData = dataObj.data;
                $scope.$apply();


                commonService.addInteractivity({"id": "charts", currentChart: $scope.currentChart});
                /*doTheRest({tabularData:dataObj.data, currentChart:$scope.currentChart, commonService:commonService, viewScope:$scope});*/
              }
            });
          }
        });

        break;

      case 'clicks':


        var url  = reportsUrl + "2/" + dateString;
        var url2 = accumulativeUrl + "2/" + dateString;
        load_n_ProcessData({

          jsonPath     : url,
          sortKey      : "date",
          highestYKey  : 'clicks',
          commonService: commonService,
          viewScope    : $scope,

          callback: function (dataObj) {

            var
              axisYkey    = "clicks",
              highestYKey = d3.max(dataObj.data, function (d) {
                return d[axisYkey];
              }),
              scaleDetails
              ;

            $scope.scaleDetails = scaleDetails = commonService.getDiv_n_Scale(highestYKey);

            streamGraphChart({
              targetID     : 'performanceChart',
              dataObj      : {data: dataObj.data, improveData: improveData},
              axis         : {
                axisXkey    : "date",
                axisYkey    : axisYkey,
                'x'         : true,
                'y'         : true,
                'xLabel'    : '',
                'yLabel'    : 'Clicks',
                scaleDetails: $scope.scaleDetails
              },
              margin       : {top: 10, right: 10, bottom: 45, left: 80},
              dimensions   : streamGraphDimensions,
              nestKey      : "channel",
              commonService: $scope.commonService
            });

            load_n_ProcessData({
              jsonPath     : url2,
              sortKey      : "date",
              commonService: commonService,
              viewScope    : $scope,
              callback     : function (dataObj2) {

                var
                  axisYkey    = "cpc",
                  highestYKey = d3.max(dataObj.data, function (d) {
                    return d[axisYkey];
                  }),
                  scaleDetails2
                  ;
                d3.select('#eCPMChart').style({'display': 'block'});
                $scope.scaleDetails2 = scaleDetails2 = commonService.getDiv_n_Scale(highestYKey);
                dataObj.data = dataObj.data.concat(dataObj2.data);

                multilineGraph({
                  targetID     : 'eCPMChart',
                  dataObj      : {data: dataObj.data, improveData: improveData},
                  axis         : {
                    axisXkey    : "date",
                    axisYkey    : axisYkey,
                    'x'         : true,
                    'y'         : true,
                    'xLabel'    : '',
                    'yLabel'    : 'Cost per click',
                    scaleDetails: $scope.scaleDetails2
                  },
                  margin       : {top: 10, right: 10, bottom: 45, left: 80},
                  dimensions   : streamGraphDimensions,
                  nestKey      : "channel",
                  commonService: $scope.commonService
                });
                var clickScale    = (!!scaleDetails.numberScale) ? '(in ' + scaleDetails.numberScale + ')' : '';
                var cpcScale      = (!!scaleDetails2.numberScale) ? '(in ' + scaleDetails2.numberScale + ')' : '';
                $scope.columnDefs = [
                  {field: 'date', displayName: 'Date', cellFilter: $scope.dateFormat, enableFiltering: false},
                  {field: 'channel', displayName: 'Channel', enableFiltering: true},
                  {
                    field          : 'clicks',
                    displayName    : 'Clicks ' + clickScale, /*cellTemplate:'<div class="ui-grid-cell-contents">{{row.entity.clicks * grid.appScope.scaleDetails.division}}</div>',*/
                    enableFiltering: false
                  },
                  {field: 'cost', displayName: 'Cost', enableFiltering: false},
                  {field: 'cpc', displayName: 'Cost per click' + cpcScale, enableFiltering: false}
                ];

                $scope.tabularData = dataObj.data;
                $scope.$apply();

                /*doTheRest({tabularData:dataObj.data, currentChart:$scope.currentChart, commonService:commonService, viewScope:$scope});*/
                addInteractivity({"id": "charts", currentChart: $scope.currentChart});

              }
            });
          }
        });
        break;

      case 'conversions':

        var url  = reportsUrl + "3/" + dateString;
        var url2 = accumulativeUrl + "3/" + dateString;
        load_n_ProcessData({
          jsonPath     : url,
          sortKey      : "date",
          highestYKey  : 'impressions',
          viewScope    : $scope,
          commonService: commonService,
          callback     : function (dataObj) {

            var
              axisYkey    = "conversions",
              highestYKey = d3.max(dataObj.data, function (d) {
                return d[axisYkey];
              }),
              scaleDetails
              ;

            $scope.scaleDetails = scaleDetails = commonService.getDiv_n_Scale(highestYKey);

            streamGraphChart({
              targetID     : 'performanceChart',
              dataObj      : {data: dataObj.data, improveData: improveData},
              axis         : {
                axisXkey    : "date",
                axisYkey    : axisYkey,
                'x'         : true,
                'y'         : true,
                'xLabel'    : '',
                'yLabel'    : 'Conversions',
                scaleDetails: $scope.scaleDetails
              },
              margin       : {top: 10, right: 10, bottom: 45, left: 80},
              dimensions   : streamGraphDimensions,
              nestKey      : "channel",
              commonService: $scope.commonService
            });

            load_n_ProcessData({
              jsonPath     : url2,
              sortKey      : "date",
              commonService: commonService,
              viewScope    : $scope,
              callback     : function (dataObj2) {
                d3.select('#eCPMChart').style({'display': 'block'});
                dataObj.data = dataObj.data.concat(dataObj2.data);

                var
                  axisYkey    = "cpconversion",
                  highestYKey = d3.max(dataObj.data, function (d) {
                    return d[axisYkey];
                  }),
                  scaleDetails2
                  ;

                $scope.scaleDetails2 = scaleDetails2 = commonService.getDiv_n_Scale(highestYKey);

                multilineGraph({
                  targetID     : 'eCPMChart',
                  dataObj      : {data: dataObj.data, improveData: improveData},
                  axis         : {
                    axisXkey    : "date",
                    axisYkey    : axisYkey,
                    'x'         : true,
                    'y'         : true,
                    'xLabel'    : '',
                    'yLabel'    : 'Cost per conversion',
                    scaleDetails: $scope.scaleDetails2
                  },
                  margin       : {top: 10, right: 10, bottom: 45, left: 80},
                  dimensions   : streamGraphDimensions,
                  nestKey      : "channel",
                  commonService: $scope.commonService
                });

                var conversionScale = (!!scaleDetails.numberScale) ? ' ( in ' + scaleDetails.numberScale + ' )' : '';
                var cpConvScale     = (!!scaleDetails2.numberScale) ? ' ( in ' + scaleDetails2.numberScale + ' )' : '';
                $scope.columnDefs   = [
                  {field: 'date', displayName: 'Date', cellFilter: $scope.dateFormat, enableFiltering: false},
                  {field: 'channel', displayName: 'Channel', enableFiltering: true},
                  {
                    field          : 'conversions',
                    displayName    : 'Conversions' + conversionScale/*, cellTemplate:'<div class="ui-grid-cell-contents">{{ row.entity.conversions }}</div>'*/,
                    enableFiltering: false
                  },
                  {field: 'cost', displayName: 'Cost', enableFiltering: false},
                  {field: 'cpconversion', displayName: 'Cost per conversion ' + cpConvScale, enableFiltering: false}
                ]
                $scope.tabularData  = dataObj.data;

                /*doTheRest({tabularData:dataObj.data, currentChart:$scope.currentChart, commonService:commonService, viewScope:$scope});*/
                addInteractivity({"id": "charts", currentChart: $scope.currentChart});

                $scope.$apply();
              }
            });
          }
        });

        break;

      case 'cost':

        var url = reportsUrl + "4/" + dateString;
        load_n_ProcessData({
          jsonPath     : url,
          sortKey      : "date",
          viewScope    : $scope,
          commonService: commonService,
          callback     : function (dataObj) {

            var
              axisYkey    = "cost",
              highestYKey = d3.max(dataObj.data, function (d) {
                return d[axisYkey];
              }),
              scaleDetails
              ;

            $scope.scaleDetails = scaleDetails = commonService.getDiv_n_Scale(highestYKey)
            streamGraphChart({
              targetID     : 'performanceChart',
              dataObj      : {data: dataObj.data, improveData: improveData},
              axis         : {
                axisXkey    : "date",
                axisYkey    : axisYkey,
                'x'         : true,
                'y'         : true,
                'xLabel'    : '',
                'yLabel'    : 'Cost',
                scaleDetails: $scope.scaleDetails
              },
              margin       : {top: 10, right: 10, bottom: 45, left: 80},
              dimensions   : streamGraphDimensions,
              nestKey      : "channel",
              commonService: $scope.commonService

            });

            var costScale      = (!!scaleDetails.numberScale) ? ' ( in ' + scaleDetails.numberScale + ' )' : '';
            $scope.columnDefs  = [
              {field: 'date', displayName: 'Date', cellFilter: $scope.dateFormat, enableFiltering: false},
              {field: 'channel', displayName: 'Channel', enableFiltering: true},
              {field: 'cost', displayName: 'Cost ' + costScale, enableFiltering: false}
            ];
            $scope.tabularData = dataObj.data;

            $scope.$apply();

            d3.select('#eCPMChart').style({'display': 'none'});
            addInteractivity({"id": "charts", currentChart: $scope.currentChart});
          }

        });
        /*                chart("performanceChart","/a9/report/4/"+dateString, "multiple","date", "cost",1000000000,"campaign_id");
         addInteractivity({"id":"charts"});*/
        break;

    }
  };

  $scope.$on('campaignIdsAvailable', function () {
    //debugger;
    if (!!$scope.loggedIn) {
      $scope.loadChart($scope.currentChart);
    }
    //console.log('dates loaded init performance controller');
  });

  /*    $scope.$watch('window',function(){
   alert('window changed');
   });*/
  angular.element(commonService.getId("#dashboardLinks")).addClass('active');

}]);