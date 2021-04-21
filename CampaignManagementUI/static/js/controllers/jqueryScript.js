"use strict";
var cubeRootApp =  angular.module('CubeRootApp');
cubeRootApp.controller("jqueryScriptCtrl",['$scope', 'commonService',function($scope, commonService) {

    var body = angular.element(document.getElementsByTagName('body'));
    console.log(body.hasClass('sidebar-mobile-main'));

    $scope.toggleBarMenu = function () {
        var body = angular.element(document.getElementsByTagName('body'));
        (!!body.hasClass('sidebar-mobile-main')) ? body.removeClass('sidebar-mobile-main') : body.addClass('sidebar-mobile-main');
    };
}]);

