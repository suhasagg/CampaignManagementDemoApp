"use strict";
angular.module('CubeRootApp')
  .controller('viewCreativeCtrl', ['$scope', '$rootScope', '$uibModalStack',
    function ($scope, $rootScope, $uibMsodalStack) {
      $scope.ok = function () {
        $rootScope.modalInstance.dismiss('ok');
      };
      
      var
        imageType  = "jpg,jpeg,png,gif,Image,image",
        videoTypes = "mpg,mpeg,ogg,webm,mp4,swf";
debugger;

      var type = (imageType.indexOf($scope.type) != -1) ? 'image' : '';
      type     = (videoTypes.indexOf($scope.type) != -1) ? 'video' : '';
      
      
    }]);