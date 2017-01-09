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

.config(['$cordovaInAppBrowserProvider', function($cordovaInAppBrowserProvider) {

  var defaultOptions = {
    location: 'no',
    clearcache: 'no',
    toolbar: 'yes'
  };

  document.addEventListener('deviceready', function () {
    $cordovaInAppBrowserProvider.setDefaultOptions(defaultOptions);
  }, false);

}])

.run(['$ionicPlatform', '$rootScope', '$ionicPush', '$localStorage', '$ionicNavBarDelegate', '$ionicPopup', 'messageFactory',
function($ionicPlatform, $rootScope, $ionicPush, $localStorage, $ionicNavBarDelegate, $ionicPopup, messageFactory) {

  $rootScope.data = {};

  $ionicPlatform.ready(function() {

    $ionicPush.register().then(function (t) {
      console.log("called register");
      var option = { ignore_user: true };
      return $ionicPush.saveToken(t, option);
    }).then(function (t) {
      console.log('Token saved: ', t);
      $localStorage.tokenObject = t;
      console.log($localStorage.tokenObject);
    })

    //All the possible strings for receiving a push notification button text

    var possibleButtonTexts = ['Awesome!', 'Ok', 'Great', 'Awesome!', 'Ok', 'Great', 'Awesome!', 'Ok', 'Great', 'Awesome!', 'Ok', 'Great', 'Great...', 'Cool', 'Affirmative', 'I tip my hat', 'Simply marvelous', 'Okey Dokey', 'Good', 'Super', 'Dagnabbit!', 'Hot Diggity Dog!'];
    //used to randomly choose text for the button
    function getRandomArbitrary(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    }

    $rootScope.$on('cloud:push:notification', function(event, data) {
      console.log(data.message);
      var msg = data.message;
      // alert(msg.title + ': ' + msg.text);

      messageFactory.updateChatMessages();
      messageFactory.updateGroupMessages();
      messageFactory.updateBroadcastMessages();

      var randomIndex = getRandomArbitrary(0, 21);

      $rootScope.data.message = msg;

      var alertPopup = $ionicPopup.alert({
        title: msg.title,
        templateUrl: 'templates/popup.html',
        okText: possibleButtonTexts[randomIndex],
        scope: $rootScope,
        okType: 'button-tangerine'
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

.config(['$ionicConfigProvider', function($ionicConfigProvider) {
  $ionicConfigProvider.views.swipeBackEnabled(false);
}])
