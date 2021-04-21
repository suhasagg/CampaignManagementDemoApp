"use strict";
cubeRootApp = angular.module('CubeRootApp');
cubeRootApp.controller('editCreativeCtrl', ['$scope','$http','$validation','$state', '$stateParams','commonService', function ($scope,$http, $validation, $state, $stateParams, commonService) {
    var
        urlPrefix = commonService.getUrlPrefix(),
        $validationProvider = $validation
    ;

    if($stateParams.data === null) {
        $state.go('appView.creatives.manage');
        return;
    }


    $scope.editMode = true;
    $scope.form = $stateParams.data;
    /*$scope.form = {
        'title':'Here some title',
        "channel":'Facebook',
        "facebookCreative":'video',
        newsFeedCreativeUrl:'static/images/logo_206x55.png',
        NewsFeedTitle:'newsFeedTitle',
        fbVideoType:'slideshow'
    };*/
    debugger;
    console.log($scope.form);
    $scope.form.submit = function (form) {
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
                    url: urlPrefix+'/creative/updatecreativedetails'
                }).then(function successCallback(response) {
                    if(response.data.type==="success"){
                        $state.go('appView.creatives.manage');
                    }
                });
            },commonService.commonErrorCallback)
        ;

        };
    commonService.hideLoading();
}]);