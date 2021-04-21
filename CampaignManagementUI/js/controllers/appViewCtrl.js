"use strict";
angular.module('CubeRootApp')
    .controller("appViewCtrl",["$scope","$state","$rootScope",'$uibModal', '$log', '$http',"commonService",function($scope, $state,$rootScope, $uibModal, $log, $http, commonService){

        $rootScope.commonService = commonService;
        $rootScope.logout = commonService.logout;
        $rootScope.loggedIn = commonService.checkAuthentication();
        $rootScope.userType = commonService.getUserType();
        $rootScope.urlPrefix = commonService.getUrlPrefix();
        $rootScope.userSeekState = $state.current.name;

        //console.log($rootScope.userSeekState);

        $scope.$state = $state;
        $scope.dateFormat = 'date:\'dd MMM yyyy\'';
        $scope.commonService = commonService;
        //$rootScope.urlPrefix = 'http://52.91.85.20:8080/';
        commonService.checkLogin();
        //console.log('appView reached');

        $rootScope.$on('datesLoaded',function (event) {
            event.stopPropagation();
            $scope.loadCampaignIds();
        });
        $rootScope.$on('startDateChanged',function (event) {
            event.stopPropagation();
            $scope.updateCampaignIds();
        });
        $rootScope.$on('endDateChanged',function (event) {
            event.stopPropagation();
            $scope.updateCampaignIds();
        });

        $scope.updateCampaignIds = function(){
            $scope.campaign_id = "";
            var campaignId = angular.element("#campaignId");
            campaignId.attr('disabled',true);
            campaignId.addClass('fieldLoading');

            commonService.requestCampaignIds()
                .then(function successCallback(response) {
                    $scope.campaignIds = response.data;
                    $scope.campaign_id = "";
                    //$scope.$broadcast('campaignIdsAvailable');
                    campaignId.removeClass('fieldLoading');
                    campaignId.removeAttr('disabled');
                }, function errorCallback(response) {
                    //console.log(response);
                    //alert('Error fetching campaign IDs /n make sure your session is valid.');
                });

        };

        $scope.loadCampaignIds = function(){
            commonService.showLoading();
            commonService.requestCampaignIds()
                .then(function successCallback(response) {
                    $scope.campaignIds = response.data;
                    $scope.$broadcast('campaignIdsAvailable');
                }, function errorCallback(response) {
                    //console.log(response);
                    //alert('Error fetching campaign IDs /n make sure your session is valid.');
                });

        };

        $rootScope.$on('appViewMessage',function (event,data) {
            // $rootScope.appViewMsg = data;
            event.stopPropagation();
            $scope.showAppMsg({size:500,msg:data,template:'applicationMessage'});
        });
        $rootScope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams){
                angular.element('body').removeClass('sidebar-mobile-main');
        });


        angular.element(window).resize(function(){

            $scope.$apply(function(){
                angular.element('body').removeClass('sidebar-mobile-main');
                //do something to update current scope based on the new innerWidth and let angular update the view.
            });
        });

        $scope.showAppMsg = commonService.showAppMsg;

        $scope.showTabularData = function(){
            
        }

}]);