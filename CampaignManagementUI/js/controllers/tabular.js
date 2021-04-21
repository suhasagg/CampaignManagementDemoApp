"use strict";

var cubeRootApp =  angular.module('CubeRootApp');

/*cubeRootApp.filter('visibleColumns', function() {
    return function(data, grid, query) {

        var matches = [];

        //no filter defined so bail
        if (query === undefined|| query==='') {
            return data;
        }

        query = query.toLowerCase();

        //loop through data items and visible fields searching for match
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < grid.columnDefs.length; j++) {

                var dataItem = data[i];
                var fieldName = grid.columnDefs[j]['field'];

                //as soon as search term is found, add to match and move to next dataItem
                if (!!dataItem[fieldName] && dataItem[fieldName].toString().toLowerCase().indexOf(query)>-1) {
                    matches.push(dataItem);
                    break;
                }
            }
        }
        return matches;
    }
});*/

cubeRootApp.controller('tabularCtrl', ['$scope', '$http', '$filter','uiGridConstants','commonService',
    function ($scope, $http, $filter, uiGridConstants,commonService) {

        if(!$scope.$parent.loggedIn) {
           return;
        }

        $scope.columns = undefined;

        $scope.gridOptions = {
            enableSorting: true,
            columnDefs: $scope.columns,
            enableGridMenu: false,
            enableSelectAll: false,
            exporterCsvFilename: $scope.$parent.currentChart+'-data.csv'/*,
            exporterPdfDefaultStyle: {fontSize: 9},
            exporterPdfTableStyle: {margin: [30, 30, 30, 30]},
            exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'red'},
            exporterPdfHeader: { text: "My Header", style: 'headerStyle' },
            exporterPdfFooter: function ( currentPage, pageCount ) {
                return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
            },
            exporterPdfCustomFormatter: function ( docDefinition ) {
                docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
                docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
                return docDefinition;
            },
            exporterPdfOrientation: 'portrait',
            exporterPdfPageSize: 'LETTER',
            exporterPdfMaxGridWidth: 500,
            exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location"))
*/,
            onRegisterApi: function(gridApi) {
                $scope.gridApi = gridApi;
            }
        };

    $scope.$watch('columnDefs',function() {
        var enableFiltering = $scope.$parent.enableColumnFiltering;
        try {
            $scope.gridOptions.enableFiltering = (enableFiltering === undefined) ? true : enableFiltering;
            $scope.Data = $scope.$parent.tabularData;
            $scope.columns = $scope.$parent.columnDefs;

            if (!!$scope.columns) {
                for (var i = 0, len = $scope.columns.length; i < len; i++) {
                    if (!!enableFiltering && $scope.columns[i].enableFiltering === undefined) {
                        $scope.columns[i].enableFiltering = false;
                    }

                   /* if($scope.columns[i].cellEditableCondition===undefined){
                        $scope.columns[i].cellEditableCondition = false;
                    }*/

                    $scope.columns[i].minWidth=100;
                }
            }
            $scope.gridOptions.columnDefs = $scope.columns;
            $scope.gridOptions.data = $scope.Data;
            $scope.gridOptions.rowHeight = $scope.$parent.rowHeight;
            
        } catch(e){}
    });
}]);
