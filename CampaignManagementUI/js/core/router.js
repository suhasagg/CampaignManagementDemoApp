var cubeRootApp =  angular.module('CubeRootApp');
cubeRootApp.config(['$stateProvider', '$urlRouterProvider',function($stateProvider, $urlRouterProvider) {
/*
    var loggedIn = document.getElementById('loggedIn').value;
    if (loggedIn != 'true') {
        $urlRouterProvider.otherwise('login');
    } else {
        $urlRouterProvider.otherwise('notFound');
    }*/
    //$urlRouterProvider.otherwise('/performance');
    $urlRouterProvider.when("","/login");
    $urlRouterProvider.when("/","/login");

    // console.log('router : '+$rootScope.userDetails);

    $stateProvider 
        .state('login', {
            url: '/login',
            templateUrl: './views/login.html',
            controller:'loginCtrl'
        })
        .state('loading', {
            url: '/loading',
            templateUrl: './views/loading.html',
            controller:'loadingCtrl'
        })
        .state('confirmation', {
            url: '/confirmation',
            templateUrl: './views/confirmation.html'
        })
        .state('signup', {
            url: '/signup',
            templateUrl: './views/signup.html',
            controller:'signupController'
        })
        .state('appView',{
            url: '/appView',
            abstract:true,
            templateUrl: './views/appView.html',
            controller: 'appViewCtrl'
        })
        .state('appView.publisher', {
            url: '/publisher',
            parent:'appView',
            params:{
                parentTxt:'Dashboard',
                pageName:'Publisher'
            },
            //abstract:true,
            controller:'appViewCtrl',
            views: {
                "mainSidebar": {
                    templateUrl: './views/main_sidebar_publisher.html'
                },
                "content": {
                    templateUrl: './views/dashboard-publisher.html',
                    controller: 'dashboardPublisherCtrl'
                }
            }
        })

        .state('appView.performance', {
            url: '/performance',
            parent:'appView',
            params:{
                parentTxt:'Dashboard',
                pageName:'Performance'
            },
            //abstract:true, 
            controller:'appViewCtrl',
            views: {
                "mainSidebar": {
                    templateUrl: './views/main_sidebar.html'
                },
                "content": {
                    templateUrl: './views/dashboard-performance.html',
                    controller: 'dashboardPerformanceCtrl'
                },
                "impressions@appView.content":{
                    template:"performanceChartTpl"
                }
            }
        })

        /*.state('appView.performance.impressions', {
            url: '/impressions',
            parent:'appView.performance',
            params:{
                parentTxt:'Dashboard',
                pageName:'Performance > Impressions'
            },
            views: {
                "mainSidebar": {
                    templateUrl: './views/main_sidebar.html',
                },

                "content": {
                    templateUrl: './views/dashboard-performance.html',
                    controller: 'dashboardCtrl',
                    view:{
                        template: 'performanceChartTpl'
                    }
                }
            }
        })*/

        .state('appView.audiences', {
            url: '/audiences',
            parent:'appView',
            params:{
                parentTxt:'Dashboard',
                pageName:'Audiences'
            },
            controller:'appViewCtrl',
            views: {
                "mainSidebar": {
                    templateUrl: './views/main_sidebar.html',
                },

                "content": {
                    templateUrl: './views/dashboard-audiences.html',
                    controller: 'dashboardAudiencesCtrl'
                }
            }
        })

        .state('appView.idealTarget', {
            url: '/idealTarget',
            parent:'appView',
            params:{
                parentTxt:'Dashboard',
                pageName:'Ideal Target'
            },
            controller:'appViewCtrl',
            views: {
                "mainSidebar": {
                    templateUrl: './views/main_sidebar.html'
                },

                "content": {
                    templateUrl: './views/dashboard-idealTarget.html',
                    controller: 'dashboardIdealTargetCtrl'
                }
            }
        })
        .state('appView.accountSettings', {
            url: '/accountSettings',
            parent:'appView',
            params:{
                parentTxt:'Account Settings',
                pageName:''
            },
            controller:'appViewCtrl',
            views: {
                "mainSidebar": {
                    templateUrl: './views/main_sidebar.html'
                },

                "content": {
                    templateUrl: './views/accountSettings.html',
                    controller: 'accountSettingsCtrl'
                }
            }
        })

        .state('appView.campaign', {
            url: '/campaign',
            parent:'appView',
            params:{
                pageName:'Manage Campaign'
            },
            controller:'appViewCtrl',
            views: {
                "mainSidebar": {
                    templateUrl: './views/main_sidebar.html'
                },
                "content": {
                    templateUrl: './views/campaign.html',
                    controller: 'campaignCtrl'
                }
            }

        })

        .state('appView.creatives', {
            url: '/creatives',
            parent:'appView',
            abstract:true,
            views: {
                "mainSidebar": {
                    templateUrl: './views/main_sidebar.html'
                },
                "content": {
                    templateUrl: './views/creatives.html'
                }
            }
        })
        .state('appView.creatives.manage', {
            url: '/manage',
            parent:'appView.creatives',
            templateUrl: './views/manageCreatives.html',
            controller: 'manageCreativeCtrl'
        })

        .state('appView.creatives.addCreative', {
            url: '/add',
            parent:'appView.creatives',
            templateUrl: './views/addCreative.html',
            controller: 'addCreativeCtrl as vm'
        })

        .state('appView.creatives.editCreative', {
            url: '/edit',
            parent:'appView.creatives',
            templateUrl: './views/addCreative.html',
            controller: 'editCreativeCtrl as vm',
            params: {
                data:null
            }
        })
    ;
}])
/*
.run(['$rootScope', '$state', '$stateParams',
    function ($rootScope, $state, $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    }])*/;