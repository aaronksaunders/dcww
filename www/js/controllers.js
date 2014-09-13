angular.module('starter.controllers', [])


    .controller('ListCtrl', function ($scope, ImageService, $cordovaCamera, $ionicPopup) {

        $scope.imageList = ImageService.all();

        // delete the selected row from table
        $scope.doDeleteRow = function (_index) {
            ImageService.delete({
                index: _index
            });
        };

        console.log(JSON.stringify(ImageService.imageSettings()));

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
                ImageService.save(_resultParams);

                $scope.imageList = ImageService.all();
                //$scope.$apply();

            }, function (err) {
                // An error occured. Show a message to the user
                alert("Error " + err);
            });
        }
    })

    .controller('ListDetailCtrl', function ($scope, $stateParams, ImageService) {
        $scope.imageItem = ImageService.get($stateParams.itemId);
        //console.log(JSON.stringify($scope.imageItem));
    })

    .controller('AccountCtrl', function ($scope, ImageService) {

        // get any saved properties
        $scope.imageSettings = ImageService.imageSettings();


        // get number of photos
        $scope.photoCount = ImageService.all().length;

        // get amount of space they are consuming
        var imageList = ImageService.all();
        var photoSize = 0;
        angular.forEach(imageList, function (_value, _key) {
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
