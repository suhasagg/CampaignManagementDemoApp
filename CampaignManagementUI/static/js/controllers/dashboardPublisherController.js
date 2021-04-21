"use strict";
var cubeRootApp =  angular.module('CubeRootApp');
cubeRootApp.controller("dashboardPublisherCtrl",["$scope","commonService",function($scope,commonService){
    $scope.currentChart = "reach"; 
    $scope.updateChart = commonService.updateChart($scope);
    
	var today = new Date();
	var priorDate = new Date(new Date().setDate(today.getDate()-30));
    
	$scope.endDate = today;
	$scope.startDate = priorDate;
    var urlPrefix = commonService.getUrlPrefix();

    $scope.updateTabularData = function(tableType){

        var
            demographicTableTabs = d3.select("#demographicTableTabs"),
            brand_DevicesTableTabs = d3.select("#brand_DevicesTableTabs")
        ;

        if(tableType == 'ageRange'){
            demographicTableTabs.selectAll('a').classed('active',false);
            demographicTableTabs.select('.ageRange').classed('active',true);
            var
                scaleDetails=$scope.scaleDetails,
                scaleTxt = (!!scaleDetails.numberScale) ? ' ( in '+scaleDetails.numberScale+' )' : ''
            ;

            $scope.enableColumnFiltering = false;
            $scope.columnDefs = $scope.ageRangeColumnDefs;
            $scope.tabularData = $scope.ageRangeData;

        } else if(tableType == 'gender') {
            demographicTableTabs.selectAll('a').classed('active',false);
            demographicTableTabs.select('.gender').classed('active',true);
            $scope.enableColumnFiltering = false;
            $scope.columnDefs = $scope.genderColumnDefs;
            $scope.tabularData = $scope.genderData;
        } else if(tableType == 'brands') {
            var
                scaleDetails=$scope.scaleDetails2,
                scaleTxt = (!!scaleDetails.numberScale) ? ' ( in '+scaleDetails.numberScale+' )' : ''
            ;
            brand_DevicesTableTabs.selectAll('a').classed('active',false);
            brand_DevicesTableTabs.select('.brands').classed('active',true);
            $scope.enableColumnFiltering = false;
            $scope.columnDefs = $scope.brandsColumnDefs;
            $scope.tabularData = $scope.BrandsData;

        } else if(tableType == 'devices'){

            var
                scaleDetails=$scope.scaleDetails,
                scaleTxt = (!!scaleDetails.numberScale) ? ' ( in '+scaleDetails.numberScale+' )' : ''
            ;

            brand_DevicesTableTabs.selectAll('a').classed('active',false);
            brand_DevicesTableTabs.select('.devices').classed('active',true);
            $scope.enableColumnFiltering = false;
            $scope.columnDefs = $scope.devicesColumnDefs;
            $scope.tabularData = $scope.devicesData;
        }
    };

    $scope.loadChart = function(chartType, opts){

        var
            startDate = $scope.startDate,
            endDate = $scope.endDate,
            dateString = startDate.getFullYear() + "-" + (startDate.getMonth() + 1) + "-" + startDate.getDate() + "," +
                endDate.getFullYear() + "-" + (endDate.getMonth() + 1) + "-" + endDate.getDate(),
            reportsUrl = urlPrefix+"/publisher/report/",
            tableBlock = angular.element(commonService.getId('.tableBlock'))
        ;

        (chartType==='devices_n_brand') ? tableBlock.addClass('devices_n_brand') : tableBlock.removeClass('devices_n_brand');
        (chartType==='demographics') ? tableBlock.addClass('demographics') : tableBlock.removeClass('demographics');

        (!$scope.campaign_id) ? $scope.campaign_id = "all" : '';

        dateString += ($scope.campaign_id!='all') ? "/"+$scope.campaign_id : '';

        $scope.currentChart = chartType;

        var
            load_n_ProcessData = commonService.load_n_ProcessData,
            improveData = commonService.improveData,
            addInteractivity = commonService.addInteractivity,
            chartsId = angular.element(commonService.getId("#charts"))
        ;

        function clearForNewGraph() {
            
            chartsId.attr('class','');
            chartsId.addClass('charts reports publisher');
            d3.select('#chart1 .svgBlock').html("");
            d3.select('#chart2 .svgBlock').html("");
            d3.selectAll('.chartTooltip').style({'display': 'none'});
            d3.selectAll("h3").remove();
        }
        ($scope.currentChart != "subPieChart") ? clearForNewGraph() : '';

        switch (chartType){

            case 'reach':

                url = reportsUrl+"6/"+dateString;

                load_n_ProcessData({
                    jsonPath : url,
                    sortKey: "date",
                    viewScope:$scope,
                    commonService:commonService,
                    callback:function(dataObj){

                        var
                            axisYkey = "reach",
                            highestYKey = d3.max(dataObj.data, function(d) { return d[axisYkey]; }),
                            scaleDetails
                        ;

                        $scope.scaleDetails = scaleDetails = commonService.getDiv_n_Scale(highestYKey);
                        clearForNewGraph();
                        chartsId.addClass('reach');

                        var dimensions = commonService.getStreamGraphDimensions();
                        dimensions.height = '30%';

                        multilineGraph({
                            targetID: 'chart1',
                            dataObj: {data: dataObj.data, improveData: improveData},
                            axis: {
                                axisXkey: "date",
                                axisYkey: axisYkey,
                                'x': true,
                                'y': true,
                                'xLabel': '',
                                'yLabel': 'User Reached',
                                scaleDetails: $scope.scaleDetails
                            },
                            margin: {top: 10, right: 10, bottom: 45, left: 80},
                            dimensions: dimensions,
                            nestKey: "channelName",
                            commonService: $scope.commonService
                        });

                        /*
                         barChart({
                         targetID:"chart1",
                         data:dataObj.data,
                         commonService:commonService,
                         dimensions:dimensions,
                         axis:{
                         'x': true,
                         'y': true,
                         'xLabel': 'Dates',
                         'yLabel': 'User Reached',
                         axisXkey: 'date',
                         axisYkey: axisYkey,
                         scaleDetails: $scope.scaleDetails,
                         axisXType: 'date'
                         },
                         margin:{top:40,right:10,bottom:30,left:100}
                         });
                         */

                        var reachScale = (!!scaleDetails.numberScale) ? '(in ' + scaleDetails.numberScale + ')' : '';
                        $scope.enableColumnFiltering = true;
                        $scope.columnDefs = [
                            {field: 'date', displayName: 'Date', cellFilter: $scope.dateFormat},
                            {
                                field: 'reach',
                                displayName: 'Reach ' + reachScale/*, cellTemplate:'<div class="ui-grid-cell-coentents">{{row.entity.count}}</div>'*/
                            }
                        ];

                        $scope.tabularData = dataObj.data;
                        $scope.$apply();
                        addInteractivity({"id": "charts", 'currentChart': $scope.currentChart});
                    }
                });

                break;

            case 'timeOfTheDay':

                url = reportsUrl+"17/"+dateString;
                //url = 'static/dummyData/timeOfTheDay.json';


                load_n_ProcessData({
                    jsonPath : url,
                    /*sortKey: "time_of_day",*/
                    viewScope:$scope,
                    commonService:commonService,
                    callback:function(dataObj){

                        var
                            axisYkey = "count",
                            highestYKey = d3.max(dataObj.data, function(d) { return d[axisYkey]; }),
                            scaleDetails
                            ;

                        $scope.scaleDetails = scaleDetails = commonService.getDiv_n_Scale(highestYKey)
                        clearForNewGraph();
                        chartsId.addClass('timeOfTheDay');
                        var dimensions = commonService.getBarChartDimensions();;
                        dimensions.height = '40%';

                        barChart({
                            targetID:"chart1",
                            data:dataObj.data,
                            commonService:commonService,
                            dimensions:dimensions,
                            axis: {
                                'x': true,
                                'y': true,
                                'xLabel': 'Time',
                                'yLabel': 'User Reached',
                                axisXkey: 'time_of_day',
                                axisYkey: axisYkey,
                                scaleDetails: $scope.scaleDetails,
                                /*axisXType: 'dateTime',
                                xTiltDeg: -45*/
                            },
                            margin: {top: 40, right: 10, bottom: 90, left: 100}
                        });

                        var scaleTxt = (!!scaleDetails.numberScale) ? '(in ' + scaleDetails.numberScale + ')' : '';
                        $scope.enableColumnFiltering = true;
                        $scope.columnDefs = [
                            {field: 'time_of_day', displayName: 'Time of the Day', cellFilter: $scope.dateFormat},
                            {
                                field: axisYkey,
                                displayName: 'User Reached ' + scaleTxt
                            }
                        ];
                        $scope.tabularData = dataObj.data;
                        $scope.$apply();
                        addInteractivity({"id": "charts", 'currentChart': $scope.currentChart});
                    }
                });

                break;

            case 'interest':
            chartsId.addClass('interest');

            var url = reportsUrl+'7/'+dateString;
                //url = 'static/dummyData/publisherInterestData.json';

                load_n_ProcessData({
                    jsonPath : url,
                    sortKey: "count",
                    sortOrder:'reverse',
                    viewScope:$scope,
                    limit:10,
                    commonService:commonService,
                    dateRange:dateString,
                    callback:function(dataObj){

                        var
                            axisXkey = "count",
                            highestYKey = d3.max(dataObj.data, function(d) { return d[axisXkey]; }),
                            scaleDetails
                        ;

                        $scope.scaleDetails = scaleDetails = commonService.getDiv_n_Scale(highestYKey);
                        var dimensions = commonService.getBarChartHorizontalDimensions();

                    barChartHorizontal({
                            targetID:"chart1",
                            data:dataObj.data,
                            commonService:commonService,
                            /*dimensions:{"width":"100%","height":"70%"},*/
                            dimensions:dimensions,
                            axis: {
                                'x': true,
                                'y': true,
                                'xLabel': 'Count',
                                'yLabel': 'Segments',
                                axisYkey: 'audience_segment',
                                axisXkey: axisXkey,
                                scaleDetails: $scope.scaleDetails
                            },
                            margin:{top:40,right:10,bottom:30,left:35},
                            subChartDataField:'audience_segment_data'
                        });

                        var scaleTxt = (!!scaleDetails.numberScale) ? ' ( in '+scaleDetails.numberScale+' )' : '';
                        $scope.enableColumnFiltering = false; 
                        $scope.columnDefs = [
                            { field: 'audience_segment', displayName: 'Segment' },
                            { field: 'count', displayName: 'Count'+ scaleTxt}
                        ];
                        $scope.tabularData = dataObj.data;
                        $scope.$apply();

                        addInteractivity({"id":"charts",'currentChart':$scope.currentChart});

                    }
                });

            break;

            case 'os':
                chartsId.addClass('os');

                var url = reportsUrl+'3/'+dateString;
                //url="static/dummyData/barChartData.json";
                load_n_ProcessData({
                    jsonPath : url,
                    sortKey: "count",
                    sortOrder:'reverse',
                    viewScope:$scope,
                    limit:10,
                    commonService:commonService,
                    dateRange:dateString,
                    callback:function(dataObj){
                        var dimensions = commonService.getBarChartDimensions();
                        dimensions.height='45%';
                        barChart({
                            targetID:"chart1",
                            data:dataObj.data,
                            commonService:commonService,
                            dimensions:dimensions,
                            axis:{'x':true,'y':true,'xLabel':'Operating Systems','yLabel':'Count',axisXkey:'os', axisYkey:'count'},
                            margin:{top:40,right:10,bottom:30,left:100}
                        });

                        $scope.columnDefs = [
                            { field: 'os', displayName: 'Operating System' },
                            { field: 'count', displayName: 'Count' }
                        ];
                        $scope.tabularData = dataObj.data;
                        $scope.$apply();

                        addInteractivity({"id":"charts",'currentChart':$scope.currentChart});

 
                    }
                });

                break;

            case 'isp':
                chartsId.addClass('isp');

                var url = reportsUrl+'15/'+dateString;
                //url="static/dummyData/publisherISP.json";

                load_n_ProcessData({
                    jsonPath : url,/*
                    sortKey: "count",
                    sortOrder:'reverse',*/
                    viewScope:$scope,
                    limit:50,
                    commonService:commonService,
                    dateRange:dateString,
                    callback:function(dataObj){
                        var dimensions = commonService.getBarChartDimensions();
                        dimensions.height='45%';
                        barChart({
                            targetID:"chart1",
                            data:dataObj.data,
                            commonService:commonService,
                            dimensions:dimensions,
                            axis: {
                                'x': true,
                                'y': true,
                                'xLabel': 'ISP',
                                'yLabel': 'Count',
                                axisXkey: 'isp',
                                axisYkey: 'count',
                                xTiltDeg: -45
                            },
                            margin:{top:40,right:10,bottom:200,left:100}
                        });

                        $scope.columnDefs = [
                            { field: 'isp', displayName: 'ISP' },
                            { field: 'count', displayName: 'Count' }
                        ];
                        $scope.tabularData = dataObj.data;
                        $scope.$apply();

                        addInteractivity({"id":"charts",'currentChart':$scope.currentChart});


                    }
                });

                break;

            case 'orgnisation':
                chartsId.addClass('organisation');

                var url = reportsUrl+'16/'+dateString;
                //url="static/dummyData/publisherISP.json";

                load_n_ProcessData({
                    jsonPath : url,
                    sortKey: "count",
                    /*sortOrder:'reverse',*/
                    viewScope:$scope,
                    limit:70,
                    commonService:commonService,
                    dateRange:dateString,
                    callback:function(dataObj){
                        var dimensions = commonService.getBarChartDimensions();
                        dimensions.height='45%';
                        barChart({
                            targetID:"chart1",
                            data:dataObj.data,
                            commonService:commonService,
                            dimensions:dimensions,
                            axis: {
                                'x': true,
                                'y': true,
                                'xLabel': 'Organisation',
                                'yLabel': 'Count',
                                axisXkey: 'organisation',
                                axisYkey: 'count',
                                xTiltDeg: -45
                            },
                            margin:{top:40,right:10,bottom:200,left:100}
                        });

                        $scope.columnDefs = [
                            { field: 'organisation', displayName: 'Organisation' },
                            { field: 'count', displayName: 'Count' }
                        ];
                        $scope.tabularData = dataObj.data;
                        $scope.$apply();

                        addInteractivity({"id":"charts",'currentChart':$scope.currentChart});


                    }
                });

                break;

            case 'devices_n_brand':
                chartsId.addClass('devices_n_brand');
                angular.element(commonService.getId('.tableBlock')).addClass('devices_n_brand');

/*
                console.log(commonService.getBarChartDimensions());
                console.log(commonService.getBarChartHorizontalDimensions());
*/

                var url = reportsUrl+'1/'+dateString;
                //url="static/dummyData/barChartData.json";
                load_n_ProcessData({
                    jsonPath : url,
                    sortKey: "count",
                    sortOrder:'reverse',
                    viewScope:$scope,
                    limit:10,
                    commonService:commonService,
                    dateRange:dateString,
                    callback:function(dataObj){
                        var
                            targetId = "chart2",
                            axisYkey = "count",
                            highestYKey = d3.max(dataObj.data, function(d) { return d[axisYkey]; }),
                            scaleDetails2
                        ;

                        $scope.scaleDetails2 = scaleDetails2 = commonService.getDiv_n_Scale(highestYKey);
                        d3.select("#"+targetId+' h3').remove();
                        d3.select("#"+targetId).insert("h3",":first-child").text('Brands');

                        var dimensions = commonService.getBarChartDimensions();
                        dimensions.height='100%';

                        barChart({
                            targetID:targetId,
                            data:dataObj.data,
                            commonService:commonService,
                            dimensions:dimensions,
                            axis: {
                                'x': true,
                                'y': true,
                                'xLabel': 'Brands',
                                'yLabel': 'Count',
                                axisXkey: 'brandname',
                                axisYkey: 'count',
                                xTiltDeg: -90,
                                scaleDetails : $scope.scaleDetails2
                            },
                            margin:{top:40,right:10,bottom:70,left:70}
                        });

                        /*
                            var
                                scaleTxt = (!!scaleDetails2.numberScale) ? ' ( in '+scaleDetails2.numberScale+' )' : '',
                                demographicTableTabs = d3.select("#brand_DevicesTableTabs")
                            ;
                            demographicTableTabs.select('.brands').classed('active',true);

                            $scope.tabularData = dataObj.data;
                            $scope.OSData = dataObj.data;
                            $scope.$apply();

                            addInteractivity({"id":"charts",'currentChart':$scope.currentChart});
                        */
                        var
                            scaleTxt = (!!scaleDetails2.numberScale) ? ' ( in '+scaleDetails2.numberScale+' )' : ''
                        ;
                        $scope.enableColumnFiltering = false;
                        $scope.brandsColumnDefs = [
                            { field: 'brandname', displayName: 'Brand Name' },
                            { field: 'count', displayName: 'Count '+scaleTxt }
                        ];
                        $scope.BrandsData = dataObj.data;
                    }
                });

                var url = reportsUrl+'4/'+dateString;
                //url="static/dummyData/barChartData.json";
                load_n_ProcessData({
                    jsonPath : url,
                    sortKey: "count",
                    sortOrder:'reverse',
                    viewScope:$scope,
                    commonService:commonService,
                    limit:10,
                    dateRange:dateString,
                    callback:function(dataObj){
                        var
                            targetId = "chart1",
                            axisXkey = "count",
                            highestXKey = d3.max(dataObj.data, function(d) { return d[axisXkey]; }),
                            scaleDetails
                        ;

                        $scope.scaleDetails = scaleDetails = commonService.getDiv_n_Scale(highestXKey);
                        d3.select("#"+targetId+' h3').remove();
                        d3.select("#"+targetId).insert("h3",":first-child").text('Devices');

                        var dimensions = commonService.getBarChartHorizontalDimensions();
                        dimensions.height='100%';

                        barChartHorizontal({
                            targetID:targetId,
                            data:dataObj.data,
                            commonService:commonService,
                            dimensions:dimensions,
                            axis: {
                                'x': true,
                                'y': true,
                                'xLabel': 'Count',
                                'yLabel': 'Devices',
                                axisYkey: 'mobile_device_properties',
                                axisXkey: axisXkey,
                                scaleDetails: $scope.scaleDetails
                            },
                            margin:{top:40,right:30,bottom:80,left:10}
                        });
                        $scope.devicesData = dataObj.data;
                        $scope.tabularData = dataObj.data;

                        var
                            scaleTxt = (!!scaleDetails.numberScale) ? ' ( in '+scaleDetails.numberScale+' )' : '',
                            brand_DevicesTableTabs = d3.select("#brand_DevicesTableTabs")
                        ;
                        brand_DevicesTableTabs.select('a').classed('active',false);
                        brand_DevicesTableTabs.select('.devices').classed('active',true);
                        $scope.enableColumnFiltering = false;

                        $scope.columnDefs = $scope.devicesColumnDefs = [
                            { field: 'mobile_device_properties', displayName: 'Device' },
                            { field: axisXkey, displayName: 'Count'+scaleTxt }
                        ];
                        $scope.$apply();
                        addInteractivity({"id":"charts",'currentChart':$scope.currentChart});
                    }
                });

                break;
            case 'demographics':

                chartsId.addClass('demographics');

                //Age Range
                var url = reportsUrl+'13/'+dateString;
                //url = 'static/dummyData/publisherAgeRange.json';
                load_n_ProcessData({
                    jsonPath : url,
                    /*sortKey: "reach",
                    sortOrder:'reverse',*/
                    viewScope:$scope,
                    limit:10,
                    commonService:commonService,
                    dateRange:dateString,
                    callback:function(dataObj){

                        var
                            targetId = "chart1",
                            axisYkey = "count",
                            highestYKey = d3.max(dataObj.data, function(d) { return d[axisYkey]; }),
                            scaleDetails
                        ;

                        $scope.scaleDetails = scaleDetails = commonService.getDiv_n_Scale(highestYKey);

                        $scope.tabularData = dataObj.data;
                        $scope.$apply();

/*                       var dimensions = commonService.getBarChartDimensions();
                        dimensions.height='100%';
                        barChart({
                            targetID:targetId,
                            data:dataObj.data,
                            commonService:commonService,
                            dimensions:dimensions,
                            axis: {
                                'x': true,
                                'y': true,
                                'xLabel': 'Age Range',
                                'yLabel': 'Count',
                                axisXkey: 'age',
                                axisYkey: 'count',
                                scaleDetails : $scope.scaleDetails
                            },
                            margin:{top:40,right:10,bottom:80,left:80}
                        });*/
                        pieChart({
                            targetID:targetId,
                            data:dataObj.data,
                            title:'Age Range',
                            dimensions:{"width":"100%","height":"60%"},
                            'x':false,'y':false,
                            axis: {
                                'x': true,
                                'y': true,
                                'xLabel': 'Age Range',
                                'yLabel': 'Count',
                                axisXkey: 'age',
                                axisYkey: axisYkey,
                                scaleDetails: $scope.scaleDetails
                            },
                            margin:{top:0,right:0,bottom:0,left:0},
                            viewScope:$scope,
                            commonService:commonService
                        });

                        $scope.enableColumnFiltering = false;
                        var demographicTableTabs = d3.select("#demographicTableTabs");
                        demographicTableTabs.select('.ageRange').classed('active',true);

                        var scaleTxt = (!!scaleDetails.numberScale) ? ' ( in '+scaleDetails.numberScale+' )' : '';
                        $scope.columnDefs = $scope.ageRangeColumnDefs = [
                            { field: 'age', displayName: 'Age Range'},
                            { field: 'count', displayName: 'Count'+scaleTxt}
                        ];
                        $scope.ageRangeData = dataObj.data;
                        $scope.tabularData = $scope.ageRangeData;
                        $scope.$apply();

                    }
                });

                //Gender
                var url = reportsUrl+'14/'+dateString;
                //url = 'static/dummyData/publisherGenData.json';
                load_n_ProcessData({
                    jsonPath : url,
/*                    sortKey: "count",
                    sortOrder:'reverse',*/
                    viewScope:$scope,
                    limit:10,
                    commonService:commonService,
                    dateRange:dateString,
                    callback:function(dataObj){

                        var
                            targetId = "chart2",
                            axisYkey = "count",
                            highestYKey = d3.max(dataObj.data, function(d) { return d[axisYkey]; }),
                            scaleDetails2
                        ;
                        $scope.scaleDetails2 = scaleDetails2 = commonService.getDiv_n_Scale(highestYKey);

/*                      var dimensions = commonService.getBarChartDimensions();
                        dimensions.height='100%';

                        barChart({
                            targetID:targetId,
                            data:dataObj.data,
                            commonService:commonService,
                            dimensions:dimensions,
                            axis: {
                                'x': true,
                                'y': true,
                                'xLabel': 'Gender',
                                'yLabel': 'Count',
                                axisXkey: 'gender',
                                axisYkey: 'count',
                                xTiltDeg: -90,
                                scaleDetails : $scope.scaleDetails2
                            },
                            margin:{top:40,right:10,bottom:80,left:80}
                        });*/

                        pieChart({
                            targetID:targetId,
                            data:dataObj.data,
                            title:'Gender',
                            dimensions:{"width":"100%","height":"60%"},
                            'x':false,'y':false,
                            axis: {
                                'x': true,
                                'y': true,
                                'xLabel': 'Gender',
                                'yLabel': 'Count',
                                axisXkey: 'gender',
                                axisYkey: axisYkey,
                                scaleDetails: $scope.scaleDetails2
                            },
                            margin:{top:0,right:0,bottom:0,left:0},
                            viewScope:$scope,
                            commonService:commonService
                        });

                        var
                            scaleDetails=$scope.scaleDetails2,
                            scaleTxt = (!!scaleDetails.numberScale) ? ' ( in '+scaleDetails.numberScale+' )' : ''
                        ;
                        $scope.enableColumnFiltering = false;

                        $scope.genderColumnDefs = [
                            { field: 'gender', displayName: 'Gender'},
                            { field: 'count', displayName: 'Count'+ scaleTxt}
                        ];
                        $scope.genderData = dataObj.data;
                        addInteractivity({"id":"charts",'currentChart':$scope.currentChart});
                    }
                });
            break;
            case 'geographic':
                chartsId.addClass('geographic');

                var url = reportsUrl+'10/'+dateString;
                //var topoJsonFile = "static/dummyData/world-110m2.json";
                var topoJsonFile = "static/js/D3Charts/world-50m.json";

                load_n_ProcessData({
                    jsonPath : topoJsonFile,
                    viewScope:$scope,
                    skipProcessing: true,
                    commonService:commonService,
                    callback:function(topoJsonData) {
                        var skipped = 0;
                        load_n_ProcessData({
                            jsonPath: url,
                            viewScope: $scope,
                            skipProcessing: true,
                            commonService: commonService,
                            callback: function (dataObj) {
                                var validData=[] , axisXKey = 'latitude_longitude';
                                dataObj.data.forEach(function(d){
                                    d.count = +d.count;
                                    if(!!d[axisXKey]){
                                        var cityDetails = d[axisXKey].split("_");
                                        d[axisXKey] = cityDetails[0];
                                        d.lat = cityDetails[2];
                                        d.long = cityDetails[1];
                                        if(!d.lat || !d.long){
                                            //delete d;
                                            //debugger;
                                            skipped++;
                                        } else {
                                            validData.push(d);
                                        }
                                    }
                                });
                                dataObj.data = validData;
/*console.log('Skipped '+skipped);
console.log(validData.length); */
                                var
                                    targetId = "chart1",
                                    axisYkey = "count",
                                    highestYKey = d3.max(dataObj.data, function(d) {
                                        return d[axisYkey];
                                    }),
                                    scaleDetails
                                ;
                                $scope.scaleDetails = scaleDetails = commonService.getDiv_n_Scale(highestYKey);

                                geoChart({
                                    targetID:targetId,
                                    topoJsonData: topoJsonData.data,
                                    data: dataObj.data,
                                    commonService: commonService,
                                    dimensions: {"width": "100%", "height": "44%", minHeight:250},
                                    axis: {
                                        'x': true,
                                        'y': true,
                                        'xLabel': 'City',
                                        'yLabel': 'Count',
                                        axisXkey: axisXKey,
                                        axisYkey: axisYkey,
                                        scaleDetails: $scope.scaleDetails
                                    }
                                    
                                });

                                var scaleTxt = (!!scaleDetails.numberScale) ? ' ( in '+scaleDetails.numberScale+' )' : '';
                                $scope.enableColumnFiltering = true;
                                $scope.columnDefs = [
                                    { field: 'latitude_longitude', displayName: 'City', enableFiltering:true },
                                    { field: 'count', displayName: 'Count'+scaleTxt }
                                ];
                                $scope.tabularData = dataObj.data;

                                $scope.$apply();


                                addInteractivity({"id": "charts", 'currentChart': $scope.currentChart,showGrid:false});
                            }
                        });
                    }
                });
            break;


            case 'subPieChart':

                var
                    targetId = "chart2",
                    axisYkey = "count",
                    highestYKey = d3.max(opts.data, function(d) {
                        return d[axisYkey];
                    }),
                    scaleDetails
                ;
                $scope.scaleDetails = scaleDetails = commonService.getDiv_n_Scale(highestYKey);

                //var displayVal = (!!commonService.isHandHeldDevice()) ? 'table' : 'inline-block';
                d3.select('#'+targetId).style('display','inline-block');
                d3.select('#'+targetId+" .svgBlock").html("");

                pieChart({
                    targetID:targetId,
                    data:opts.data,
                    title:opts.title,
                    dimensions:{"width":"100%","height":"100%"},
                    'x':false,'y':false,
                    axis: {
                        'x': true,
                        'y': true,
                        'xLabel': 'Audiences',
                        'yLabel': 'Count',
                        axisXkey: 'audience_segment',
                        axisYkey: axisYkey,
                        scaleDetails: $scope.scaleDetails
                    },
                    margin:{top:0,right:0,bottom:0,left:0},
                    viewScope:$scope,
                    commonService:commonService
                });

                $scope.currentChart="interest";

                addInteractivity({"id":"charts", currentChart : $scope.currentChart});

            break;

        }
    };

    $scope.$on('campaignIdsAvailable',function () {
        if(!!$scope.loggedIn) {
            $scope.loadChart($scope.currentChart);
            console.log($scope.campaignIds);
        }
    });

    angular.element(commonService.getId("#dashboardLinks")).addClass('active');

}]);