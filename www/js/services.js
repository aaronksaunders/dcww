angular.module('starter.services', [])

    .factory('ParseImageService', function ($window) {

        console.log("parse initialize");
        Parse.initialize("GRIoAKWUExfsT1q37Uyt66h4Lmx9ovvBAv2qigIw", "VVKntpb3zNpAgAhcEJHapDwKMVUKhIdX5QG0PVxf");


        var _all = function () {
            var query = new Parse.Query("ImageInfo");
            //query.descending("gpa");
            return query.find();
        };
        var _delete = function (_objectId) {
            var query = new Parse.Query("ImageInfo");
            return query.get(_objectId).then(function(_data){
                return _data.destroy();
            });
        };
        var _get = function (_objectId) {
            var query = new Parse.Query("ImageInfo");
            //query.descending("gpa");
            return query.get(_objectId);
        };
        /**
         *
         * @param _params
         * @private
         */
        var _save = function (_params) {
            var ImageObject = Parse.Object.extend("ImageInfo");


            if (_params.photo != "") {
                // create the parse file
                var imageFile = new Parse.File("mypic.jpg", {base64: _params.photo});
                console.log(imageFile);

                // save the parse file
                return imageFile.save().then(function () {

                    // create object to hold caption and file reference
                    var imageObject = new ImageObject();

                    // set object properties
                    imageObject.set("caption", _params.caption);
                    imageObject.set("picture", imageFile);

                    // save object to parse backend
                    return imageObject.save();


                }, function (error) {
                    console.log("Error");
                    console.log(error);
                });

            } else {
                // create object to hold caption and file reference
                var imageObject = new ImageObject();

                // set object properties
                imageObject.set("caption", _params.caption);

                // save object to parse backend
                return imageObject.save();

            }
        };
        return {
            all: _all,
            save: _save,
            get : _get,
            delete : _delete,
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
            saveImageSettings: function (_settings) {
                $window.localStorage.setItem("application.image.props", JSON.stringify(_settings));
            }
        }
    })
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
            saveImageSettings: function (_settings) {
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
