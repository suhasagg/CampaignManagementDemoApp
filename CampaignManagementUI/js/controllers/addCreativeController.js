"use strict";
cubeRootApp = angular.module('CubeRootApp');
cubeRootApp.controller('addCreativeCtrl', ['$scope','$http','$validation','$state', 'commonService', function ($scope,$http, $validation, $state, commonService) {
    var
        urlPrefix = commonService.getUrlPrefix(),
        $validationProvider = $validation
    ;

    $scope.form = {
        /*channel:'DBM',*/
        reset: function(form) {
            $validationProvider.reset(form);
        },

        submit: function (form) {
            $validationProvider.validate(form)
            .success(function() {
                var creativeForm = angular.element('form[name=creativeForm]');
                commonService.showLoading();
                $http({
                    method: 'POST',
                    data: $scope.form,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    url: urlPrefix+'/creative/addcreative'
                }).then(function successCallback(response) {
                    if(response.data.type==="success"){
                        $state.go('appView.creatives.manage');
                    }
                });
            },commonService.commonErrorCallback);
        }/*,

        'title':'Here some title',
        "channel":'facebook',
        "facebookCreative":'video',
        newsFeedCreativeUrl:'static/images/logo_206x55.png',
        NewsFeedTitle:'newsFeedTitle',
        fbVideoType:'slideshow'*/
    };

    commonService.hideLoading();
}]);