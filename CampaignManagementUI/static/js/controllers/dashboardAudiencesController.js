"use strict";
var cubeRootApp =  angular.module('CubeRootApp');
cubeRootApp.controller("dashboardAudiencesCtrl",["$scope","commonService",function($scope,commonService){
    $scope.currentChart = "reach";
    $scope.updateChart = commonService.updateChart($scope);
    var urlPrefix = commonService.getUrlPrefix();
    $scope.updateTabularData = function(tableType){

        var
            demographicTableTabs = d3.select("#demographicTableTabs"),
            OS_DevicesTableTabs = d3.select("#OS_DevicesTableTabs")
        ;

        if(tableType == 'ageRange'){
            demographicTableTabs.selectAll('a').classed('active',false);
            demographicTableTabs.select('.ageRange').classed('active',true);
            var
                scaleDetails=$scope.scaleDetails,
                scaleTxt = (!!scaleDetails.numberScale) ? ' ( in '+scaleDetails.numberScale+' )' : ''
            ;

            $scope.enableColumnFiltering = false;
            $scope.columnDefs = [
                { field: 'age', displayName: 'Age Range'},
                { field: 'impressions', displayName: 'Impressions'+scaleTxt}
            ];
            $scope.tabularData = $scope.ageRangeData;

        } else if(tableType == 'gender') {
            demographicTableTabs.selectAll('a').classed('active',false);
            demographicTableTabs.select('.gender').classed('active',true);
            var
                scaleDetails=$scope.scaleDetails2,
                scaleTxt = (!!scaleDetails.numberScale) ? ' ( in '+scaleDetails.numberScale+' )' : ''
            ;
            $scope.enableColumnFiltering = false;
            $scope.columnDefs = [
                { field: 'gender', displayName: 'Gender'},
                { field: 'impressions', displayName: 'Impressions'+ scaleTxt}
            ];
            $scope.tabularData = $scope.genderData;
        } else if(tableType == 'os') {
            var
                scaleDetails=$scope.scaleDetails2,
                scaleTxt = (!!scaleDetails.numberScale) ? ' ( in '+scaleDetails.numberScale+' )' : ''
            ;


            OS_DevicesTableTabs.selectAll('a').classed('active',false);
            OS_DevicesTableTabs.select('.os').classed('active',true);
            $scope.enableColumnFiltering = false;
            $scope.columnDefs = [
                { field: 'os', displayName: 'Operating System' },
                { field: 'impressions', displayName: 'Impressions'+scaleTxt }
            ];
            $scope.tabularData = $scope.OSData;

        } else if(tableType == 'devices'){

            var
                scaleDetails=$scope.scaleDetails,
                scaleTxt = (!!scaleDetails.numberScale) ? ' ( in '+scaleDetails.numberScale+' )' : ''
            ;

            OS_DevicesTableTabs.selectAll('a').classed('active',false);
            OS_DevicesTableTabs.select('.devices').classed('active',true);
            $scope.enableColumnFiltering = false;
            $scope.columnDefs = [
                { field: 'device_type', displayName: 'Device' },
                { field: 'impressions', displayName: 'Impressions' + scaleTxt }
            ];
            $scope.tabularData = $scope.devicesData;
        }
    };

    $scope.loadChart = function(chartType, opts){
    /*try {*/
        var
            startDate = $scope.startDate,
            endDate = $scope.endDate,
            dateString = startDate.getFullYear() + "-" + (startDate.getMonth() + 1) + "-" + startDate.getDate() + "," +
                endDate.getFullYear() + "-" + (endDate.getMonth() + 1) + "-" + endDate.getDate(),
            reportsUrl = urlPrefix+"/b1/report/",
            accumulativeUrl = urlPrefix+"/c2/report/"
        ;

        var tableBlock = angular.element(commonService.getId('.tableBlock'));

        if(!$scope.campaign_id){
            $scope.campaign_id = "all";
        }

        if(chartType==='demographics') {
            tableBlock.addClass('demographics');
        } else {
            tableBlock.removeClass('demographics');
        }

        if(chartType==='os_n_devices') {
            tableBlock.addClass('os_n_devices');
        } else {
            tableBlock.removeClass('os_n_devices');
        }
        dateString +="/"+$scope.campaign_id;

    /*}catch(e){}*/

        $scope.currentChart = chartType;
        var load_n_ProcessData = commonService.load_n_ProcessData;
        var improveData = commonService.improveData;
        var
            addInteractivity = commonService.addInteractivity,
            streamGraphDimensions = commonService.getStreamGraphDimensions()
        ;
        var chartsId = angular.element(commonService.getId("#charts"));
        
        

        function clearForNewGraph() {
            chartsId.attr('class','');
            chartsId.addClass('charts reports');
            d3.select('#chart1 .svgBlock').html("");
            d3.select('#chart2 .svgBlock').html("");
            d3.selectAll('.chartTooltip').style({'display': 'none'});
            d3.selectAll("h3").remove();
        }

        ($scope.currentChart != "subPieChart") ? clearForNewGraph() : '';

        switch (chartType){

            case 'reach':

                if($scope.campaign_id === "all"){
                    reportsUrl =  urlPrefix+"/b9/report/";
                    accumulativeUrl =  urlPrefix+"/c1/report/";

                    dateString = dateString.replace('all','')
                }

                url = reportsUrl+"17/"+dateString;
                var url2 = accumulativeUrl+"17/"+dateString;

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

                        $scope.scaleDetails = scaleDetails = commonService.getDiv_n_Scale(highestYKey)
                        clearForNewGraph();
                        angular.element(commonService.getId("#charts")).addClass('reach');

                        streamGraphChart({
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
                            margin:{top:10,right:10,bottom:45,left:80},
                            dimensions: streamGraphDimensions,
                            nestKey:"channel",
                            commonService:$scope.commonService
                        });

                load_n_ProcessData({
                    jsonPath: url2,
                    sortKey: "date",
                    viewScope: $scope,
                    commonService: commonService,
                    callback: function (dataObj2) {
                        dataObj.data=dataObj.data.concat(dataObj2.data);
                        var
                            axisYkey2 = "cpp",
                            highestYKey2 = d3.max(dataObj.data, function (d) {
                                return d[axisYkey2];
                            }),
                            scaleDetails2
                        ;
                        $scope.scaleDetails2 = scaleDetails2 = commonService.getDiv_n_Scale(highestYKey2);
                        multilineGraph({
                            targetID: 'chart2',
                            dataObj: {data: dataObj.data, improveData: improveData},
                            axis: {
                                axisXkey: "date",
                                axisYkey: axisYkey2,
                                'x': true,
                                'y': true,
                                'xLabel': '',
                                'yLabel': 'Cost per 1000 people',
                                scaleDetails: $scope.scaleDetails2
                            },
                            margin: {top: 10, right: 10, bottom: 45, left: 80},
                            dimensions: streamGraphDimensions,
                            nestKey: "channel",
                            commonService: $scope.commonService
                        });


                        var reachScale = (!!scaleDetails.numberScale) ? '(in ' + scaleDetails.numberScale + ')' : '';
                        var cpcScale = (!!scaleDetails2.numberScale) ? '(in ' + scaleDetails2.numberScale + ')' : '';
                        $scope.enableColumnFiltering = true;
                        $scope.columnDefs = [
                            {field: 'date', displayName: 'Date', cellFilter: $scope.dateFormat},
                            {field: 'channel', displayName: 'Channel', enableFiltering: true},
                            {
                                field: 'reach',
                                displayName: 'Reach ' + reachScale/*, cellTemplate:'<div class="ui-grid-cell-contents">{{row.entity.impressions}}</div>'*/
                            },
                            {
                                field: 'cpconversion',
                                displayName: 'CPC ' + cpcScale/*, cellTemplate:'<div class="ui-grid-cell-contents">{{row.entity.cpm }}</div>'*/
                            },
                            {field: 'cost', displayName: 'Cost'}
                        ];

                        $scope.tabularData = dataObj.data;
                        $scope.$apply();

                        addInteractivity({"id": "charts", 'currentChart': $scope.currentChart});
                    }
                });
            }
        });

                break;

            case 'interest':
            chartsId.addClass('interest');

            var url = reportsUrl+'5/'+dateString;
                load_n_ProcessData({
                    jsonPath : url,
                    sortKey: "impressions",
                    sortOrder:'reverse',
                    viewScope:$scope,
                    limit:10,
                    commonService:commonService,
                    dateRange:dateString,
                    callback:function(dataObj){

                        var
                            axisXkey = "impressions",
                            highestYKey = d3.max(dataObj.data, function(d) { return d[axisXkey]; }),
                            scaleDetails
                        ;

                        $scope.scaleDetails = scaleDetails = commonService.getDiv_n_Scale(highestYKey);

                    barChartHorizontal({
                            targetID:"chart1",
                            data:dataObj.data,
                            commonService:commonService,
                            /*dimensions:{"width":"100%","height":"70%"},*/
                            dimensions:commonService.getBarChartHorizontalDimensions(),
                            axis: {
                                'x': true,
                                'y': true,
                                'xLabel': 'Impressions',
                                'yLabel': 'Segments',
                                axisYkey: 'audience_segment',
                                axisXkey: axisXkey,
                                scaleDetails: $scope.scaleDetails
                            },
                            margin:{top:40,right:10,bottom:30,left:10},
                            subChartDataField:'audience_segment_data' 
                        });

                        var scaleTxt = (!!scaleDetails.numberScale) ? ' ( in '+scaleDetails.numberScale+' )' : '';
                        $scope.enableColumnFiltering = false; 
                        $scope.columnDefs = [
                            { field: 'audience_segment', displayName: 'Segment' },
                            { field: 'impressions', displayName: 'Impressions'+ scaleTxt}
                        ];
                        $scope.tabularData = dataObj.data;
                        $scope.$apply();

                        addInteractivity({"id":"charts",'currentChart':$scope.currentChart});

                    }
                });

            break;

            case 'devices':
                chartsId.addClass('interest');

                var url = reportsUrl+'7/'+dateString;
                //url="static/dummyData/barChartData.json";
                load_n_ProcessData({
                    jsonPath : url,
                    sortKey: "impressions",
                    viewScope:$scope,
                    commonService:commonService,
                    limit:10,
                    dateRange:dateString,
                    callback:function(dataObj){
                        var
                            axisXkey = "impressions",
                            highestYKey = d3.max(dataObj.data, function(d) { return d[axisXkey]; }),
                            scaleDetails
                            ;

                        $scope.scaleDetails = scaleDetails = commonService.getDiv_n_Scale(highestYKey);

                        barChartHorizontal({
                            targetID:"chart1",
                            data:dataObj.data,
                            commonService:commonService,
                            dimensions:commonService.getBarChartHorizontalDimensions(),
                            axis: {
                                'x': true,
                                'y': true,
                                'xLabel': 'Impressions',
                                'yLabel': 'Segments',
                                axisYkey: 'device_type',
                                axisXkey: 'impressions',
                                scaleDetails: $scope.scaleDetails
                            },
                            margin:{top:40,right:10,bottom:30,left:10}
                        });

                        var scaleTxt = (!!scaleDetails.numberScale) ? '( in '+scaleDetails.numberScale+')' : '';
                        $scope.enableColumnFiltering = false;
                        $scope.columnDefs = [
                             { field: 'device_type', displayName: 'Device' },
                             { field: 'impressions', displayName: 'Impressions' }
                         ];
                         $scope.tabularData = dataObj.data;
                         $scope.$apply();

                        addInteractivity({"id":"charts",'currentChart':$scope.currentChart});


                    }
                });



            break;

            case 'os':
                chartsId.addClass('os');

                var url = reportsUrl+'8/'+dateString;
                //url="static/dummyData/barChartData.json";
                load_n_ProcessData({
                    jsonPath : url,
                    sortKey: "impressions",
                    sortOrder:'reverse',
                    viewScope:$scope,
                    limit:10,
                    commonService:commonService,
                    dateRange:dateString,
                    callback:function(dataObj){

                        barChart({
                            targetID:"chart1",
                            data:dataObj.data,
                            commonService:commonService,
                            dimensions:commonService.getBarChartDimensions(),
                            axis:{'x':true,'y':true,'xLabel':'Segments','yLabel':'Impressions',axisXkey:'os', axisYkey:'impressions'},
                            margin:{top:40,right:10,bottom:30,left:100}
                        });

                        $scope.columnDefs = [
                            { field: 'os', displayName: 'Operating System' },
                            { field: 'impressions', displayName: 'Impressions' }
                        ];
                        $scope.tabularData = dataObj.data;
                        $scope.$apply();

                        addInteractivity({"id":"charts",'currentChart':$scope.currentChart});

 
                    }
                });

                break;

            case 'os_n_devices':
                chartsId.addClass('os_n_devices');

                var url = reportsUrl+'8/'+dateString;
                //url="static/dummyData/barChartData.json";
                load_n_ProcessData({
                    jsonPath : url,
                    sortKey: "impressions",
                    sortOrder:'reverse',
                    viewScope:$scope,
                    limit:10,
                    commonService:commonService,
                    dateRange:dateString,
                    callback:function(dataObj){
                        var
                            targetId = "chart1",
                            axisYkey = "impressions",
                            highestYKey = d3.max(dataObj.data, function(d) { return d[axisYkey]; }),
                            scaleDetails2
                        ;

                        $scope.scaleDetails2 = scaleDetails2 = commonService.getDiv_n_Scale(highestYKey);
                        d3.select("#"+targetId).insert("h3",":first-child").text('Operating Systems');

                        /*barChart({
                            targetID:targetId,
                            data:dataObj.data,
                            commonService:commonService,
                            dimensions:commonService.getBarChartDimensions(),
                            axis: {
                                'x': true,
                                'y': true,
                                'xLabel': 'Segments',
                                'yLabel': 'Impressions',
                                axisXkey: 'os',
                                axisYkey: 'impressions',
                                xTiltDeg: -90,
                                scaleDetails : $scope.scaleDetails2
                            },
                            margin:{top:40,right:10,bottom:70,left:70}
                        });*/

                        barChartHorizontal({
                            targetID:targetId,
                            data:dataObj.data,
                            commonService:commonService,
                            dimensions:commonService.getBarChartHorizontalDimensions(),
                            axis: {
                                'x': true,
                                'y': true,
                                'xLabel': 'Impressions',
                                'yLabel': 'Segments',
                                axisYkey: 'os',
                                axisXkey: 'impressions',
                                scaleDetails: $scope.scaleDetails2
                            },
                            margin:{top:40,right:30,bottom:80,left:10}
                        });

                        var
                            scaleTxt = (!!scaleDetails2.numberScale) ? ' ( in '+scaleDetails2.numberScale+' )' : ''
                        ;

                        var demographicTableTabs = d3.select("#OS_DevicesTableTabs");
                        demographicTableTabs.select('.os').classed('active',true);
                        $scope.enableColumnFiltering = false;
                        $scope.columnDefs = [
                            { field: 'os', displayName: 'Operating System' },
                            { field: 'impressions', displayName: 'Impressions'+scaleTxt }
                        ];
                        $scope.tabularData = dataObj.data;
                        $scope.OSData = dataObj.data;
                        $scope.$apply();

                        addInteractivity({"id":"charts",'currentChart':$scope.currentChart});

                    }
                });

                var url = reportsUrl+'7/'+dateString;
                //url="static/dummyData/barChartData.json";
                load_n_ProcessData({
                    jsonPath : url,
                    sortKey: "impressions",
                    sortOrder:'reverse',
                    viewScope:$scope,
                    commonService:commonService,
                    limit:10,
                    dateRange:dateString,
                    callback:function(dataObj){
                        var
                            targetId = "chart2",
                            axisXkey = "impressions",
                            highestXKey = d3.max(dataObj.data, function(d) { return d[axisXkey]; }),
                            scaleDetails
                        ;

                        $scope.scaleDetails = scaleDetails = commonService.getDiv_n_Scale(highestXKey);
                        d3.select("#"+targetId).insert("h3",":first-child").text('Devices');

                        barChartHorizontal({
                            targetID:targetId,
                            data:dataObj.data,
                            commonService:commonService,
                            dimensions:commonService.getBarChartHorizontalDimensions(),
                            axis: {
                                'x': true,
                                'y': true,
                                'xLabel': 'Impressions',
                                'yLabel': 'Segments',
                                axisYkey: 'device_type',
                                axisXkey: 'impressions',
                                scaleDetails: $scope.scaleDetails
                            },
                            margin:{top:40,right:30,bottom:80,left:10}
                        });
                        $scope.devicesData = dataObj.data;
/*
                        var scaleTxt = (!!scaleDetails.numberScale) ? ' ( in '+scaleDetails.numberScale+' )' : '';
                        $scope.enableColumnFiltering = false;
                        $scope.columnDefs = [
                            { field: 'device_type', displayName: 'Device' },
                            { field: 'impressions', displayName: 'Impressions'+scaleTxt }
                        ];
                        $scope.$apply();
*/
                        addInteractivity({"id":"charts",'currentChart':$scope.currentChart});


                    }
                });

                break;
            case 'demographics':
                chartsId.addClass('demographics');

                //Age Range

                var url = reportsUrl+'19/'+dateString;
                load_n_ProcessData({
                    jsonPath : url,
                    sortKey: "impressions",
                    sortOrder:'reverse',
                    viewScope:$scope,
                    limit:10,
                    commonService:commonService,
                    dateRange:dateString,
                    callback:function(dataObj){

                        var
                            targetId = "chart1",
                            axisYkey = "impressions",
                            highestYKey = d3.max(dataObj.data, function(d) { return d[axisYkey]; }),
                            scaleDetails
                        ;

                        $scope.scaleDetails = scaleDetails = commonService.getDiv_n_Scale(highestYKey);

                        $scope.tabularData = dataObj.data;
                        $scope.$apply();

                        /*barChart({
                            targetID:targetId,
                            data:dataObj.data,
                            commonService:commonService,
                            dimensions:commonService.getBarChartDimensions(),
                            axis: {
                                'x': true,
                                'y': true,
                                'xLabel': 'Age Range',
                                'yLabel': 'Impressions',
                                axisXkey: 'age',
                                axisYkey: 'impressions',
                                xTiltDeg: -90,
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
                                'yLabel': 'Impressions',
                                axisXkey: 'age',
                                axisYkey: 'impressions',
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
                        $scope.columnDefs = [
                            { field: 'age', displayName: 'Age Range'},
                            { field: 'impressions', displayName: 'Impressions'+scaleTxt}
                        ];
                        $scope.ageRangeData = dataObj.data;
                        $scope.tabularData = $scope.ageRangeData;
                        $scope.$apply();

                    }
                });

                //Gender
                var url = reportsUrl+'20/'+dateString;
                load_n_ProcessData({
                    jsonPath : url,
                    sortKey: "impressions",
                    sortOrder:'reverse',
                    viewScope:$scope,
                    limit:10,
                    commonService:commonService,
                    dateRange:dateString,
                    callback:function(dataObj){

                        var
                            targetId = "chart2",
                            axisYkey = "impressions",
                            highestYKey = d3.max(dataObj.data, function(d) { return d[axisYkey]; }),
                            scaleDetails2
                        ;

                        $scope.scaleDetails2 = scaleDetails2 = commonService.getDiv_n_Scale(highestYKey);

                       /* barChart({
                            targetID:targetId,
                            data:dataObj.data,
                            commonService:commonService,
                            dimensions:commonService.getBarChartDimensions(),
                            axis: {
                                'x': true,
                                'y': true,
                                'xLabel': 'Gender',
                                'yLabel': 'Impressions',
                                axisXkey: 'gender',
                                axisYkey: 'impressions',
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
                                'yLabel': 'Impressions',
                                axisXkey: 'gender',
                                axisYkey: 'impressions',
                                scaleDetails: $scope.scaleDetails2
                            },
                            margin:{top:0,right:0,bottom:0,left:0},
                            viewScope:$scope,
                            commonService:commonService
                        });


                        $scope.enableColumnFiltering = false;
                        $scope.genderData = dataObj.data;
                        addInteractivity({"id":"charts",'currentChart':$scope.currentChart});
                    }
                });
            break;
            case 'geographic':
                chartsId.addClass('geographic');

                var url = reportsUrl+'6/'+dateString;
                //var topoJsonFile = "static/dummyData/world-110m2.json";
                var topoJsonFile = "static/js/D3Charts/world-50m.json";

                load_n_ProcessData({
                    jsonPath : topoJsonFile,
                    viewScope:$scope,
                    skipProcessing: true,
                    commonService:commonService,
                    callback:function(topoJsonData) {

                        load_n_ProcessData({
                            jsonPath: url,
                            viewScope: $scope,
                            skipProcessing: true,
                            commonService: commonService,
                            callback: function (dataObj) {
                                var
                                    validData=[],
                                    axisXkey = 'city'
                                ;

                                dataObj.data.forEach(function(d){
                                    d.impressions = +d.impressions;
                                    if(!!d[axisXkey]) {
                                        var cityDetails = d[axisXkey].split(",");
                                        d[axisXkey] = cityDetails[0];
                                        d.lat = cityDetails[2];
                                        d.long = cityDetails[1];

                                        if (!d.lat || !d.long) {
                                            //delete d;
                                            //debugger;
                                            skipped++;
                                        } else {
                                            validData.push(d);
                                        }
                                    }
                                });
                                dataObj.data = validData;

                                var
                                    targetId = "chart1",
                                    axisYkey = "impressions",
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
                                        'yLabel': 'Impressions',
                                        axisXkey: axisXkey,
                                        axisYkey: axisYkey,
                                        scaleDetails: $scope.scaleDetails
                                    }
                                    
                                });

                                var scaleTxt = (!!scaleDetails.numberScale) ? ' ( in '+scaleDetails.numberScale+' )' : '';
                                $scope.enableColumnFiltering = true;
                                $scope.columnDefs = [
                                    { field: 'city', displayName: 'City', enableFiltering:true },
                                    { field: 'impressions', displayName: 'Impressions'+scaleTxt }
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
                    axisYkey = "impressions",
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
                    dimensions:{"width":"100%","height":"100%"},
                    'x':false,'y':false,
                    axis: {
                        'x': true,
                        'y': true,
                        'xLabel': 'Audiences',
                        'yLabel': 'Impressions',
                        axisXkey: 'audience_segment',
                        axisYkey: 'impressions',
                        scaleDetails: $scope.scaleDetails
                    },
                    margin:{top:0,right:0,bottom:0,left:0},
                    viewScope:$scope,
                    commonService:commonService
                });

                $scope.currentChart="interest";

                addInteractivity({"id":"charts", currentChart : $scope.currentChart});

            break;

        };
    };

    $scope.$on('campaignIdsAvailable',function () {
        if(!!$scope.loggedIn) {
            $scope.loadChart($scope.currentChart);
        }
    })

    angular.element(commonService.getId("#dashboardLinks")).addClass('active');

}]);