angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('welcomePage', {
    url: '/welcomePage',
    cache: false,
    controller: 'welcomePageCtrl',
    templateUrl: 'templates/welcomePage.html'
  })

  .state('disciplines', {
    url: '/disciplines',
    cache: false,
    params: {
      returnPage: {dynamic: true}
    },
    controller: 'disciplinesCtrl',
    templateUrl: 'templates/disciplinesPage.html'
  })

  .state('termsPage', {
    url: '/termsPage',
    cache: false,
    controller: 'termsPageCtrl',
    templateUrl: 'templates/termsAndConditions.html'
  })

  .state('newUserCreation', {
    url: '/newUserCreation',
    cache: false,
    params: {
      phone: { dynamic: true }
    },
    controller: 'newUserCreationCtrl',
    templateUrl: 'templates/newUserCreation.html'
  })

  .state('confirmationPage', {
    url: '/confirmationPage',
    cache: false,
    params: {
      newUserData: { dynamic: true }
    },
    controller: 'confirmationPageCtrl',
    templateUrl: 'templates/confirmationPage.html'
  })

  .state('loginPage', {
    url: '/loginPage',
    cache: false,
    controller: 'welcomePageCtrl',
    templateUrl: 'templates/login.html'
  })

  .state('newUserPhoto', {
    url: '/newUserPhoto',
    cache: false,
    controller: 'newUserPhotoCtrl',
    templateUrl: 'templates/newUserPhoto.html'
  })

  .state('tabsController.chatPage', {
    url: '/chatTab',
    cache: false,
    views: {
      'tab1': {
        templateUrl: 'templates/chatPage.html',
        controller: 'chatPageCtrl'
      }
    }
  })

  .state('tabsController.groupsPage', {
    url: '/groupsTab',
    cache: false,
    views: {
      'tab2': {
        templateUrl: 'templates/groupsPage.html',
        controller: 'groupsPageCtrl'
      }
    }
  })

  .state('tabsController.broadcastsPage', {
    url: '/broadcastTab',
    cache: false,
    views: {
      'tab3': {
        templateUrl: 'templates/broadcastsPage.html',
        controller: 'broadcastsPageCtrl'
      }
    }
  })

  .state('tabsController', {
    url: '/tabs',
    templateUrl: 'templates/tabsController.html',
    abstract: true
  })

  .state('groupSearch', {
    url: '/groupSearch',
    cache: false,
    controller: 'groupSearchCtrl',
    templateUrl: 'templates/groupSearch.html'
  })

  .state('broadcastSearch', {
    url: '/broadcastSearch',
    cache: false,
    controller: 'broadcastSearchCtrl',
    templateUrl: 'templates/broadcastSearch.html'
  })

  .state('individualChat', {
    url: '/individualChat',
    cache: false,
    params: {
      convo: {dynamic: true}
    },
    templateUrl: 'templates/individualChat.html'
  })

  .state('groupMessagePage', {
    url: '/groupMessagePage',
    params: {
      group_id: { dynamic: true }
    },
    cache: false,
    templateUrl: 'templates/individualGroup.html'
  })

  .state('groupProfilePage', {
    url: '/groupProfilePage',
    cache: false,
    params: {
      group: { dynamic: true }
    },
    controller: 'groupProfileCtrl',
    templateUrl: 'templates/groupProfile.html'
  })

  .state('broadcastProfilePage', {
    url: '/broadcastProfilePage',
    cache: false,
    params: {
      broadcast: {dynamic: true}
    },
    controller: 'broadcastProfileCtrl',
    templateUrl: 'templates/broadcastProfile.html'
  })

  .state('individualBroadcast', {
    url: '/individualBroadcast',
    cache: false,
    params: {
      broadcast_id: { dynamic: true }
    },
    templateUrl: 'templates/individualBroadcast.html'
  })

  .state('settingsPage', {
    url: '/settings',
    cache: false,
    templateUrl: 'templates/settingsPage.html'
  })

  .state('newChatMessage', {
    url: '/newChatMessage',
    cache: false,
    templateUrl: 'templates/newChatMessage.html'
  })

  .state('createNewGroup', {
    url: '/createNewGroup',
    cache: false,
    templateUrl: 'templates/createNewGroup.html'
  })

  .state('createNewBroadcast', {
    url: '/createNewBroadcast',
    cache: false,
    templateUrl: 'templates/createNewBroadcast.html'
  })


$urlRouterProvider.otherwise('/welcomePage')

})

.config(['$ionicConfigProvider', function($ionicConfigProvider) {

    $ionicConfigProvider.tabs.position('bottom'); // other values: top

}]);
