'use strict';
var cubeRootApp =  angular.module('CubeRootApp',
        [
/*            'formly',
            'formlyBootstrap',*/
            'ui.router',
            'ui.bootstrap',
            'ngAnimate',
            'ngTouch',
            'ui.grid',
            'validation',
            'validation.rule',
            'CubeRootApp.directives'

        ]/*, function config(formlyConfigProvider) {

        // set templates here
        formlyConfigProvider.setWrapper({
            name: 'horizontalBootstrapLabel',
            template: [
                '<label for="{{::id}}" class="col-md-2 control-label">',
                  '{{to.label}} {{to.required ? "*" : ""}}',
                '</label>',
                '<div class="col-md-8">',
                '<formly-transclude></formly-transclude>',
                '</div>'
            ].join(' ')
        });

        formlyConfigProvider.setWrapper({
            name: 'horizontalBootstrapCheckbox',
            template: [
                '<div class="col-md-offset-2 col-md-8">',
                '<formly-transclude></formly-transclude>',
                '</div>'
            ].join(' ')
        });

        formlyConfigProvider.setType({
            name: 'horizontalInput',
            extends: 'input',
            wrapper: ['horizontalBootstrapLabel', 'bootstrapHasError']
        });

        formlyConfigProvider.setType({
            name: 'horizontalCheckbox',
            extends: 'checkbox',
            wrapper: ['horizontalBootstrapCheckbox', 'bootstrapHasError']
        });
    }*/);


