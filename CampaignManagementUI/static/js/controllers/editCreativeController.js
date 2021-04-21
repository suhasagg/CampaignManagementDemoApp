"use strict";
cubeRootApp = angular.module('CubeRootApp');
cubeRootApp.controller('editCreativeCtrl', ['$scope', '$http', '$validation', '$state', '$stateParams', 'commonService', function ($scope, $http, $validation, $state, $stateParams, commonService) {

  if ($stateParams.data === null) {
    $state.go('appView.creatives.manage');
    return;
  }
  var
    urlPrefix           = commonService.getUrlPrefix(),
    $validationProvider = $validation,
    url                 = urlPrefix + '/creative/getcreativeiddetails?id=' + $stateParams.data.id + '&channel=' + $stateParams.data.channel
    ;
  $scope.editMode       = true;
  //var url                   = '/creative/getcreativeiddetails?id=17&channel=Facebook';
  commonService.showLoading();
  commonService.getFormData()
    .then(function (response) {
      $scope.creativeChannels = response.data.channel;

      $http({
        url: url
      }).then(function (response) {
        $scope.form           = response.data;
        $scope.form.channelid = commonService.getMatchedKey($scope.creativeChannels, 'channelName', $scope.form.channel).id;

        $scope.form.submit = function (form) {
          $validationProvider.validate(form)
            .success(function () {
              var
                creativeForm  = angular.element(document.getElementsByName('creativeForm'))
                ;
              $scope.editForm = {
                id         : form.id,
                title      : form.title,
                Description: form.Description
              };

              commonService.showLoading();
              $http({
                method : 'POST',
                data   : $scope.form,
                headers: {
                  'Content-Type': 'application/json'
                },
                url    : urlPrefix + '/creative/updatecreativedetails'
              }).then(function successCallback(response) {
                if (response.data.type === "success") {
                  $state.go('appView.creatives.manage');
                } else if (response.data.type === "error") {
                  commonService.commonErrorCallback(response.data);
                }
              });
            }, commonService.commonErrorCallback)
          ;

        };
        commonService.hideLoading(2);
      });
    });
  console.log($stateParams.data);
}]);