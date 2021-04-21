'use strict';
angular.module('CubeRootApp.directives', [])

  .directive('compareTo', [function () {
    return {
      require: 'ngModel',
      link   : function ($scope, elem, attrs, ctrl) {
        var firstPassword = angular.element(document.getElementById(attrs.compareTo));
        firstPassword
          .on('keyup', function () {
            $scope.$apply(function () {
              var v = elem.val() === firstPassword.val();
              ctrl.$setValidity('matched', v);
            });
          });
      }
    }
  }])

.directive('embedSrc', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var current = element;
        scope.$watch(function() { return attrs.embedSrc; }, function () {
          debugger;
          var clone = element
            .clone()
            .attr('src', attrs.embedSrc);

          current.replaceWith(clone);
          current = clone;
        });
      }
    };
  })

  .directive("fileModel", ['fileUpload', 'commonService', '$parse', function (fileUpload, commonService, $parse) {
    return {
      restrict: 'EA',
      /*scope   : {
       setFileData: "&"
       },*/
      link    : function (scope, ele, attrs) {
        var model       = $parse(attrs.fileModel),
            modelSetter = model.assign,
            sizeSetter, typeSetter
          ;
        (!!attrs.sizeModel) ? sizeSetter = $parse(attrs.sizeModel).assign : '';
        (!!attrs.typeModel) ? typeSetter = $parse(attrs.typeModel).assign : '';

        ele.on('change', function () {
          scope.$apply(function () {

            if (!ele[0].files[0]) return;

            var
              allowedExt    = attrs.allowedExt,
              callback      = attrs.callback,
              val           = ele[0].files[0],
              size          = val.size,
              type          = '',
              filename      = val.name,
              fileExt       = filename.split('.')[1],
              filenameSplit = filename.split('.')
              ;

            type = filenameSplit[filenameSplit.length - 1];

            if (allowedExt.indexOf(fileExt) == -1) {
              //alert('This file format now allowed.');
              $rootScope.$emit('appViewMessage', {
                type   : "error",
                message: "This file format now allowed."
              });
              commonService.hideLoading();
              return;
            }
            //scope.setFileData({value: val});
            commonService.showLoading();
            commonService
              .getSTSToken()
              .then(function (response) {
                var
                  STSToken        = response.data
                  ;
                STSToken.fileName = STSToken.uuid.substring(0, 9) + '-' + filename;
                STSToken.fileUrl  = commonService.getAWSUrl() + STSToken.fileName;
                fileUpload
                  .uploadFileToUrl(val, ele, STSToken);
                modelSetter(scope, STSToken.fileUrl);
                (!!sizeSetter) ? sizeSetter(scope, size) : '';
                (!!typeSetter) ? typeSetter(scope, type) : '';
                if (!!callback) {
                  scope[callback](scope.slideshow);
                }
              });

          });

        });
      }
    }
  }])


/*.directive('fileModel', ['$parse',

 function ($parse) {
 return {
 restrict: 'A',
 link    : function (scope, element, attrs) {
 var model       = $parse(attrs.fileModel);
 var modelSetter = model.assign;
 element.bind('change', function () {
 scope.$apply(function () {

 var error = false;

 if (attrs.multiple) {
 var
 files           = element[0].files,
 maxFilesAllowed = attrs.maxFile,
 allowedExt      = attrs.allowedext,
 totalFiles      = files.length
 ;
 files.forEach(function (file) {
 var
 ext         = file.name.split('.')[1],
 allowedExts = allowedExt.split(',')
 ;

 console.log(allowedExts.indexOf(ext));

 });
 if (maxFilesAllowed < totalFiles) {
 error = true;
 }

 console.log(attrs.maxFile);
 console.log(element[0].files.length);
 modelSetter(scope, files);
 } else {

 var
 file        = element[0].files[0],
 allowedExt  = attrs.allowedExt,
 ext         = file.name.split('.')[1],
 allowedExts = allowedExt.split(',')
 ;

 console.log(allowedExts.indexOf(ext));
 modelSetter(scope, element[0].files[0]);
 }
 });
 });
 }
 };
 }])*/
;
/*
 /!*.directives.directive('file', function () {
 return {
 restrict: 'AE',
 scope   : {
 file: '@'
 },
 link    : function (scope, el, attrs) {
 el.bind('change', function (event) {
 var files          = event.target.files;
 var file           = files[0];
 scope.file         = file;
 scope.$parent.file = file;
 scope.$apply();
 });
 }
 };
 })*!/

 .directive('uiSwitch', ['$window', '$timeout', '$log', '$parse', function ($window, $timeout, $log, $parse) {

 /!**
 * Initializes the HTML element as a Switchery switch.
 *
 * $timeout is in place as a workaround to work within angular-ui tabs.
 *
 * @param scope
 * @param elem
 * @param attrs
 * @param ngModel
 *!/
 function linkSwitchery(scope, elem, attrs, ngModel) {
 if (!ngModel) return false;
 var options = {};
 try {
 options = $parse(attrs.uiSwitch)(scope);
 }
 catch (e) {
 }

 var switcher;

 attrs.$observe('disabled', function (value) {
 if (!switcher) {
 return;
 }

 if (value) {
 switcher.disable();
 }
 else {
 switcher.enable();
 }
 });

 // Watch changes
 scope.$watch(function () {
 return ngModel.$modelValue;
 }, function (newValue, oldValue) {
 initializeSwitch()
 });

 function initializeSwitch() {
 $timeout(function () {
 // Remove any old switcher
 if (switcher) {
 angular.element(switcher.switcher).remove();
 }
 // (re)create switcher to reflect latest state of the checkbox element
 switcher        = new $window.Switchery(elem[0], options);
 var element     = switcher.element;
 element.checked = scope.initValue;
 if (attrs.disabled) {
 switcher.disable();
 }

 switcher.setPosition(false);
 element.addEventListener('change', function (evt) {
 scope.$apply(function () {
 ngModel.$setViewValue(element.checked);
 })
 });
 scope.$watch('initValue', function (newValue, oldValue) {
 switcher.setPosition(false);
 });
 }, 0);
 }

 initializeSwitch();
 }

 return {
 require : 'ngModel',
 restrict: 'AE',
 scope   : {
 initValue: '=ngModel'
 },
 link    : linkSwitchery
 }
 }]);

 */
;