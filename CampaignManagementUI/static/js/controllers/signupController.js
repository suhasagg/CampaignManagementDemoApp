"use strict";

var cubeRootApp =  angular.module('CubeRootApp');
cubeRootApp.controller("signupController",['$scope','$rootScope', '$http','$validation','$uibModal','commonService',
	function($scope, $rootScope, $http, $validation,$uibModal,commonService ){

	var 
		urlPrefix = commonService.getUrlPrefix(),
		$validationProvider = $validation
	;
	$scope.registrationForm = {};

/*
	$scope.matchPassword = function(){
		if($scope.registrationForm.password != $scope.registrationForm.retypePassword){
			$scope.registrationForm.password.$error=true;
			$scope.registrationForm.retypePassword.$error=true;
		}
	}
*/
	$scope.showAppMsg = commonService.showAppMsg;

	$scope.form = {
		checkValid: $validationProvider.checkValid,

		reset: function(form) {
			$validationProvider.reset(form);
		},

		submit: function (form) {
			$validationProvider.validate(form)
				.success(function() {

					commonService.showLoading();
					$http({
						method: 'POST',
						data: $scope.registrationForm,
						headers: {
							'Content-Type': 'application/json'
						},
						url: urlPrefix+'/usermod/adduser'
					}).then(function successCallback(response) {
						if(response.data.type==='success'){
							document.getElementById('signupForm').style.display='none';
/*							var appViewMsg = {
								type: "success",
								message: "Your details have been successfully saved. /n Please check your email.",
								ok:false
							};
							$scope.showAppMsg({size:500,msg:appViewMsg})*/;
							var
								status = { success:true, message: "Your details have been successfully saved. Please check your email.", type:response.data.type }
							;
							$scope.flash = status;
							commonService.hideLoading(2);
						} else if(response.data.type==='error'){
/*							var appViewMsg = {
								type: response.data.type,
								message: response.data.description
							};
							$scope.showAppMsg({size:500,msg:appViewMsg});*/
							var
								status = { success:false, message: response.data.description, type:response.data.type }
							;
							$scope.errorFlash = status;
							commonService.hideLoading(2);
						}
					}, function errorCallback(response) {
/*						var appViewMsg = {
							type: "error",
							message: "Some Server error occurred, Please try after sometime."
						};
						$scope.showAppMsg({size:500,msg:appViewMsg/!*,template:'applicationMessage'*!/});*/

						var
							status = { success:false, message: "Some Server error occurred, Please try after sometime.", type:"error" }
						;
						$scope.errorFlash = status;
						commonService.hideLoading(2);
					});
				})
				.error(function(){});
		}
	};

}]);
