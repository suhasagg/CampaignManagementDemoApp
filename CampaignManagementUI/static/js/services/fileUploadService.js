'use strict';

cubeRootApp = angular.module('CubeRootApp');

cubeRootApp.config(function ($httpProvider) {
  $httpProvider.defaults.headers.post['Accept'] = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8';
  /*$httpProvider.defaults.headers.post['Content-Type']                = 'multipart/form-data; charset=utf-8';*/
  /*$httpProvider.defaults.headers.post['Content-Type']                = 'image/png';*/
});

cubeRootApp
  .service('fileUpload', ['$http', 'commonService',
    function ($http, commonService) {

      this.uploadFileToUrl = function (data, element, STSToken) {
        var
          STSToken = STSToken,
          data     = data,
          fd       = new FormData(),
          form     = new FormData(),
          filename = STSToken.fileName,
          fileType = data.type
          ;

        form.append("key", filename);
        form.append("AWSAccessKeyId", STSToken.accessKeyId);
        form.append("acl", "public-read");
        form.append("policy", STSToken.policy);
        form.append("signature", STSToken.signature);
        form.append("Content-Type", data.type);
        form.append("x-amz-security-token", STSToken.sessionToken);
        form.append("file", data);
        commonService.showLoading();
        $http.post("https://creativedata.s3.amazonaws.com:443", form,
          {
            headers: {
              'Accept'                   : 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
              'Accept-Language'          : 'en-US,en;q=0.8,hi;q=0.6',
              'Cache-Control'            : 'no-cache',
              'Content-Type'             : undefined,
              'Pragma'                   : 'no-cache',
              'Upgrade-Insecure-Requests': 1
            }
          })
          .success(function (response, status, headers, config) {
            var uploadedFileUrl = STSToken.fileUrl,
                preview,
                parentElement   = element.parent()
              ;

            parentElement.find('img').remove();
            parentElement.find('video').remove();
            parentElement.find('embed').remove();

            if (fileType.indexOf('image') != -1) {
              preview = angular.element('<img src="' + uploadedFileUrl + '" id="' + STSToken.uuid + '" />');
            } else if (fileType.indexOf('video') != -1) {
              preview = angular.element('<video controls><source src="' + uploadedFileUrl + '" type="' + fileType + '"></video>');
            } else if (fileType.indexOf('flash.movie') != -1) {
              preview = angular.element('<embed src="' + uploadedFileUrl + '"></embed>');
            }


            parentElement.append(preview);
            parentElement.addClass('contentAdded');
            commonService.hideLoading(2);
          })
          .error(function (error, status, headers, config) {
            commonService.hideLoading();
            commonService.commonErrorCallback()
          });
        //});


      }
    }])
;

;
