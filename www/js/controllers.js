angular.module('starter.controllers', [])


    .controller('FriendsCtrl', function ($scope, Friends, $cordovaCamera) {
        $scope.friends = Friends.all();

        // add function to take a picture using the camera
        $scope.doTakePicture = function () {
            var options = {
                quality: 75,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 200,
                targetHeight: 200,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };

            $cordovaCamera.getPicture(options).then(function (imageData) {
                // Success! Image data is here
                console.log("Success! Image data is here");
                console.log(JSON.stringify(imageData));

                Friends.save(imageData);

                $scope.friends = Friends.all();
            }, function (err) {
                // An error occured. Show a message to the user
            });
        }
    })

    .controller('FriendDetailCtrl', function ($scope, $stateParams, Friends) {
        $scope.friend = Friends.get($stateParams.friendId);
        console.log(JSON.stringify($scope.friend));
    })

    .controller('AccountCtrl', function ($scope) {
    });
