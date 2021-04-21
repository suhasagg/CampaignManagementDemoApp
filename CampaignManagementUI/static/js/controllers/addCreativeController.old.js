"use strict";
cubeRootApp = angular.module('CubeRootApp');
cubeRootApp.controller('addCreativeCtrl', ['$scope', 'commonService', function ($scope, commonService) {

    var vm = this;
    // funcation assignment
    //vm.onSubmit = onSubmit;

    // variable assignment
    vm.author = { // optionally fill in your info below :-)
        name: 'Kent C. Dodds',
        url: 'https://twitter.com/kentcdodds' // a link to your twitter/github/blog/whatever
    };
    vm.exampleTitle = 'Introduction';
    vm.env = {
        angularVersion: angular.version.full,
        //  formlyVersion: formlyVersion
    };

    vm.model = {
        awesome: true
    };
    vm.options = {
        formState: {
            awesomeIsForced: false
        }
    };

    vm.fields = [
        {
            className: 'col-md-12',
            fieldGroup: [
                {
                    className: 'col-md-6',
                    key: 'creativeName',
                    type: 'input',
                    templateOptions: {
                        label: 'Creative Name',
                        placeholder: 'Enter new Creative Name'
                    }
                },
                {
                    className: 'col-md-6',
                    key: 'description',
                    type: 'input',
                    templateOptions: {
                        label: 'Description',
                        placeholder: 'Write description about creative'
                    }
                }
            ]
        },
        {
            className: 'col-md-12',
            fieldGroup:[
                {
                    className:'col-md-12',
                    key: 'channel',
                    type: 'select',
                    defaultValue: '',
                    templateOptions: {
                        label: 'Channel',
                        options: [
                            {name: 'Select an option', value: '', selected: true},
                            {name: 'Display', value: 'display'},
                            {name: 'FaceBook', value: 'facebook'},
                            {name: 'Mobile', value: 'mobile'},
                            {name: 'Search', value: 'search'},
                            {name: 'Email', value: 'email'},
                            {name: 'SMS', value: 'sms'},
                            {name: 'Whatsapp', value: 'whatsapp'},
                            {name: 'Content', value: 'content'}
                        ]
                    }
                }
            ]
        }/*,
        {
            className:'col-md-12',
            fieldGroup:channelTemplates['channel']
        }*/
        /*{
            className: 'row',
            fieldGroup: [
                {
                    className: 'col-xs-6',
                    type: 'input',
                    key: 'firstName',
                    templateOptions: {
                        label: 'First Name'
                    }
                },
                {
                    className: 'col-xs-6',
                    type: 'input',
                    key: 'lastName',
                    templateOptions: {
                        label: 'Last Name'
                    },
                    expressionProperties: {
                        'templateOptions.disabled': '!model.firstName'
                    }
                }
            ]
        },
        {
            className: 'section-label',
            template: '<hr /><div><strong>Address:</strong></div>'
        },
        {
            className: 'row',
            fieldGroup: [
                {
                    className: 'col-xs-6',
                    type: 'input',
                    key: 'street',
                    templateOptions: {
                        label: 'Street'
                    }
                },
                {
                    className: 'col-xs-3',
                    type: 'input',
                    key: 'cityName',
                    templateOptions: {
                        label: 'City'
                    }
                },
                {
                    className: 'col-xs-3',
                    type: 'input',
                    key: 'zip',
                    templateOptions: {
                        type: 'number',
                        label: 'Zip',
                        max: 99999,
                        min: 0,
                        pattern: '\\d{5}'
                    }
                }
            ]
        },
        {
            template: '<hr />'
        },
        {
            type: 'input',
            key: 'otherInput',
            templateOptions: {
                label: 'Other Input'
            }
        },
        {
            type: 'checkbox',
            key: 'otherToo',
            templateOptions: {
                label: 'Other Checkbox'
            }
        }*/
    ];

    var channelTemplates  = {};

    channelTemplates.facebook=[

    ];

    commonService.hideLoading();
}]);