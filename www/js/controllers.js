angular.module('starter.controllers', [])


    .controller('ListCtrl', function (user, $state, $q, $scope, ImageService, $window, $cordovaCamera, $ionicPopup, $timeout, ParseImageService, ParseConfiguration, UserService) {


        alert(JSON.stringify(user));

        // if not using parse then assign the image service to the default
        // service
        if (ParseConfiguration.USING_PARSE === false) {
            ParseImageService = ImageService;
            console.log("ParseConfiguration: " + ParseConfiguration.USING_PARSE);
        }

        ParseImageService.all().then(function (_data) {

            $timeout($scope.imageList = _data, 0);

            //console.log(JSON.stringify(_data));
        }, function (_error) {
            console.error(JSON.stringify(_error));
            alert(_error.message)
        });

        // delete the selected row from table
        $scope.doDeleteRow = function (_index) {
            ParseImageService.delete(_index).then(function () {
                return ParseImageService.all().then(function (_data) {
                    $timeout($scope.imageList = _data, 0);
                });
            }, function (_error) {
                console.error(_error.message);
            });
        };

        console.log(JSON.stringify(ImageService.imageSettings()));


        // add function to take a picture using the camera
        $scope.doLogout = function () {
            UserService.logout(function () {
                $state.go('app-login');
            });
        };

        function resizeTheImage(originalImageData) {
            var deferred = $q.defer();
            $window.imageResizer.resizeImage(function (data) {

                console.log("resizeImage success: " + data.width + " " + data.height);
                deferred.resolve(data.imageData);

            }, function (error) {
                console.log("Error : \r\n" + error);
                deferred.reject(error);
            }, originalImageData, 0, 200, { //200x200
                resizeType: ImageResizer.RESIZE_TYPE_MAX_PIXEL,
                imageDataType: ImageResizer.IMAGE_DATA_TYPE_BASE64,
                pixelDensity: true,
                quality: 50,
                //imageDataType: ImageResizer.IMAGE_DATA_TYPE_URL,
                photoAlbum: 0,
                format: 'jpg'
            });
            return deferred.promise;
        }

        function getGeoPosition() {
            console.log("get location");
            var deferred = $q.defer();
            navigator.geolocation.getCurrentPosition(function (position) {
                console.log(position.coords.latitude, position.coords.longitude);
                deferred.resolve(position);
            });
            return deferred.promise;
        }

        // add function to take a picture using the camera
        $scope.doTakePicture = function () {

            $timeout(function () {
                _doTakePicture();
            }, 3000);
        };


        var _doTakePicture = function () {
            var originalImageData;
            var _resultParams;
            var coords;

            var options = {
                quality: ImageService.imageSettings().quality,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: ImageService.imageSettings().allowEdit,
                // on android correct Orientation
                correctOrientation: ImageService.imageSettings().allowEdit ? false : true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: ImageService.imageSettings().dimensions,
                //targetHeight: ImageService.imageSettings().dimensions,
                //popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: ImageService.imageSettings().saveToAlbum
            };

            $cordovaCamera.getPicture(options).then(function (_imageData) {
                // Success! Image data is here
                console.log("Success! Image data is here ");
                originalImageData = _imageData;


                // returns a promise
                //$timeout(function() {
                //    return $ionicPopup.prompt({
                //        title: 'Please enter caption for the image'
                //    }).then(function (_caption) {
                //        return {
                //            caption: _caption,
                //            photo: theImageData,
                //            isFile: true
                //        };
                //    });
                //},1);

                return getGeoPosition();

            }).then(function (position) {

                coords = position.coords;

                return resizeTheImage(originalImageData);

            }).then(function (resizedImageData) {

                console.log("Trying to save everything");

                return ParseImageService.save({
                    thumbBase64: resizedImageData,
                    photo: originalImageData,
                    caption: "simple caption",
                    coords: coords
                });
            }).then(function (result) {
                console.log("Saved everything ");

                return ParseImageService.all()

            }).then(function (_data) {
                $timeout($scope.imageList = _data, 0);

            }, function (err) {
                // An error occured. Show a message to the user
                console.log("Error When taking Photo " + err);
            });
        }
    })

    .controller('ListDetailCtrl', function ($scope, $stateParams, ParseImageService, $timeout, ImageService, ParseConfiguration) {

        // if not using parse then assign the image service to the default
        // service
        if (ParseConfiguration.USING_PARSE === false) {
            ParseImageService = ImageService;
            console.log("ParseConfiguration: " + ParseConfiguration.USING_PARSE);
        }

        ParseImageService.get($stateParams.itemId).then(function (_data) {
            $timeout($scope.imageItem = _data, 0);
        }, function (_error) {
            console.error(_error.message);
        });
        //console.log(JSON.stringify($scope.imageItem));
    })

    .controller('MapViewCtrl', function ($scope, $stateParams, ParseImageService, $timeout, ImageService, ParseConfiguration) {

        // if not using parse then assign the image service to the default
        // service
        if (ParseConfiguration.USING_PARSE === false) {
            ParseImageService = ImageService;
            console.log("ParseConfiguration: " + ParseConfiguration.USING_PARSE);
        }

        /**
         * Once state loaded, get put map on scope.
         */
        $scope.$on("$stateChangeSuccess", function () {


            ParseImageService.get($stateParams.itemId).then(function (_data) {
                $timeout($scope.imageItem = _data, 0);


                $scope.map = {
                    defaults: {
                        tileLayer: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
                        maxZoom: 18,
                        zoomControlPosition: 'bottomleft'
                    },
                    markers: {},
                    events: {
                        map: {
                            enable: ['context'],
                            logic: 'emit'
                        }
                    }
                };

                //$scope.goTo(0);
                var locationInfo = $scope.imageItem.get("location");

                if (locationInfo) {
                    $scope.map.center = {
                        lat: Number(locationInfo.latitude),
                        lng: Number(locationInfo.longitude),
                        zoom: 16
                    };


                    $scope.map.markers.now = {
                        lat: Number(locationInfo.latitude),
                        lng: Number(locationInfo.longitude),
                        message: "Picture Taken Here",
                        focus: true,
                        draggable: false
                    };
                } else {
                    alert("No Location Information");
                }
            }, function (_error) {
                console.error(_error.message);

                //$scope.goTo(0);
                $scope.map.center = {
                    lat: 38.85,
                    lng: -77.04,
                    zoom: 13
                };
            });


        });
    })
    .controller('AccountCtrl', function ($scope, ImageService, ParseConfiguration, ParseImageService, $timeout) {
        var photosList = [];

        // get any saved properties
        $scope.imageSettings = ImageService.imageSettings();

        if (ParseConfiguration.USING_PARSE) {
            // get number of photos
            ParseImageService.all().then(function (_data) {
                $timeout(function () {
                    photosList = _data;
                    $scope.photoCount = photosList.length;
                }, 0);
            });
        } else {
            // get number of photos
            photosList = ImageService.all();
            $scope.photoCount = photosList.length;
        }


        // get amount of space they are consuming

        var photoSize = 0;
        angular.forEach(photosList, function (_value, _key) {
            _value.data && console.log("length " + _value.data.length);
            photoSize += (_value.data ? _value.data.length : 0);
        }, photoSize);

        $scope.photoSize = photoSize;

        /**
         * save the settings to local storage
         */
        $scope.doSaveSettings = function () {
            // force the values to be saved as numbers
            $scope.imageSettings.dimensions = Number($scope.imageSettings.dimensions);
            $scope.imageSettings.quality = Number($scope.imageSettings.quality);

            // call service to save data
            ImageService.saveImageSettings($scope.imageSettings);

            alert("Settings Saved!");
        }
    });
