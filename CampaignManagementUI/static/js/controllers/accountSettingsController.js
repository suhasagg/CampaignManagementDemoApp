var cubeRootApp =  angular.module('CubeRootApp');
cubeRootApp.controller("accountSettingsCtrl",['$scope','$rootScope', '$http','$validation','$uibModal','commonService',
    function($scope, $rootScope, $http, $validation,$uibModal,commonService ){

    var $validationProvider = $validation,
        urlPrefix = commonService.getUrlPrefix();
//    $scope.userDetails = $rootScope.userDetails;
    if(!$rootScope.userDetails){
        commonService.showLoading();
    }

    $scope.$watch('userDetails',function () {
        if(!!$scope.userDetails) {
            commonService.hideLoading();
        }
    });

    $scope.form = {
        checkValid: $validationProvider.checkValid,

        reset: function(form) {
            $validationProvider.reset(form);
        },

        submit: function (form) {
            $validationProvider.validate(form)
                .success(function() {
                    var userDetails = {
                        address:$scope.userDetails.address,
                        city:$scope.userDetails.city,
                        companyname:$scope.userDetails.companyname,
                        monthly_visitor:$scope.userDetails.monthly_visitor,
                        phone:$scope.userDetails.phone,
                        state:$scope.userDetails.state,
                        websiteurl:$scope.userDetails.websiteurl,
                        zipcode:$scope.userDetails.zipcode
                    };
                    commonService.showLoading();
                    $http({
                        method: 'POST',
                        data: userDetails,
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        url: urlPrefix+'/usermod/updateuserdetails'
                    }).then(function successCallback(response) {
                        if(response.data.type==='success'){
/*                            var
                                status = { success:true, message: "Your details have been successfully saved. <br/> Please check your email.", type:response.data.type }
                                ;
                            $scope.errorFlash = status;*/
                            var appViewMsg = {
                                type: "success",
                                message: "Your details have been successfully saved."
                            };
                            $rootScope.$emit('appViewMessage', appViewMsg);
                            commonService.hideLoading();
                        } else if(response.data.type==='error'){
                            var
                                status = { success:false, message: response.data.description, type:response.data.type }
                                ;
                            $scope.errorFlash = status;
                            commonService.hideLoading();
                        }
                    }, function errorCallback(response) {
                        var
                            status = { success:false, message: "Some Server error occurred, Please try after sometime.", type:"error" }
                            ;
                        $scope.errorFlash = status;
                        commonService.hideLoading();
                    });


                });
        }
    };


}]);
