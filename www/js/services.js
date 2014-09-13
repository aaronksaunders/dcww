angular.module('starter.services', [])

/**
 * A simple example service that returns some data.
 */
    .factory('ImageService', function ($window) {
        // Might use a resource here that returns a JSON array

        // Some fake testing data
        var friends = [
            { id: 0, name: 'Scruff McGruff', timestamp: new Date()},
            { id: 1, name: 'G.I. Joe', timestamp: new Date()}
        ];

        return {
            /**
             * get settings from local storage
             * @returns {*}
             */
            imageSettings: function () {
                var savedData = $window.localStorage.getItem("application.image.props") || null;
                return (savedData !== null ? JSON.parse(savedData) :
                                { quality: 75, dimensions: 250, saveToAlbum: false});
            },
            /**
             * save settings to local storage
             * @param _settings
             */
            saveImageSettings:function(_settings) {
                $window.localStorage.setItem("application.image.props", JSON.stringify(_settings));
            },
            /**
             *
             * @returns {{id: number, name: string}[]}
             */
            all: function () {
                return friends;
            },
            /**
             *
             * @param friendId
             * @returns {*|{id: number, name: string}}
             */
            get: function (friendId) {
                // Simple index lookup
                return friends[friendId];
            },
            /**
             *
             * @param _params.caption
             * @param _params.photo
             */
            save: function (_params) {
                var id = friends.length;
                friends.push({
                    id: id,
                    name: _params.caption,
                    data: 'data:image/png;base64,' + _params.photo,
                    timestamp: new Date()
                })
            },
            delete: function (_params) {
                friends.splice(_params.index, 1)
            }
        }
    });
