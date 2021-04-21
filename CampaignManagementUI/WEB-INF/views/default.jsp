    <!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
        <title>CubeRoot</title>

        <!-- Global stylesheets -->
        <%--<link href="static/css/bootstrap.css" rel="stylesheet" type="text/css">--%>
        <%--<link href="static/css/core.css" rel="stylesheet" type="text/css">--%>
        <%--<link href="static/css/components.css" rel="stylesheet" type="text/css">--%>
        <%--<link href="static/css/colors.css" rel="stylesheet" type="text/css">--%>
        <%--<link href="static/css/angular-ui-grid.css" rel="stylesheet" type="text/css">--%>
        <!-- /global stylesheets -->

        <link href="static/css/all.min.css" rel="stylesheet" type="text/css"/>

        <!-- Core JS files -->
        <%--<script type="text/javascript" src="static/js/core/lib/jquery.min.js"></script>--%>
        <%--<script type="text/javascript" src="static/js/core/lib/bootstrap.min.js"></script>--%>
        </head>

        <body ng-app="CubeRootApp">
        <%--<div ng-controller="jqueryScriptsCtrl"></div>--%>
        <div >
        <!-- Main navbar -->
        <div class="navbar header-highlight" ng-controller="default">
        <div class="navbar-header full-width abs" ng-class="{'full-width abs':!loggedIn}">
        <a class="navbar-brand"><img src="static/images/logo_206x55.png" alt=""></a>

        <ul class="nav navbar-nav visible-xs-block ng-hide" ng-show="!!loggedIn">
        <%--<li ><a data-toggle="collapse" data-target="#navbar-mobile"><i class="icon-tree5"></i></a></li>--%>
        <li><a class="sidebar-mobile-main-toggle" ng-click="toggleBarMenu()"><i
        class="icon-paragraph-justify3"></i></a></li>
        </ul>
        </div>

        <%--<div class="navbar-collapse collapse" id="navbar-mobile">--%>
        <%--&lt;%&ndash;<ul class="nav navbar-nav">&ndash;%&gt;--%>
        <%--&lt;%&ndash;<li><a class="sidebar-control sidebar-main-toggle hidden-xs"><i class="icon-paragraph-justify3"></i></a></li>&ndash;%&gt;--%>
        <%--&lt;%&ndash;</ul>&ndash;%&gt;--%>

        <%--<ul class="nav navbar-nav navbar-right" ng-if="!!loggedIn">--%>
        <%--&lt;%&ndash;<li><a href="#">Text link</a></li>&ndash;%&gt;--%>

        <%--&lt;%&ndash;<li>&ndash;%&gt;--%>
        <%--&lt;%&ndash;<a href="#">&ndash;%&gt;--%>
        <%--&lt;%&ndash;<i class="icon-cog3"></i>&ndash;%&gt;--%>
        <%--&lt;%&ndash;<span class="visible-xs-inline-block position-right">Icon link</span>&ndash;%&gt;--%>
        <%--&lt;%&ndash;</a>&ndash;%&gt;--%>
        <%--&lt;%&ndash;</li>&ndash;%&gt;--%>

        <%--<li class="dropdown dropdown-user">--%>
        <%--<a class="dropdown-toggle" data-toggle="dropdown">--%>
        <%--<img src="static/images/man-silhouette.png" alt="">--%>
        <%--<span>{{userDetails.firstname}} {{userDetails.lastname}}</span>--%>
        <%--<i class="caret"></i>--%>

        <%--</a>--%>

        <%--<ul class="dropdown-menu dropdown-menu-right">--%>
        <%--&lt;%&ndash;<li><a href="#"><i class="icon-user-plus"></i> My profile</a></li>&ndash;%&gt;--%>
        <%--&lt;%&ndash;<li><a href="#"><i class="icon-coins"></i> My balance</a></li>&ndash;%&gt;--%>
        <%--&lt;%&ndash;<li><a href="#"><span class="badge badge-warning pull-right">58</span> <i class="icon-comment-discussion"></i> Messages</a></li>&ndash;%&gt;--%>
        <%--&lt;%&ndash;<li class="divider"></li>&ndash;%&gt;--%>
        <%--<li><a href="javascript:void(0);" ui-sref="appView.accountSettings({parentTxt:'Account Settings',pageName:''})"><i class="icon-cog5"></i> Account settings</a></li>--%>
        <%--<li><a href="javascript:void(0);" ng-click="logout();"><i class="icon-switch2"></i> Logout</a></li>--%>
        <%--</ul>--%>
        <%--</li>--%>
        <%--</ul>--%>
        <%--</div>--%>
        </div>
        <!-- /main navbar -->

        <%--<input type="hidden" value="true" id="loggedIn" />--%>
        <!-- Page container -->
        <div class="page-container">
        <ui-view></ui-view>
        </div>
        <!-- /page container -->

        <!-- angularjs files -->
        </div>

        <script type="text/javascript" src="static/js/core/lib/angular.min.js"></script>
        <script type="text/javascript" src="static/js/core/lib/angular-sanitize.js"></script>
        <script type="text/javascript" src="static/js/plugins/visualization/d3/d3.v3.min.js"></script>

        <script type="text/javascript" src="static/js/plugins/ng-tags-input.min.js"></script>

        <script type="text/javascript" src="static/js/plugins/select.js"></script>
        <!-- angular plugins for sortable dynamic tabular data -->
        <script type="text/javascript" src="static/js/core/lib/angular-touch.js"></script>
        <script type="text/javascript" src="static/js/core/lib/angular-animate.js"></script>
        <script type="text/javascript" src="static/js/core/lib/angular-ui-router.js"></script>


        <script type="text/javascript" src="static/js/core/lib/angular-ui-grid.js"></script>
        <script type="text/javascript" src="static/js/core/lib/angular-validation.js"></script>
        <script type="text/javascript" src="static/js/core/lib/angular-validation-rule.js"></script>

        <!-- /angular plugins for sortable dynamic tabular data -->
        <script type="text/javascript"
        src="static/js/core/lib/ui-bootstrap/ui-bootstrap-custom-tpls-1.3.3.min.js"></script>
        <!-- /angular js files -->

        <!-- Angular App JS files -->
        <script type="text/javascript" src="static/js/core/app.js"></script>
        <script type="text/javascript" src="static/js/services/commonService.js"></script>
        <script type="text/javascript" src="static/js/services/fileUploadService.js"></script>
        <script type="text/javascript" src="static/js/directives/directives.js"></script>
        <script type="text/javascript" src="static/js/core/router.js"></script>
        <script type="text/javascript" src="static/js/controllers/default.js"></script>

        <script type="text/javascript" src="static/js/controllers/dashboardPerformanceController.js"></script>
        <script type="text/javascript" src="static/js/controllers/dashboardAudiencesController.js"></script>
        <script type="text/javascript" src="static/js/controllers/dashboardIdealTargetController.js"></script>
        <script type="text/javascript" src="static/js/controllers/dashboardPublisherController.js"></script>
        <script type="text/javascript" src="static/js/controllers/campaignController.js"></script>
        <script type="text/javascript" src="static/js/controllers/manageCreativesController.js"></script>
        <script type="text/javascript" src="static/js/controllers/manageCampaignsController.js"></script>

        <script type="text/javascript" src="static/js/controllers/uib.datepicker.js"></script>
        <script type="text/javascript" src="static/js/controllers/tabular.js"></script>
        <script type="text/javascript" src="static/js/controllers/modalController.js"></script>
        <script type="text/javascript" src="static/js/controllers/loginController.js"></script>
        <script type="text/javascript" src="static/js/controllers/signupController.js"></script>
        <script type="text/javascript" src="static/js/controllers/appViewCtrl.js"></script>
        <script type="text/javascript" src="static/js/controllers/accountSettingsController.js"></script>
        <script type="text/javascript" src="static/js/controllers/applicationMsgController.js"></script>
        <%--<script type="text/javascript" src="static/js/controllers/viewCreativeController.js"></script>--%>
        <script type="text/javascript" src="static/js/controllers/addCreativeController.js"></script>
        <script type="text/javascript" src="static/js/controllers/editCreativeController.js"></script>
        <script type="text/javascript" src="static/js/controllers/addCampaignController.js"></script>
        <script type="text/javascript" src="static/js/controllers/editCampaignController.js"></script>
        <script type="text/javascript" src="static/js/controllers/addCampaignChannelController.js"></script>
        <script type="text/javascript" src="static/js/controllers/editCampaignChannelController.js"></script>

        <!-- D3 JS files -->
        <script type="text/javascript" src="static/js/D3Charts/streamGraph.js"></script>
        <script type="text/javascript" src="static/js/D3Charts/multilineGraph.js"></script>
        <script type="text/javascript" src="static/js/D3Charts/barChart.js"></script>
        <script type="text/javascript" src="static/js/D3Charts/barChart-horizontal.js"></script>
        <script type="text/javascript" src="static/js/D3Charts/pieCharts.js"></script>
        <script type="text/javascript" src="static/js/D3Charts/lineGraph.js"></script>
        <script type="text/javascript" src="static/js/D3Charts/multilineGraph.js"></script>
        <script type="text/javascript" src="static/js/D3Charts/streamGraph.js"></script>
        <script type="text/javascript" src="static/js/core/lib/topojson.v1.min.js"></script>
        <script type="text/javascript" src="static/js/D3Charts/geoChart3.js"></script>
        <!-- D3 JS files / -->

        <link href="static/css/icons/icomoon/styles.css" rel="stylesheet" type="text/css">
        </body>
        </html>
