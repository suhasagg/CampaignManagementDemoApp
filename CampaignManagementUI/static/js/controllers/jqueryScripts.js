"use strict";

var cubeRootApp =  angular.module('CubeRootApp');
cubeRootApp.controller("jqueryScriptsCtrl",['$scope', 'commonService',function($scope, commonService){

    /* ------------------------------------------------------------------------------
     *
     *  # Template JS core
     *
     *  Core JS file with default functionality configuration
     *
     *  Version: 1.2
     *  Latest update: Dec 11, 2015
     *
     * ---------------------------------------------------------------------------- */

    var $_ = angular.element();

// Allow CSS transitions when page is loaded
    $_(window).on('load', function() {
        $_('body').removeClass('no-transitions');
    });


    $_(function() {

        // Disable CSS transitions on page load
        $_('body').addClass('no-transitions');



        // ========================================
        //
        // Content area height
        //
        // ========================================


        // Calculate min height
        function containerHeight() {
            var availableHeight = $_(window).height() - $_('.page-container').offset().top - $_('.navbar-fixed-bottom').outerHeight();

            $_('.page-container').attr('style', 'min-height:' + availableHeight + 'px');
        }

        // Initialize
        containerHeight();




        // ========================================
        //
        // Heading elements
        //
        // ========================================


        // Heading elements toggler
        // -------------------------

        // Add control button toggler to page and panel headers if have heading elements
        $_('.panel-heading, .page-header-content, .panel-body, .panel-footer').has('> .heading-elements').append('<a class="heading-elements-toggle"><i class="icon-more"></i></a>');


        // Toggle visible state of heading elements
        $_('.heading-elements-toggle').on('click', function() {
            $_(this).parent().children('.heading-elements').toggleClass('visible');
        });



        // Breadcrumb elements toggler
        // -------------------------

        // Add control button toggler to breadcrumbs if has elements
        $_('.breadcrumb-line').has('.breadcrumb-elements').append('<a class="breadcrumb-elements-toggle"><i class="icon-menu-open"></i></a>');


        // Toggle visible state of breadcrumb elements
        $_('.breadcrumb-elements-toggle').on('click', function() {
            $_(this).parent().children('.breadcrumb-elements').toggleClass('visible');
        });




        // ========================================
        //
        // Navbar
        //
        // ========================================


        // Navbar navigation
        // -------------------------

        // Prevent dropdown from closing on click
        $_(document).on('click', '.dropdown-content', function (e) {
            e.stopPropagation();
        });

        // Disabled links
        $_('.navbar-nav .disabled a').on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
        });

        // Show tabs inside dropdowns
        $_('.dropdown-content a[data-toggle="tab"]').on('click', function (e) {
            $_(this).tab('show');
        });




        // ========================================
        //
        // Element controls
        //
        // ========================================


        // Reload elements
        // -------------------------

        // Panels
        $_('.panel [data-action=reload]').click(function (e) {
            e.preventDefault();
            var block = $_(this).parent().parent().parent().parent().parent();
            $_(block).block({
                message: '<i class="icon-spinner2 spinner"></i>',
                overlayCSS: {
                    backgroundColor: '#fff',
                    opacity: 0.8,
                    cursor: 'wait',
                    'box-shadow': '0 0 0 1px #ddd'
                },
                css: {
                    border: 0,
                    padding: 0,
                    backgroundColor: 'none'
                }
            });

            // For demo purposes
            window.setTimeout(function () {
                $_(block).unblock();
            }, 2000);
        });


        // Sidebar categories
        $_('.category-title [data-action=reload]').click(function (e) {
            e.preventDefault();
            var block = $_(this).parent().parent().parent().parent();
            $_(block).block({
                message: '<i class="icon-spinner2 spinner"></i>',
                overlayCSS: {
                    backgroundColor: '#000',
                    opacity: 0.5,
                    cursor: 'wait',
                    'box-shadow': '0 0 0 1px #000'
                },
                css: {
                    border: 0,
                    padding: 0,
                    backgroundColor: 'none',
                    color: '#fff'
                }
            });

            // For demo purposes
            window.setTimeout(function () {
                $_(block).unblock();
            }, 2000);
        });


        // Light sidebar categories
        $_('.sidebar-default .category-title [data-action=reload]').click(function (e) {
            e.preventDefault();
            var block = $_(this).parent().parent().parent().parent();
            $_(block).block({
                message: '<i class="icon-spinner2 spinner"></i>',
                overlayCSS: {
                    backgroundColor: '#fff',
                    opacity: 0.8,
                    cursor: 'wait',
                    'box-shadow': '0 0 0 1px #ddd'
                },
                css: {
                    border: 0,
                    padding: 0,
                    backgroundColor: 'none'
                }
            });

            // For demo purposes
            window.setTimeout(function () {
                $_(block).unblock();
            }, 2000);
        });



        // Collapse elements
        // -------------------------

        //
        // Sidebar categories
        //

        // Hide if collapsed by default
        $_('.category-collapsed').children('.category-content').hide();


        // Rotate icon if collapsed by default
        $_('.category-collapsed').find('[data-action=collapse]').addClass('rotate-180');


        // Collapse on click
        $_('.category-title [data-action=collapse]').click(function (e) {
            e.preventDefault();
            var $categoryCollapse = $_(this).parent().parent().parent().nextAll();
            $_(this).parents('.category-title').toggleClass('category-collapsed');
            $_(this).toggleClass('rotate-180');

            containerHeight(); // adjust page height

            $categoryCollapse.slideToggle(150);
        });


        //
        // Panels
        //

        // Hide if collapsed by default
        $_('.panel-collapsed').children('.panel-heading').nextAll().hide();


        // Rotate icon if collapsed by default
        $_('.panel-collapsed').find('[data-action=collapse]').addClass('rotate-180');


        // Collapse on click
        $_('.panel [data-action=collapse]').click(function (e) {
            e.preventDefault();
            var $panelCollapse = $_(this).parent().parent().parent().parent().nextAll();
            $_(this).parents('.panel').toggleClass('panel-collapsed');
            $_(this).toggleClass('rotate-180');

            containerHeight(); // recalculate page height

            $panelCollapse.slideToggle(150);
        });



        // Remove elements
        // -------------------------

        // Panels
        $_('.panel [data-action=close]').click(function (e) {
            e.preventDefault();
            var $panelClose = $_(this).parent().parent().parent().parent().parent();

            containerHeight(); // recalculate page height

            $panelClose.slideUp(150, function() {
                $_(this).remove();
            });
        });


        // Sidebar categories
        $_('.category-title [data-action=close]').click(function (e) {
            e.preventDefault();
            var $categoryClose = $_(this).parent().parent().parent().parent();

            containerHeight(); // recalculate page height

            $categoryClose.slideUp(150, function() {
                $_(this).remove();
            });
        });




        // ========================================
        //
        // Main navigation
        //
        // ========================================


        // Main navigation
        // -------------------------

        // Add 'active' class to parent list item in all levels
        $_('.navigation').find('li.active').parents('li').addClass('active');

        // Hide all nested lists
        $_('.navigation').find('li').not('.active, .category-title').has('ul').children('ul').addClass('hidden-ul');

        // Highlight children links
        $_('.navigation').find('li').has('ul').children('a').addClass('has-ul');

        // Add active state to all dropdown parent levels
        $_('.dropdown-menu:not(.dropdown-content), .dropdown-menu:not(.dropdown-content) .dropdown-submenu').has('li.active').addClass('active').parents('.navbar-nav .dropdown:not(.language-switch), .navbar-nav .dropup:not(.language-switch)').addClass('active');



/*
        // Main navigation tooltips positioning
        // -------------------------

        // Left sidebar
        $_('.navigation-main > .navigation-header > i').tooltip({
            placement: 'right',
            container: 'body'
        });
*/



        // Collapsible functionality
        // -------------------------

        // Main navigation
        $_('.navigation-main').find('li').has('ul').children('a').on('click', function (e) {
            e.preventDefault();

            // Collapsible
            $_(this).parent('li').not('.disabled').not($_('.sidebar-xs').not('.sidebar-xs-indicator').find('.navigation-main').children('li')).toggleClass('active').children('ul').slideToggle(250);

            // Accordion
            if ($_('.navigation-main').hasClass('navigation-accordion')) {
                $_(this).parent('li').not('.disabled').not($_('.sidebar-xs').not('.sidebar-xs-indicator').find('.navigation-main').children('li')).siblings(':has(.has-ul)').removeClass('active').children('ul').slideUp(250);
            }
        });


        // Alternate navigation
        $_('.navigation-alt').find('li').has('ul').children('a').on('click', function (e) {
            e.preventDefault();

            // Collapsible
            $_(this).parent('li').not('.disabled').toggleClass('active').children('ul').slideToggle(200);

            // Accordion
            if ($_('.navigation-alt').hasClass('navigation-accordion')) {
                $_(this).parent('li').not('.disabled').siblings(':has(.has-ul)').removeClass('active').children('ul').slideUp(200);
            }
        });




        // ========================================
        //
        // Sidebars
        //
        // ========================================


        // Mini sidebar
        // -------------------------

        // Toggle mini sidebar
        $_('.sidebar-main-toggle').on('click', function (e) {
            e.preventDefault();

            // Toggle min sidebar class
            $_('body').toggleClass('sidebar-xs');
        });



        // Sidebar controls
        // -------------------------

        // Disable click in disabled navigation items
        $_(document).on('click', '.navigation .disabled a', function (e) {
            e.preventDefault();
        });


        // Adjust page height on sidebar control button click
        $_(document).on('click', '.sidebar-control', function (e) {
            containerHeight();
        });


        // Hide main sidebar in Dual Sidebar
        $_(document).on('click', '.sidebar-main-hide', function (e) {
            e.preventDefault();
            $_('body').toggleClass('sidebar-main-hidden');
        });


        // Toggle second sidebar in Dual Sidebar
        $_(document).on('click', '.sidebar-secondary-hide', function (e) {
            e.preventDefault();
            $_('body').toggleClass('sidebar-secondary-hidden');
        });


        // Hide detached sidebar
        $_(document).on('click', '.sidebar-detached-hide', function (e) {
            e.preventDefault();
            $_('body').toggleClass('sidebar-detached-hidden');
        });


        // Hide all sidebars
        $_(document).on('click', '.sidebar-all-hide', function (e) {
            e.preventDefault();

            $_('body').toggleClass('sidebar-all-hidden');
        });



        //
        // Opposite sidebar
        //

        // Collapse main sidebar if opposite sidebar is visible
        $_(document).on('click', '.sidebar-opposite-toggle', function (e) {
            e.preventDefault();

            // Opposite sidebar visibility
            $_('body').toggleClass('sidebar-opposite-visible');

            // If visible
            if ($_('body').hasClass('sidebar-opposite-visible')) {

                // Make main sidebar mini
                $_('body').addClass('sidebar-xs');

                // Hide children lists
                $_('.navigation-main').children('li').children('ul').css('display', '');
            }
            else {

                // Make main sidebar default
                $_('body').removeClass('sidebar-xs');
            }
        });


        // Hide main sidebar if opposite sidebar is shown
        $_(document).on('click', '.sidebar-opposite-main-hide', function (e) {
            e.preventDefault();

            // Opposite sidebar visibility
            $_('body').toggleClass('sidebar-opposite-visible');

            // If visible
            if ($_('body').hasClass('sidebar-opposite-visible')) {

                // Hide main sidebar
                $_('body').addClass('sidebar-main-hidden');
            }
            else {

                // Show main sidebar
                $_('body').removeClass('sidebar-main-hidden');
            }
        });


        // Hide secondary sidebar if opposite sidebar is shown
        $_(document).on('click', '.sidebar-opposite-secondary-hide', function (e) {
            e.preventDefault();

            // Opposite sidebar visibility
            $_('body').toggleClass('sidebar-opposite-visible');

            // If visible
            if ($_('body').hasClass('sidebar-opposite-visible')) {

                // Hide secondary
                $_('body').addClass('sidebar-secondary-hidden');

            }
            else {

                // Show secondary
                $_('body').removeClass('sidebar-secondary-hidden');
            }
        });


        // Hide all sidebars if opposite sidebar is shown
        $_(document).on('click', '.sidebar-opposite-hide', function (e) {
            e.preventDefault();

            // Toggle sidebars visibility
            $_('body').toggleClass('sidebar-all-hidden');

            // If hidden
            if ($_('body').hasClass('sidebar-all-hidden')) {

                // Show opposite
                $_('body').addClass('sidebar-opposite-visible');

                // Hide children lists
                $_('.navigation-main').children('li').children('ul').css('display', '');
            }
            else {

                // Hide opposite
                $_('body').removeClass('sidebar-opposite-visible');
            }
        });


        // Keep the width of the main sidebar if opposite sidebar is visible
        $_(document).on('click', '.sidebar-opposite-fix', function (e) {
            e.preventDefault();

            // Toggle opposite sidebar visibility
            $_('body').toggleClass('sidebar-opposite-visible');
        });



        // Mobile sidebar controls
        // -------------------------

        // Toggle main sidebar
        $_('.sidebar-mobile-main-toggle').on('click', function (e) {
            e.preventDefault();
            $_('body').toggleClass('sidebar-mobile-main').removeClass('sidebar-mobile-secondary sidebar-mobile-opposite sidebar-mobile-detached');
        });


        // Toggle secondary sidebar
        $_('.sidebar-mobile-secondary-toggle').on('click', function (e) {
            e.preventDefault();
            $_('body').toggleClass('sidebar-mobile-secondary').removeClass('sidebar-mobile-main sidebar-mobile-opposite sidebar-mobile-detached');
        });


        // Toggle opposite sidebar
        $_('.sidebar-mobile-opposite-toggle').on('click', function (e) {
            e.preventDefault();
            $_('body').toggleClass('sidebar-mobile-opposite').removeClass('sidebar-mobile-main sidebar-mobile-secondary sidebar-mobile-detached');
        });


        // Toggle detached sidebar
        $_('.sidebar-mobile-detached-toggle').on('click', function (e) {
            e.preventDefault();
            $_('body').toggleClass('sidebar-mobile-detached').removeClass('sidebar-mobile-main sidebar-mobile-secondary sidebar-mobile-opposite');
        });



        // Mobile sidebar setup
        // -------------------------

        $_(window).on('resize', function() {
            setTimeout(function() {
                containerHeight();

                if($_(window).width() <= 768) {

                    // Add mini sidebar indicator
                    $_('body').addClass('sidebar-xs-indicator');

                    // Place right sidebar before content
                    $_('.sidebar-opposite').insertBefore('.content-wrapper');

                    // Place detached sidebar before content
                    $_('.sidebar-detached').insertBefore('.content-wrapper');
                }
                else {

                    // Remove mini sidebar indicator
                    $_('body').removeClass('sidebar-xs-indicator');

                    // Revert back right sidebar
                    $_('.sidebar-opposite').insertAfter('.content-wrapper');

                    // Remove all mobile sidebar classes
                    $_('body').removeClass('sidebar-mobile-main sidebar-mobile-secondary sidebar-mobile-detached sidebar-mobile-opposite');

                    // Revert left detached position
                    if($_('body').hasClass('has-detached-left')) {
                        $_('.sidebar-detached').insertBefore('.container-detached');
                    }

                    // Revert right detached position
                    else if($_('body').hasClass('has-detached-right')) {
                        $_('.sidebar-detached').insertAfter('.container-detached');
                    }
                }
            }, 100);
        }).resize();




        // ========================================
        //
        // Other code
        //
        // ========================================


        // Plugins
        // -------------------------

/*        // Popover
        $_('[data-popup="popover"]').popover();


        // Tooltip
        $_('[data-popup="tooltip"]').tooltip();*/

    });
}]);


