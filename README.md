DC Web Women Code(Her) Ionic Framework Sample App
====

- Install Ionic [http://ionicframework.com/getting-started/](http://ionicframework.com/getting-started/)
  - this process will download phonegap/cordova for you
  - we will be using angularjs, that is bunded with ionic, see more information on [AngularJS Here](https://angularjs.org/)
- Download Code from repo
- Add missing bower and node modules
  - enter command `bower update`
  - enter command `sudo npm update -g ionic`
- Add back the plugins that are not included in repo
  - enter command `cordova plugin add org.apache.cordova.camera`
  - enter command `cordova plugin add org.apache.cordova.statusbar`
  - enter command `cordova plugin add org.apache.cordova.console`
  - enter command `cordova plugin add org.apache.cordova.device`
  - enter command `cordova plugin add com.ionic.keyboard`
- Add in the platforms 
  - enter command `ionic platform android`
  - enter command `ionic platform ios`
