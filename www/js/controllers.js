angular.module('starter.controllers', [])


    .controller('ListCtrl', function (user, $state, $scope, ImageService, $cordovaCamera, $ionicPopup, $timeout, ParseImageService, ParseConfiguration, UserService) {


        alert(JSON.stringify(user));

        // if not using parse then assign the image service to the default
        // service
        if (ParseConfiguration.USING_PARSE === false) {
            ParseImageService = ImageService;
            console.log("ParseConfiguration: " + ParseConfiguration.USING_PARSE);
        }

        ParseImageService.all().then(function (_data) {

            $timeout($scope.imageList = _data, 0);

            console.log(JSON.stringify(_data));
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

        // add function to take a picture using the camera
        $scope.doTakePicture = function () {

            var options = {
                quality: ImageService.imageSettings().quality,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                correctOrientation: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: ImageService.imageSettings().dimensions,
                targetHeight: ImageService.imageSettings().dimensions,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: ImageService.imageSettings().saveToAlbum
            };

            $cordovaCamera.getPicture(options).then(function (_imageData) {
                // Success! Image data is here
                console.log("Success! Image data is here");


                // returns a promise
                return $ionicPopup.prompt({
                    title: 'Please enter caption for the image'
                }).then(function (_caption) {
                    return {
                        caption: _caption,
                        photo: _imageData
                    };
                });


            }).then(function (_resultParams) {

                // You have the caption now
                return ParseImageService.save(_resultParams);

            }).then(function () {

                console.log("update list");

                return ParseImageService.all().then(function (_data) {
                    $timeout($scope.imageList = _data, 0);
                });

            }, function (err) {
                // An error occured. Show a message to the user
                alert("Error " + err);
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
