// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'ionic.cloud', 'app.controllers', 'app.routes', 'app.directives','app.services', 'luegg.directives', 'ngCordova', 'ngFileUpload', 'ngStorage'])

.config(["$ionicCloudProvider", function($ionicCloudProvider) {
  $ionicCloudProvider.init({
    "core": {
      "app_id": "16f40046"
    },
    "push": {
      "sender_id": "464237360777",
      "pluginConfig": {
        "ios": {
          "badge": true,
          "sound": true
        },
        "android": {
          "iconColor": "#00A677"
        }
      }
    }
  });
}])

.config(["$cordovaInAppBrowserProvider", function($cordovaInAppBrowserProvider) {


  var defaultOptions = {
    location: 'no',
    clearcache: 'no',
    toolbar: 'yes'
  };

  document.addEventListener("deviceready", function () {

    $cordovaInAppBrowserProvider.setDefaultOptions(defaultOptions);

  }, false);

}])

.run(["$ionicPlatform", "$rootScope", "$ionicPush", "$localStorage", "$ionicNavBarDelegate", "$ionicPopup", "messageFactory",
function($ionicPlatform, $rootScope, $ionicPush, $localStorage, $ionicNavBarDelegate, $ionicPopup, messageFactory) {
  $ionicPlatform.ready(function() {

    $ionicPush.register().then(function (t) {
      var option = { ignore_user: true };
      return $ionicPush.saveToken(t, option);
    }).then(function (t) {
      console.log('Token saved: ', t);
      $localStorage.tokenObject = t;
    })

    $rootScope.$on('cloud:push:notification', function(event, data) {
      console.log(data.message);
      var msg = data.message;
      // alert(msg.title + ': ' + msg.text);

      messageFactory.updateChatMessages();
      messageFactory.updateGroupMessages();
      messageFactory.updateBroadcastMessages();

      var confirmPopup = $ionicPopup.confirm({
        title: msg.title,
        template: msg.text
      });

      confirmPopup.then(function(res) {
        if(res) {
          console.log('Check out the message');
        } else {
          console.log('Stay where you are');
        }
      });
    });

    $rootScope.$on('$ionicView.enter', function(e) {
      $ionicNavBarDelegate.showBar(true);
    });

    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
}])

.config(["$ionicConfigProvider", function($ionicConfigProvider) {
  $ionicConfigProvider.views.swipeBackEnabled(false);
}])
