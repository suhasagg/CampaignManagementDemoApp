"use strict";
cubeRootApp = angular.module('CubeRootApp');
cubeRootApp.controller('manageCreativeCtrl',['$scope','commonService','$http',function($scope, commonService, $http){
    commonService.showLoading();
    var
        urlPrefix = commonService.getUrlPrefix()
    ;

    $scope.creativeActions = ['Edit','Delete'];
    $scope.creativeFilters = ['channel','type','dateAdded', 'status'];
    /*[
        {'channel': 'Channel'}, {'type': 'Type'}, {'dateAdded': 'Date Added'}, {'status': 'Status'}
    ]*/

    $scope.updateStatus = function(obj,selectObj){
        //console.log(obj);

        var formObj={
            id:obj.id,
            title:obj.title,
            channel:obj.channel,
            type:obj.type,
            size:obj.size,
            dateAdded:obj.dateAdded,
            status:obj.status
        };
        console.log(selectObj);

        commonService.showLoading();
        $http({
            method: 'POST',
            data: formObj,
            headers: {
                'Content-Type': 'application/json'
            },
            url: urlPrefix+'/creative/updatecreativedetails'
        }).then(function successCallback(response) {
            if(response.data.type==="success"){
                //loadCreativeDetails();
                commonService.hideLoading();
            }
        },commonService.commonErrorCallback)
    };

    $scope.enableColumnFiltering = true;
    $scope.rowHeight = 35;
    $scope.statusOptions = [
        {key:'active',value:'Active'},
        {key:'pause',value:'Pause'},
        {key:'stop',value:'Stop'}
    ];


    function loadCreativeDetails() {

        $http({
            method: 'GET',
            url: urlPrefix + '/creative/getcreativedetails',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(function successCallback(response) {
                if (response.data.length > 0) {
                    $scope.creativesData = response.data;
                    $scope.columnDefs = [
                        {
                            field: 'title',
                            displayName: 'Title',
                            rowHeight: '35px',
                            enableFiltering: true,
                            cellEditableCondition: true,
                            cellTemplate: '<div class="ui-grid-cell-contents" title="{{row.entity.title}}">' +
                            '<a ui-sref="appView.creatives.editCreative({data:row.entity})"><i class="edit-icon icon-pencil icon-flipped"></i></a> &nbsp;' +
                            '{{row.entity.title}}' +
                            '</div>'
                        },
                        {
                            field: 'description',
                            displayName: 'Description',
                            enableFiltering: true,
                            cellEditableCondition: true
                        },
                        {
                            field: 'channel',
                            displayName: 'Channel '/*, cellTemplate:'<div class="ui-grid-cell-contents">{{row.entity.impressions}}</div>'*/
                        },
                        {
                            field: 'type',
                            displayName: 'Type '/*, cellTemplate:'<div class="ui-grid-cell-contents">{{row.entity.cpm }}</div>'*/
                        },
                        {field: 'size', displayName: 'Size'},
                        {field: 'dateAdded', displayName: 'Date Added', cellFilter: $scope.dateFormat},
                        {
                            field: 'status',
                            displayName: 'Status',
                            cellTemplate: '<div class="ui-grid-cell-contents" >' +
                            '<select ' +
                            /*'data-ng-options="status.key as status.value for status in grid.appScope.statusOptions track by status.key"' +*/
                            /*'ng-options="obj.key for obj in grid.appScope.statusOptions"' +*/
                            'ng-model="row.entity.status" ' +
                            'ng-change="grid.appScope.updateStatus(row.entity)">' +
                            '<option value="{{obj.key}}" ng-repeat="obj in grid.appScope.statusOptions">{{obj.value}}</option>' +
                            '</select>' +
                            '</div>'
                        }
                    ];

                    $scope.tabularData = $scope.creativesData;
                    commonService.hideLoading();
                }
            })
        ;
    }

    loadCreativeDetails();

    /*$scope.creativesData = [
        {
            title:'Sports',
            description:'Football kicked in goal',
            channel:'DBM',
            type:'Image',
            size:'900kb',
            dateAdded:'23-Aug-2015',
            status:'active',
            creativeActions :$scope.creativeActions
        },
        {
            title:'Sports1',
            description:'Football kicked in goal',
            channel:'DBM',
            type:'Image',
            size:'900kb',
            dateAdded:'23-Aug-2015',
            status:'active',
            creativeActions :$scope.creativeActions
        },
        {
            title:'Sports2',
            description:'Football kicked in goal',
            channel:'DBM',
            type:'Image',
            size:'900kb',
            dateAdded:'23-Aug-2015',
            status:'active',
            creativeActions :$scope.creativeActions
        }
    ];
*/
}]);