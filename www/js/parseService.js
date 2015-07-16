//
// This service file provides a wrapper around a Plugin to provide push services to the application
// using Parse.com
//
angular.module('parse.services', [])

    .service('ParseService', ['$q', '$window', 'ParseConfiguration',
        function ($q, $window, ParseConfiguration) {

            return {
                initialize: function () {

                   console.log("Missing Parse Plugin " + JSON.stringify($window.parsePlugin));

                    var deferred = $q.defer();
                    $window.parsePlugin.initialize(ParseConfiguration.applicationId, ParseConfiguration.clientKey, function () {
                        console.log("Initialized Parse Plugin");
                        deferred.resolve('success');
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                getInstallationId: function () {
                    var deferred = $q.defer();
                    $window.parsePlugin.getInstallationId(function (id) {
                        deferred.resolve(id);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                subscribe: function (_channel) {
                    var deferred = $q.defer();
                    $window.parsePlugin.subscribe(_channel, function () {
                        deferred.resolve(true);
                    }, function (e) {
                        deferred.reject(false);
                    });
                    return deferred.promise;
                },
                unsubscribe: function (_channel) {
                    var deferred = $q.defer();
                    $window.parsePlugin.unsubscribe(_channel, function () {
                        deferred.resolve(true);
                    }, function (e) {
                        deferred.reject(false);
                    });
                    return deferred.promise;
                },
                getSubscriptions: function () {
                    var deferred = $q.defer();
                    $window.parsePlugin.getSubscriptions(function (_channelsArray) {
                        deferred.resolve(_channelsArray);
                    }, function (e) {
                        deferred.reject(false);
                    });
                    return deferred.promise;
                },
                registerCallback: function (_pushCallback) {
                    var deferred = $q.defer();
                    $window.parsePlugin.registerCallback('onNotification', function () {

                        $window.onNotification = function (pnObj) {

                            _pushCallback && _pushCallback(pnObj);

                            alert('We received this push notification: ' + JSON.stringify(pnObj));
                            if (pnObj.receivedInForeground === false) {
                                // TODO: route the user to the uri in pnObj
                            }
                        };
                        deferred.resolve(true);

                    }, function (error) {
                        deferred.reject(error);
                    });
                    return deferred.promise;

                }
            }
        }]);
