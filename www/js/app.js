// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter',
    [
        'ionic',
        'ionic.service.core',
        'ionic.service.analytics',
        'starter.controllers',
        'starter.services',
        'user.controllers',
        'user.services',
        'parse.services',
        'ngCordova'
    ])

    .run(function ($ionicPlatform, $rootScope, $state, $ionicAnalytics, ParseService) {


        $ionicPlatform.ready(function () {

            // Add this inside your $ionicPlatform.ready function that is defined inside the run function:
            $ionicAnalytics.register();

            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }

            $rootScope.isAndroid = ionic.Platform.isAndroid();

            // Get Parse Push Configured and Initiated
            ParseService.initialize().then(function () {

                return ParseService.getInstallationId();

            }).then(function (_response) {
                console.log("Parse Initialized " + _response);

                return ParseService.subscribe("broadcast_registered");

            }).then(function (_response) {
                return ParseService.registerCallback(function(pnObj){
                    alert("in assigned callback " + JSON.stringify(pnObj));
                });

            }).then(function (success) {
                console.log("Parse callback registered " + success);
            }, function error(_error) {
                alert(_error);
            });

            // this code handles any error when trying to change state.
            $rootScope.$on('$stateChangeError',
                function (event, toState, toParams, fromState, fromParams, error) {
                    console.log('$stateChangeError ' + error && error.debug);

                    // if the error is "noUser" the go to login state
                    if (error && error.error === "noUser") {
                        $state.go('app-login', {});
                    }
                });
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
        applicationId: "GRIoAKWUExfsT1q37Uyt66h4Lmx9ovvBAv2qigIw",
        javascriptKey: "VVKntpb3zNpAgAhcEJHapDwKMVUKhIdX5QG0PVxf",
        clientKey: "1M6398ExrwRb5d7FcSbhd8IoJvmyEDmG1FrS31Fc",
        USING_PARSE: true,
        initialized: false
    })
/**
 *
 */
    .config(function ($stateProvider, $urlRouterProvider, $ionicAppProvider) {

        // Identify app
        $ionicAppProvider.identify({
            app_id: 'd84ac019',
            api_key: '5b46eb15842120181a8a9267e5df069557877783270f3e44'
        });

        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider
            // create account state
            .state('app-signup', {
                url: "/signup",
                templateUrl: "templates/user/signup.html",
                controller: "SignUpController"
            })
            // login state that is needed to log the user in after logout
            // or if there is no user object available
            .state('app-login', {
                url: "/login",
                templateUrl: "templates/user/login.html",
                controller: "LoginController"
            })

            // setup an abstract state for the tabs directive, check for a user
            // object here is the resolve, if there is no user then redirect the
            // user back to login state on the changeStateError
            .state('tab', {
                url: "/tab",
                abstract: true,
                templateUrl: "templates/tabs.html",
                resolve: {
                    user: function (UserService) {
                        var value = UserService.init();
                        // alert(value); // for debugging
                        return value;
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

