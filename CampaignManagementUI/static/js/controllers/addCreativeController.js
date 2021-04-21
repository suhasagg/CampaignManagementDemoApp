"use strict";
cubeRootApp = angular.module('CubeRootApp');

cubeRootApp.config(function ($httpProvider) {
  $httpProvider.defaults.headers.post['Accept']       = 'application/json, text/javascript';
  $httpProvider.defaults.headers.post['Content-Type'] = 'multipart/form-data; charset=utf-8';
});

cubeRootApp.controller('addCreativeCtrl', ['$scope', '$http', '$validation', '$state', 'commonService', function ($scope, $http, $validation, $state, commonService) {
  var
    urlPrefix           = commonService.getUrlPrefix(),
    $validationProvider = $validation
    ;

  commonService.showLoading();
  commonService.getFormData()
    .then(function (response) {
    console.log(response.data);
    $scope.creativeChannels = response.data.channel;
    $scope.form.channel='';
    commonService.hideLoading(3);
  });


  $scope.form               = {
    reset  : function (form) {
      $validationProvider.reset(form);
    },

    submit: function (form) {
      $validationProvider.validate(form)
        .success(function () {
          var creativeForm = angular.element(document.getElementsByName('creativeForm'));
          commonService.showLoading();

          $scope.form.channel = commonService.getMatchedKey($scope.creativeChannels,'id', $scope.form.channelid).channelName;

          $http({
            method : 'POST',
            data   : $scope.form,
            headers: {
              'Content-Type': 'application/json'
            },
            url    : urlPrefix + '/creative/addcreative'
          }).then(function successCallback(response) {
            if (response.data.type === "success") {
              $state.go('appView.creatives.manage');
            } else if (response.data.type === "error") {
              commonService.commonErrorCallback(response.data);
            }
          });
        }, commonService.commonErrorCallback);
    }
    /*,
     'title':'Here some title',
     "channel":'facebook',
     "facebookCreative":'video',
     newsFeedCreativeUrl:'static/images/logo_206x55.png',
     NewsFeedTitle:'newsFeedTitle',
     fbVideoType:'slideshow'
     */
  };
  $scope.setFbSlideShowUrls = function (obj) {
    $scope.form.fbSlideShowUrls = '';
    var imagesCount             = 3;
    for (var i = 1; i <= 3; i++) {
      if (!!obj['fbSlideShowUrl' + i])
        $scope.form.fbSlideShowUrls += obj['fbSlideShowUrl' + i] + ',';
    }
  };
  $scope.setInvalid         = function (id) {
    angular.element(document.getElementById(id)).addClass('ng-invalid');
  };

  $scope.setValid = function (id) {
    angular.element(document.getElementById(id)).removeClass('ng-invalid');
  };

  /*  commonService.hideLoading();*/

}]);