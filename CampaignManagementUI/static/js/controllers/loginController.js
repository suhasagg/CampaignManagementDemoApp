'use strict';
angular.module('CubeRootApp')
    .controller('loginCtrl', ['$rootScope','$validation','$scope', '$uibModal', '$log', '$http', '$state', 'commonService',
        function ($rootScope, $validation, $scope, $uibModal, $log, $http, $state, commonService) {
    $rootScope.commonService = commonService;
    $scope.sendData = commonService.sendData;
    $rootScope.userType = commonService.getUserType();
    console.log($rootScope.userSeekState);
    //var urlPrefix = $rootScope.urlPrefix = 'http://52.91.85.20:8080/';
    var urlPrefix = $rootScope.urlPrefix =  commonService.getUrlPrefix();

    if( !!commonService.checkAuthentication() ){
        console.log('loginController reached');
        if(!$rootScope.userSeekState) {
            commonService.goToLandingPage();
            commonService
                .getUserDetails()
                .then(function(response){
                    $rootScope.userDetails = response.data;
                },commonService.commonErrorCallback);
            $rootScope.userDetails = 'loading';

        } else {
            $state.go($rootScope.userSeekState);
        }
    }
            
    var $validationProvider = $validation;
        $scope.showAppMsg = commonService.showAppMsg;
    $scope.form = {
        checkValid: $validationProvider.checkValid,

        reset: function(form) {
            $validationProvider.reset(form);
        },

        submit: function (form) {
            try {
                $validationProvider.validate(form)
                    .success(function () {

                        var data = JSON.stringify($scope.user);
                        commonService.showLoading();
                        $scope.sendData(
                            urlPrefix+'/usermod/login', //url
                            data, // data
                            function (response) {
                                //success call back
                                var
                                    data = response.data
                                ;

                                if(data.type==='success') {
                                    $rootScope.userType = commonService.getUserType();
                                    commonService.goToLandingPage();
                                } else {
                                    var
                                        status = { success:false, message: data.description, type:data.type }
                                    ;

                                    $scope.flash = status;
                                    /*var appViewMsg = {
                                        type:data.type ,
                                        message: data.description
                                    };
                                    $scope.showAppMsg({size:500,msg:appViewMsg});*/
                                }
                                commonService.hideLoading(2);
                            },
                            function (response) {
                                response = { success: false, message: 'Some error occurred please try after some time.', type:"error" };
                                $scope.flash = response;
                                commonService.hideLoading();
                            });
                    })
                    .error(function (err) {
                        //form error call back
                        //console.log(err);
                    });

            }catch(e){}
            //console.log(validationResult);
        }
    };

    /*	$scope.validateLoginForm = function(){

     if(email == '' || !validateEmail(user.email)){
     emailError = true;
     }

     }*/

    /*	$scope.validateEmail =  function(email) {
     var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
     return re.test(email);
     }*/

    $scope.items = ['item1', 'item2', 'item3'];
    $scope.forgotPassword = function (size) {

        $rootScope.modalInstance = $uibModal.open({
            templateUrl: 'forgotPassword',
            controller: 'forgotPasswordCtrl',
            size: size,
            windowClass: 'center-modal',
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });
    };
}])
.controller('forgotPasswordCtrl', ['$scope','$rootScope' , '$uibModalStack', 'items', '$validation', 'commonService',
    function ($scope, $rootScope, $uibModalStack, items, $validation, commonService) {

    var $validationProvider = $validation;
    $scope.sendData = commonService.sendData;
    var urlPrefix = $rootScope.urlPrefix =  commonService.getUrlPrefix();
    $scope.form= {
        checkValid: $validationProvider.checkValid,

        submit: function (form) {
            $validationProvider.validate(form)
                .success(function(){
                    commonService.showLoading();
                    $scope.sendData(
                        urlPrefix+'/usermod/forgotpassword', //url
                        $scope.user, // data
                        function(response){
                            var data = response.data;
                            if(data.type === 'error'){
                                var
                                    status = { success:false, message: data.description, type:data.type }
                                ;
                                $scope.forgotFlash = status;
                            } else if(data.type === 'success'){
                                var
                                    status = { success:true, message: "An email has sent to your email id, please check your mailbox.", type:data.type }
                                ;
                                $scope.forgotFlash = status;
                                document.getElementById('forgotForm').style.display='none'
                                //angular.element(commonService.getId('#forgotForm')).hide();
                            }
                            commonService.hideLoading(2);

                        }, function(error){
                            var
                                status = { success:false, message: "Some error occurred, please try after some time.", type:"error" }
                            ;
                            $scope.forgotFlash = status;
                            commonService.hideLoading(2);
                        });

                });
        }
    };
}]);