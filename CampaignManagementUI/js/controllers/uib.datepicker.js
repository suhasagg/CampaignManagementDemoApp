"use strict";

var cubeRootApp =  angular.module('CubeRootApp');
cubeRootApp.controller('datePickerCtrl', ["$scope","commonService",function ($scope,commonService) {
    $scope.today = function() {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.setStartDate = function() {
        var startDate = (!!$scope.$parent.startDate) ? $scope.$parent.startDate : new Date("2016-04-08");
        //startDate.setMonth(startDate.getMonth()-2);
        //setting temp date to show / match data
        $scope.startDate = startDate;

    };
    $scope.setStartDate();

    $scope.setEndDate = function() {
        var endDate = (!!$scope.$parent.endDate) ? $scope.$parent.endDate : new Date("2016-04-19");
        //endDate.setDate(endDate.getDate()-1);
        $scope.endDate = endDate;
    };
    $scope.setEndDate();


    $scope.clear = function() {
        $scope.dt = null;
    };

    $scope.inlineOptions = {
        customClass: getDayClass,
        minDate: new Date(),
        showWeeks: true
    };

    $scope.dateOptions = {
       /* dateDisabled: disabled,*/
        formatYear: 'yy',
        maxDate: new Date(),
        minDate: new Date(2015, 1, 1),
        startingDay: 1
    };

    // Disable weekend selection
    function disabled(data) {
        var date = data.date,
            mode = data.mode;
        return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
    }

    $scope.toggleMin = function() {
        $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
        $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
    };

    $scope.toggleMin();

    $scope.open1 = function() {
        $scope.popup1.opened = true;
    };

    $scope.open2 = function() {
        $scope.popup2.opened = true;
    };

    $scope.setDate = function(year, month, day) {
        $scope.dt = new Date(year, month, day);
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.altInputFormats = ['M!/d!/yyyy'];

    $scope.popup1 = {
        opened: false
    };

    $scope.popup2 = {
        opened: false
    };

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var afterTomorrow = new Date();
    afterTomorrow.setDate(tomorrow.getDate() + 1);

    $scope.events = [
        {
            date: tomorrow,
            status: 'full'
        },
        {
            date: afterTomorrow,
            status: 'partially'
        }
    ];

    function getDayClass(data) {
        var date = data.date,
            mode = data.mode;
        if (mode === 'day') {
            var dayToCheck = new Date(date).setHours(0,0,0,0);

            for (var i = 0; i < $scope.events.length; i++) {
                var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

                if (dayToCheck === currentDay) {
                    return $scope.events[i].status;
                }
            }
        }

        return '';
    }

    var
        startDate = $scope.startDate,
        endDate = $scope.endDate,
        dateString = startDate.getFullYear()+"-"+(startDate.getMonth()+1)+"-"+startDate.getDate()+","+
        endDate.getFullYear()+"-"+(endDate.getMonth()+1)+"-"+endDate.getDate()
    ;

    $scope.updateCommonService = function(){
        var dates = {
            startDate:$scope.startDate,
            endDate:$scope.endDate
        };
        commonService.setDates(dates);
    };

    $scope.$parent.endDate = $scope.endDate;
    $scope.$parent.startDate = $scope.startDate;

    $scope.init=function(){
        //console.log('Dates init.');
        //console.log($scope.startDate);
        $scope.updateCommonService();
        $scope.$emit('datesLoaded');

        setTimeout(function(){
            $scope.$watch('startDate',function() {

                if($scope.$parent.startDate !== $scope.startDate) {
                    //console.log('start date Changed');
                    $scope.$parent.startDate = $scope.startDate;
                    $scope.updateCommonService();
                    $scope.$emit('startDateChanged');
                }

            },true);

            $scope.$watch('endDate',function() {
                if( $scope.$parent.endDate !== $scope.endDate) {
                    //console.log('end date Changed');
                    $scope.$parent.endDate = $scope.endDate;
                    $scope.updateCommonService();
                    $scope.$emit('endDateChanged');
                }
            },true);
        },5000)
    };

    $scope.$on('changeDateRange',function (event,args) {
        $scope.startDate = new Date(args.startDate);
        $scope.endDate = new Date(endDate);
    });

}]);