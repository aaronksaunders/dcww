// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova'])

    .run(function ($ionicPlatform, $rootScope) {
        $rootScope.isAndroid = ionic.Platform.isAndroid();

        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();

            }

        });
    })
/**
 * see documentation: https://www.parse.com/apps/quickstart#parse_data/web/existing
 *
 * SET THESE VALUES IF YOU WANT TO USE PARSE, COMMENT THEM OUT TO USE THE DEFAULT
 * SERVICE
 *
 * parse constants
 */
    .value('ParseConfiguration', {
        applicationId: "set your app id",
        javascriptKey: "your javascript key",
        USING_PARSE: true
    })
/**
 *
 */
    .config(function ($stateProvider, $urlRouterProvider) {

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

            // setup an abstract state for the tabs directive
            .state('tab', {
                url: "/tab",
                abstract: true,
                templateUrl: "templates/tabs.html",
                resolve: {
                    /**
                     * This function will initialize parse before executing the code to render the
                     * home tab view
                     *
                     * It will resolve successfully if you are using parse or not
                     *
                     * @param $q
                     * @param $timeout
                     * @param ParseConfiguration
                     * @returns {*}
                     */
                    usingParse: function ($q, $timeout, ParseConfiguration) {


                        if (ParseConfiguration.applicationId && (ParseConfiguration.applicationId === "set your app id")) {
                            alert("Set Credentials to use Parse.com, see comment in app.js")
                        }

                        if (ParseConfiguration.applicationId && ParseConfiguration.javascriptKey) {
                            console.log("parse initialize");
                            Parse.initialize(ParseConfiguration.applicationId, ParseConfiguration.javascriptKey);
                        } else {
                            ParseConfiguration.USING_PARSE = false
                        }

                        return ParseConfiguration.USING_PARSE;

                    }
                }
            })

            // Each tab has its own nav history stack:

            .state('tab.list', {
                url: '/list',
                views: {
                    'tab-list': {
                        templateUrl: 'templates/tab-list.html',
                        controller: 'ListCtrl'
                    }
                }
            })
            .state('tab.list-detail', {
                url: '/list/:itemId',
                views: {
                    'tab-list': {
                        templateUrl: 'templates/list-detail.html',
                        controller: 'ListDetailCtrl'
                    }
                }
            })

            .state('tab.account', {
                url: '/account',
                views: {
                    'tab-account': {
                        templateUrl: 'templates/tab-account.html',
                        controller: 'AccountCtrl'
                    }
                }
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/tab/list');

    });

