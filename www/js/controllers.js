angular.module('app.controllers', ['app.services'])

.controller('navbarCtrl', ['$rootScope', '$scope', '$state',
function ($rootScope, $scope, $state) {
  $scope.currentState = $state.current;

  $scope.hideNavBar = false;

  $scope.hideGroupIcons = true;
  $scope.hideBroadcastIcons = true;
  $scope.hideChatIcons = true;

  $scope.showBackToChat = false;
  $scope.showBackToBroadcasts = false;
  $scope.showBackToGroups = false;

  $scope.pageTitle = 'Whinny';

  $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
    console.log(toState.url);
    if(toState.url === "/chatTab"){
      $scope.hideNavBar = false;
      $scope.hideGroupIcons = true;
      $scope.hideBroadcastIcons = true;
      $scope.hideChatIcons = false;
      $scope.showBackToChat = false;
      $scope.showSettings = true;
      $scope.pageTitle = 'Whinny';
    }
    if(toState.url === "/groupsTab"){
      $scope.hideNavBar = false;
      $scope.hideGroupIcons = false;
      $scope.hideBroadcastIcons = true;
      $scope.hideChatIcons = true;
      $scope.showBackToGroups = false;

      $scope.showSettings = true;
      $scope.pageTitle = 'Whinny';
    }
    if(toState.url === "/broadcastTab"){
      $scope.hideNavBar = false;
      $scope.hideGroupIcons = true;
      $scope.hideBroadcastIcons = false;
      $scope.hideChatIcons = true;
      $scope.showBackToBroadcasts = false;

      $scope.showSettings = true;
      $scope.pageTitle = 'Whinny';
    }

    if(toState.url === '/newChatMessage'){
      $scope.hideChatIcons = true;
      $scope.showBackToChat = true;
      $scope.showSettings = false;
      $scope.pageTitle = 'New Chat';
    }
    if(toState.url === '/createNewGroup'){
      $scope.hideGroupIcons = true;
      $scope.showBackToGroups = true;
      $scope.showSettings = false;
      $scope.pageTitle = 'New Group';
    }
    if(toState.url === '/groupSearch'){
      $scope.hideGroupIcons = true;
      $scope.showBackToGroups = true;
      $scope.showSettings = false;
      $scope.pageTitle = 'Groups';
    }
    if(toState.url === '/broadcastSearch'){
      $scope.hideBroadcastIcons = true;
      $scope.showBackToBroadcasts = true;
      $scope.showSettings = false;
      $scope.pageTitle = 'Broadcasts'
    }

    if(toState.url === '/settings'){
      $scope.showSettings = false;
      $scope.showBackToChat = true;
      $scope.hideChatIcons = true;
      $scope.hideGroupIcons = true;
      $scope.hideBroadcastIcons = true;
      $scope.pageTitle = 'Settings';
    }

    if(toState.url === '/individualChat') $scope.hideNavBar = true;
    if(toState.url === '/groupMessagePage') $scope.hideNavBar = true;
    if(toState.url === '/individualBroadcast') $scope.hideNavBar = true;
    if(toState.url === '/welcomePage') $scope.hideNavBar = true;
    if(toState.url === '/disciplines') $scope.hideNavBar = true;
    if(toState.url === '/termsPage') $scope.hideNavBar = true;
    if(toState.url === '/newUserCreation') $scope.hideNavBar = true;
    if(toState.url === '/confirmationPage') $scope.hideNavBar = true;
    if(toState.url === '/loginPage') $scope.hideNavBar = true;
    if(toState.url === '/newUserPhoto') $scope.hideNavBar = true;
    if(toState.url === '/groupProfilePage') $scope.hideNavBar = true;
    if(toState.url === '/broadcastSearch') $scope.hideNavBar = true;
  });

  $scope.toSettingsPage = function () {
    $state.go('settingsPage')
  }
  $scope.createNewChat = function () {
    $state.go('newChatMessage');
  }
  $scope.goToGroupSearchPage = function () {
    $state.go('groupSearch');
  }
  $scope.createNewGroup = function () {
    $state.go('createNewGroup');
  }
  $scope.goToBroadcastSearchPage = function () {
    $state.go('broadcastSearch');
  }

  $scope.backToChat = function () {
    $state.go('tabsController.chatPage');
  }
  $scope.backToGroups = function () {
    $state.go('tabsController.groupsPage');
  }
  $scope.backToBroadcastsPage = function () {
    $state.go('tabsController.broadcastsPage');
  }

}])

.controller('welcomePageCtrl', ['$scope', '$state', '$stateParams', 'messageFactory', '$cordovaCamera', '$localStorage', '$ionicPlatform', '$ionicPush',
function ($scope, $state, $stateParams, messageFactory, $cordovaCamera, $localStorage, $ionicPlatform, $ionicPush) {
  //read from file,
  //if logged in, redirect to tabs.messages
  var currentUser = messageFactory.getCurrentUser();

  $scope.data = {};
  $scope.data.errors = [];

  $ionicPlatform.ready(function () {

    $ionicPush.register({
      canShowAlert: true, //Can pushes show an alert on your screen?
      canSetBadge: true, //Can pushes update app icon badges?
      canPlaySound: true, //Can notifications play a sound?
      canRunActionsOnWake: true, //Can run actions outside the app,
      onNotification: function (notification, event) {
        // Handle new push notifications here
        console.log("thingslkajsfd;lz");
        console.log(notification);
      }
    }).then(function (t) {
      console.log("token in welcome controlller");
      var option = { ignore_user: true };
      return $ionicPush.saveToken(t, option);
    }).then(function (t) {
      $localStorage.token = t;
      console.log('token in welcome controlller: ', t);
      for(key in t){
        console.log(key + ": " + t[key]);
      }
    })

  })

  if($localStorage.whinny_user){
    if($localStorage.whinny_user.verified){
      console.log($localStorage.whinny_user);
      messageFactory.versionCheck().then(function (res) {
        if(res.deprecatedClient){
          alert("Your Whinny app is now out of date! Please download the new version!");
          $scope.data.errors.push("Please download the new version of Whinny");
        } else {
          messageFactory.setCurrentUser($localStorage.whinny_user);
          $state.go('tabsController.chatPage');
        }
      })
    }
  }
  // if(Object.keys(currentUser) > 0) $state.go('tabsController.chatPage');


  $scope.data.goToLogin = function () {
    $state.go('loginPage');
  }

  $scope.data.loginToWhinny = function () {
    $scope.data.errors = [];
    if(!$scope.data.phone){
      $scope.data.errors.push('Please enter your phone number');
      return;
    }
    if($scope.data.phone.length < 10 || $scope.data.phone.length > 10){
      $scope.data.errors.push('Please enter a valid phone number without punctuation - 3031231234')
    }
    if($scope.data.errors.length === 0){
      messageFactory.logIn($scope.data.phone).then(function (res) {
        if(res.data.deprecatedClient){
          alert("Your Whinny app is now out of date! Please download the new version!");
          $scope.data.errors.push("Please download the new version of Whinny");
        }
        if(res.data.newUser){
          $state.go('newUserCreation', { phone: $scope.data.phone });
        } else if(res.data[0]){
          if(res.data[0].user_id > 0) $state.go('confirmationPage', { newUserData: $scope.data });
        }
      })
    }
  }

  $scope.data.goToTerms = function () {
    $state.go('termsPage');
  }

  $scope.data.backToWelcomePage = function () {
    $state.go('welcomePage');
  }

  $scope.data.takePhoto = function () {
    var options = {
      quality: 75,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 300,
      targetHeight: 300,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    };

    $cordovaCamera.getPicture(options).then(function (imageData) {
        $scope.data.imgURI = "data:image/jpeg;base64," + imageData;
    }, function (err) {
        console.log("error in take photo");
    });
  }

  $scope.data.choosePhoto = function () {
    console.log("choosing photo");
    var options = {
      quality: 75,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 300,
      targetHeight: 300,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    }
    $cordovaCamera.getPicture(options).then(function (imageData) {
      $scope.data.imgURI = "data:image/jpeg;base64," + imageData;
    }, function (err) {
      console.log("error has occurred in get picture");
    })
  }

}])

.controller('termsPageCtrl', ['$scope', '$state', '$stateParams', 'messageFactory',
function ($scope, $state, $stateParams, messageFactory) {
  console.log("terms page controller!");
  console.log($stateParams);

  $scope.returnToNewUserCreation = function () {
    $state.go('newUserCreation')
  }

}])

.controller('newUserCreationCtrl', ['$scope', '$state', '$stateParams', 'messageFactory',
function ($scope, $state, $stateParams, messageFactory) {
  console.log("params");
  console.log($stateParams);

  console.log("newUserCreationCtrl");
  $scope.data = {};
  $scope.data.errors = [];

  $scope.data.phone = $stateParams.phone;

  $scope.data.joinWhinny = function () {
    console.log("joining");
    $scope.data.errors = [];
    if(!$scope.data.first_name || !$scope.data.last_name) $scope.data.errors.push("You must enter your name to continue");
    if(!$scope.data.licenseAgreement) $scope.data.errors.push("You must agree to the terms and conditions to continue");

    if($scope.data.errors.length === 0){
      messageFactory.joinWhinny($scope.data).then(function (res) {
        console.log(res);
        $state.go('confirmationPage', { newUserData: $scope.data });
      });
    }
  }

  $scope.data.goToTerms = function () {
    $state.go('termsPage');
  }

  $scope.data.backToWelcomePage = function () {
    $state.go('welcomePage');
  }

}])

.controller('confirmationPageCtrl', ['$scope', '$state', '$stateParams', 'messageFactory',
function ($scope, $state, $stateParams, messageFactory) {
  //read from file,
  //if logged in, redirect to tabs.messages

  console.log($stateParams.newUserData);

  $scope.data = {};
  $scope.data.errors = [];

  $scope.confirmPhoneNumber = function () {
    $scope.data.errors = [];

    if(!$scope.confirmationNumber){
      $scope.data.errors.push('Please enter your confirmation number.');
    }
    if($scope.confirmationNumber){
      if($scope.confirmationNumber.length > 4){
        $scope.data.errors.push('It looks like you entered too many characters. Check your confirmation code');
      }
    }
    if($scope.data.errors.length === 0){
      messageFactory.submitConfirmationNumber($stateParams.newUserData.phone, $scope.confirmationNumber).then(function (res) {
        if (res.data.verified === true) {
          //If you have a user picture and
          if(res.data.account_is_setup === true){
            //Go to tabs
            $state.go('tabsController.chatPage');
          } else {
            //Go to interests and then photo
            $state.go('disciplines', {returnPage: 'newUserPhoto'});
          }
        } else if(res.data.status === 'Incorrect code given') {
          $scope.data.errors.push('Hmmm, looks like the code you submitted didn\'t work. Try to send it again.');
          console.log("An error has occurred");
        }
      });
    }
  }
  $scope.backToWelcomePage = function () {
    $state.go('welcomePage'); //TODO comes with context to go back to registration page or to welcome
  }
}])

.controller('disciplinesCtrl', ['$scope', '$state', '$stateParams', 'messageFactory',
function ($scope, $state, $stateParams, messageFactory) {
  console.log("disciplines Ctrl to", $stateParams.returnPage);
  $scope.data = {};
  $scope.data.selectedDisciplines = [];

  if($stateParams.returnPage === 'newUserPhoto'){
    $scope.data.turnOffBackButton = true;
  } else {
    $scope.data.turnOffBackButton = false;
  }

  messageFactory.getUserInterests().then(function (res) {
    $scope.data.selectedDisciplines = res;
  });

  $scope.data.selectDiscipline = function (discipline) {
    console.log("selecting", discipline);
    var index = $scope.data.selectedDisciplines.indexOf(discipline);
    if(index === -1){
      $scope.data.selectedDisciplines.push(discipline);
    } else {
      $scope.data.selectedDisciplines.splice(index, 1);
    }
  }

  $scope.data.submitDiscipline = function () {
    console.log("submitting discipline");
    console.log($scope.data.selectedDisciplines, $scope.data.suggestedDiscipline);
    messageFactory.addUserInterests($scope.data.selectedDisciplines, $scope.data.suggestedDiscipline).then(function (res) {
      console.log("successful!");
      $state.go($stateParams.returnPage);
    })
  }

  $scope.backToSettingsPage = function () {
    $state.go('settingsPage', { context: 'chat'})
  }

}])

.controller('newUserPhotoCtrl', ['$scope', '$state', '$stateParams', 'messageFactory', '$cordovaCamera', 'photoFactory', '$timeout', '$ionicPush',
function ($scope, $state, $stateParams, messageFactory, $cordovaCamera, photoFactory, $timeout, $ionicPush) {
  console.log("new User Phot CTRL");
  $scope.data = {};
  $scope.data.currentUser = messageFactory.getCurrentUser();
  $scope.data.errors = [];

  $scope.data.takePhoto = function () {
    var options = {
      quality: 75,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 300,
      targetHeight: 300,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    };

    $cordovaCamera.getPicture(options).then(function (imageData) {
      // $scope.groupData.imgURI = "data:image/jpeg;base64," + imageData;
      $scope.data.imgURI = imageData;
    }, function (err) {
        console.log("error in take photo");
    });
  }

  $scope.data.choosePhoto = function () {
    console.log("choosing photo");
    var options = {
      quality: 75,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 300,
      targetHeight: 300,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    }
    $cordovaCamera.getPicture(options).then(function (imageData) {
      // $scope.groupData.imgURI = "data:image/jpeg;base64," + imageData;
      $scope.data.imgURI = imageData;
    }, function (err) {
      console.log("error has occurred in get picture");
    })
  }

  $scope.data.uploadUpdatedPhoto = function () {
    if($scope.data.imgURI){
      var filename = $scope.data.currentUser.user_id + '_PersonalProfilePic.jpg'
      photoFactory.uploadPersonalProfilePhoto(filename, $scope.data.imgURI);

      $timeout(function () {
        messageFactory.markAccountAsSetUp($scope.data.currentUser.user_id).then(function () {
          $state.go('tabsController.chatPage');
        })
      }, 1000);

    } else {
      $scope.data.errors.push('Please take or choose a new photo!');
    }
  }

  $scope.data.skipPhoto = function () {
    messageFactory.markAccountAsSetUp($scope.data.currentUser.user_id).then(function () {
      $state.go('tabsController.chatPage');
    })
  }
}])

.controller('chatPageCtrl', ['$scope', '$state', '$stateParams', 'messageFactory', 'contactsFactory', '$localStorage', '$ionicPopup', '$rootScope',
function ($scope, $state, $stateParams, messageFactory, contactsFactory, $localStorage, $ionicPopup, $rootScope) {

  console.log($state);
  console.log($state.current);
  $scope.currentUser = messageFactory.getCurrentUser();
  //Send users to log in if there is no user id
  if(!$scope.currentUser.user_id) $state.go('welcomePage');

  if($scope.currentUser.tutorial_1){
    //show the tutorial on true
    $scope.chatTutorial = true;
  } else {
    $scope.chatTutorial = false;
  }

  $scope.chatMessages = messageFactory.getChatMessages();
  $scope.chatUsers = messageFactory.getUserObjects();

  $scope.local_storage = $localStorage;


  //load all contacts for use with other pages in the app //TODO **__** CONTAX
  document.addEventListener("deviceready", onDeviceReady, false);
  function onDeviceReady() {
    contactsFactory.updateContacts();
  }

  //for better user experience, update the group and broadcast messages right when the user lands on chat
  messageFactory.updateGroupMessages();
  messageFactory.updateBroadcastMessages();

  // if($scope.chatMessages.length === 0){
  //TODO Once we have messages stored in a file on your phone turn on this if statement
    messageFactory.updateChatMessages().then(function (res) {
      $scope.chatMessages = messageFactory.getChatMessages();
      $scope.chatUsers = messageFactory.getUserObjects();
      $scope.groups = messageFactory.getChatMessages();
    });
  // }

  $rootScope.chatPageUpdateInterval = setInterval(function () {
    messageFactory.updateChatMessages().then(function (res) {
      $scope.chatMessages = messageFactory.getChatMessages();
      $scope.chatUsers = messageFactory.getUserObjects();
    });
  }, 10000);

  $scope.goToChatWithUser = function(convo){
    $state.go('individualChat', { convo: convo });
  }

  $scope.toSettingsPage = function (){
    $state.go('settingsPage', { context: 'chat'})
  }

  $scope.goToWelcome = function () {
    messageFactory.logout();
    $state.go('welcomePage');
  }

  $scope.createNewChat = function () {
    $state.go('newChatMessage');
  }

  $scope.acceptChatTutorial = function () {
    $scope.chatTutorial = false;
    messageFactory.markTutorialAsRead(1);
  }

}])

.controller('groupsPageCtrl', ['$scope', '$state', '$stateParams', 'messageFactory',
function ($scope, $state, $stateParams, messageFactory) {
  $scope.currentUser = messageFactory.getCurrentUser();
  //Send users to log in if there is no user id
  if(!$scope.currentUser.user_id) $state.go('welcomePage');

  if($scope.currentUser.tutorial_2){
    //show the tutorial on true
    $scope.groupsTutorial = true;
  } else {
    $scope.groupsTutorial = false;
  }

  $scope.groupMessages = messageFactory.getGroupMessages();
  $scope.groupObjects = messageFactory.getGroupObjects();

  // if($scope.groupMessages.length === 0){ //TODO
    messageFactory.updateGroupMessages().then(function (res) {
      $scope.groupMessages = messageFactory.getGroupMessages();
      $scope.groupObjects = messageFactory.getGroupObjects();
    });
  // }

  $scope.groupInvitations = messageFactory.getGroupInvitations();
  console.log("initial group invitations", $scope.groupInvitations);
  messageFactory.updateGroupInvitations().then(function (res) {
    console.log("updated group invitations", res);
    $scope.groupInvitations = res;
  });

  $scope.groupApplications = messageFactory.getGroupApplications();
  messageFactory.updateGroupApplications().then(function (res) {
    console.log(res);
    $scope.groupApplications = res;
  });

  $scope.acceptGroupApplication = function (user_id, group_id) {
    console.log("accepting ", user_id, group_id);
    messageFactory.acceptGroupApplication(user_id, group_id).then(function () {
      messageFactory.updateGroupApplications().then(function (apps) {
        $scope.groupApplications = apps;
        messageFactory.updateGroupMessages().then(function (res) {
          $scope.groupMessages = messageFactory.getGroupMessages();
          $scope.groupObjects = messageFactory.getGroupObjects();
        });
      });
    });
  }
  $scope.declineGroupApplication = function (application_id) {
    console.log("declining ", application_id);
    messageFactory.declineGroupApplication(application_id).then(function () {
      messageFactory.updateGroupApplications().then(function (apps) {
        $scope.groupApplications = apps;
        messageFactory.updateGroupMessages().then(function (res) {
          $scope.groupMessages = messageFactory.getGroupMessages();
          $scope.groupObjects = messageFactory.getGroupObjects();
        });
      });
    });
  }

  $scope.acceptGroupInvitation = function (user_id, group_id) {
    messageFactory.acceptGroupInvitation(user_id, group_id).then(function () {
      messageFactory.updateGroupInvitations().then(function (res) {
        $scope.groupInvitations = res;
        messageFactory.updateGroupMessages().then(function (res) {
          $scope.groupMessages = messageFactory.getGroupMessages();
          $scope.groupObjects = messageFactory.getGroupObjects();
        });
      })
    });
  }

  $scope.declineGroupInvitation = function (invitation_id) {
    messageFactory.declineGroupInvitation(invitation_id).then(function () {
      messageFactory.updateGroupInvitations().then(function (res) {
        console.log("updated group invitations after decline", res);
        $scope.groupInvitations = res;
      })
    })
  }

  $scope.goToGroupMessage = function (group_id) {
    $state.go('groupMessagePage', { group_id: group_id });
  }

  $scope.createNewGroup = function () {
    $state.go('createNewGroup');
  }

  $scope.goToGroupSearchPage = function () {
    $state.go('groupSearch');
  }

  $scope.toSettingsPage = function (){
    $state.go('settingsPage', { context: 'groups'});
  }

  $scope.acceptGroupsTutorial = function () {
    $scope.groupsTutorial = false;
    messageFactory.markTutorialAsRead(2);
  }

  $scope.leaveGroup = function (group_id) {
    console.log("leaving group", group_id);
    messageFactory.leaveGroup(group_id).then(function () {
      messageFactory.updateGroupMessages().then(function (res) {
        $scope.groupMessages = messageFactory.getGroupMessages();
        $scope.groupObjects = messageFactory.getGroupObjects();
      });
    })
  }

}])

.controller('groupSearchCtrl', ['$scope', '$state', '$stateParams', 'messageFactory',
function ($scope, $state, $stateParams, messageFactory) {
  $scope.groupSearchObjects = messageFactory.getSearchGroupObjects();

  messageFactory.updateSearchGroupObjects().then(function (res) {
    $scope.groupSearchObjects = res;
  })

  $scope.backToGroupsPage = function () {
    $state.go('tabsController.groupsPage');
  }

  $scope.goToGroupPage = function (group) {
    $state.go('groupProfilePage', { group: group });
  }

}])

.controller('groupProfileCtrl', ['$scope', '$state', '$stateParams', 'messageFactory',
function ($scope, $state, $stateParams, messageFactory) {

  console.log("group profile controller", $stateParams.group);

  $scope.data = {};
  $scope.data.group = $stateParams.group;
  $scope.data.requestSent = false;

  $scope.joinGroup = function (group_id) {
    messageFactory.joinGroup(group_id).then(function () {
      $state.go('tabsController.groupsPage');
    })
  }

  $scope.requestToJoinGroup = function (group_id) {
    console.log("requesting join group");
    //TODO
    $scope.data.requestSent = true;
    messageFactory.applyToGroup(group_id).then(function (res) {
      console.log(res);
    })
  }

  $scope.backToGroupSearch = function () {
    $state.go('groupSearch');
  }

  $scope.$onDestroy = function () {
    console.log("group profile ctrl destroyed?");
  };

}])

.controller('broadcastsPageCtrl', ['$scope', '$state', '$stateParams', 'messageFactory',
function ($scope, $state, $stateParams, messageFactory) {
  $scope.currentUser = messageFactory.getCurrentUser();
  //Send users to log in if there is no user id
  if(!$scope.currentUser.user_id) $state.go('welcomePage');

  if($scope.currentUser.tutorial_3){
    //show the tutorial on true
    $scope.broadcastTutorial = true;
  } else {
    $scope.broadcastTutorial = false;
  }


  $scope.broadcastMessages = messageFactory.getBroadcastMessages();
  $scope.broadcastObjects = messageFactory.getBroadcastObjects();
  // if($scope.broadcastMessages.length === 0){
    messageFactory.updateBroadcastMessages().then(function (res) {
      $scope.broadcastMessages = messageFactory.getBroadcastMessages();
      $scope.broadcastObjects = messageFactory.getBroadcastObjects();
    });
  // }

  $scope.goToIndividualBroadcast = function (broadcast_id) {
    console.log('go to broadcast' + broadcast_id);
    $state.go('individualBroadcast', { broadcast_id: broadcast_id });
  }

  $scope.backToBroadcastsPage = function (){
    $state.go('tabsController.broadcastsPage');
  }

  $scope.createNewBroadcast = function () {
    $state.go('createNewBroadcast');
  }

  $scope.unsubscribeFromBroadcast = function (broadcast_id) {
    console.log("unsubscribe from ", broadcast_id);
    messageFactory.unsubscribeToBroadcast(broadcast_id).then(function () {
      console.log("unsubscribed from ", broadcast_id);
      messageFactory.updateBroadcastMessages().then(function (res) {
        $scope.broadcastMessages = messageFactory.getBroadcastMessages();
        $scope.broadcastObjects = messageFactory.getBroadcastObjects();
      });
    });
  }

  $scope.goToBroadcastSearchPage = function () {
    console.log("go to broadcast search");
    $state.go('broadcastSearch');
  }

  $scope.toSettingsPage = function (){
    $state.go('settingsPage', { context: 'broadcasts'})
  }

  $scope.goToWelcome = function () {
    messageFactory.logout();
    $state.go('welcomePage');
  }

  $scope.acceptBroadcastTutorial = function () {
    $scope.broadcastTutorial = false;
    messageFactory.markTutorialAsRead(3);
  }

}])

.controller('broadcastSearchCtrl', ['$scope', '$state', '$stateParams', 'messageFactory',
function ($scope, $state, $stateParams, messageFactory){
  $scope.broadcastSearchObjects = messageFactory.getBroadcastSearchObjects();

  messageFactory.updateSearchBroadcastObjects().then(function (res) {
    $scope.broadcastSearchObjects = res;
  })

  $scope.goToBroadcastProfilePage = function (broadcast) {
    console.log(broadcast);
    $state.go('broadcastProfilePage', { broadcast: broadcast });
  }

  $scope.backToBroadcastsPage = function () {
    $state.go('tabsController.broadcastsPage');
  }
}])

.controller('broadcastProfileCtrl', ['$scope', '$state', '$stateParams', 'messageFactory',
function ($scope, $state, $stateParams, messageFactory){
  console.log("b profile ctrl");
  $scope.data = {};
  $scope.data.broadcast = $stateParams.broadcast;

  $scope.subscribeToBroadcast = function (broadcast_id) {
    console.log("subscribe to ", broadcast_id);
    messageFactory.subscribeToBroadcast(broadcast_id).then(function (res) {
      $state.go('tabsController.broadcastsPage');
    })
  }

  $scope.backToBroadcastSearch = function () {
    $state.go('broadcastSearch');
  }
}])

.controller('individualChatCtrl', ['$scope', '$state', '$stateParams', 'messageFactory', '$rootScope',
function ($scope, $state, $stateParams, messageFactory, $rootScope) {

  $scope.currentUser = messageFactory.getCurrentUser();
  $scope.chatMessages = messageFactory.getChatMessages();

  console.log($stateParams.convo);
  for (var i = 0; i < $scope.chatMessages.length; i++) {
    if($scope.chatMessages[i].convoUser.user_id === $stateParams.convo.convoUser.user_id) $scope.convo = $scope.chatMessages[i];
  }

  //when we enter an individual chat, take the chat message ids of that specific
  //user and send the ids in an array in a post request to tell the server they
  //are all read
  var newlyReadMessages = [];
  for (var i = 0; i < $scope.convo.messages.length; i++) {
    if(!$scope.convo.messages[i].read) newlyReadMessages.push($scope.convo.messages[i].message_id);
  }
  messageFactory.markChatMessagesAsRead(newlyReadMessages);


  $rootScope.individualChatUpdateInterval = setInterval(function () {
    messageFactory.updateChatMessages().then(function (res) {
      $scope.chatMessages = messageFactory.getChatMessages();
      $scope.chatUsers = messageFactory.getUserObjects();
    });
  }, 10000);

  $scope.sendChatMessage = function () {
    console.log("controller) sending message to ", $stateParams.convo.convoUser.user_id, $scope.chatMessage);
    messageFactory.sendChatMessage($stateParams.convo.convoUser.user_id, $scope.chatMessage).then(function () {
      $scope.chatMessage = "";
      messageFactory.updateChatMessages().then(function (res) {
        $scope.chatMessages = messageFactory.getChatMessages();
        $scope.chatUsers = messageFactory.getUserObjects();

        for (var i = 0; i < $scope.chatMessages.length; i++) {
          if($scope.chatMessages[i].convoUser.user_id === $stateParams.convo.convoUser.user_id) $scope.convo = $scope.chatMessages[i];
        }
        console.log("updated");
        console.log($scope.chatMessages);
      });
    })
  }

  $scope.addEmoji = function (emoji) {
    console.log("adding emoji", emoji);
    if($scope.chatMessage){
      $scope.chatMessage += emoji;
    } else {
      $scope.chatMessage = "" + emoji;
    }
  }

  $scope.backToChatPage = function (){
    $state.go('tabsController.chatPage');
  }

}])

.controller('individualGroupCtrl', ['$scope', '$state', '$stateParams', 'messageFactory', '$rootScope',
function ($scope, $state, $stateParams, messageFactory, $rootScope) {
  $scope.currentUser = messageFactory.getCurrentUser();
  $scope.group_id = $stateParams.group_id;
  //get group messages
  $scope.groupMessages = messageFactory.getGroupMessages();
  //get group userObjects
  $scope.groupObjects = messageFactory.getGroupObjects();
  //get group objects
  $scope.userObjects = messageFactory.getGroupUserObjects();

  $scope.individualGroupMessages = [];
  for (var i = 0; i < $scope.groupMessages.length; i++) {
    if($scope.groupMessages[i].to_group === $scope.group_id) $scope.individualGroupMessages.push($scope.groupMessages[i]);
  }

  //update the group messages
  //and replace messages and objects
  messageFactory.updateGroupMessages().then(function(){
    $scope.groupMessages = messageFactory.getGroupMessages();
    $scope.groupObjects = messageFactory.getGroupObjects();
    $scope.userObjects = messageFactory.getGroupUserObjects();
  })

  $rootScope.individualGroupUpdateInterval = setInterval(function () {
    messageFactory.updateGroupMessages().then(function(){
      $scope.groupMessages = messageFactory.getGroupMessages();
      $scope.groupObjects = messageFactory.getGroupObjects();
      $scope.userObjects = messageFactory.getGroupUserObjects();

      $scope.individualGroupMessages = [];
      for (var i = 0; i < $scope.groupMessages.length; i++) {
        if($scope.groupMessages[i].to_group === $scope.group_id) $scope.individualGroupMessages.push($scope.groupMessages[i]);
      }
    })
  }, 1000);

  $scope.addEmoji = function (emoji) {
    console.log("adding emoji", emoji);
    // $('#groupInput').focus();
    if($scope.groupMessage){
      $scope.groupMessage += emoji;
    } else {
      $scope.groupMessage = "" + emoji;
    }
  }

  $scope.sendGroupMessage = function () {
    if($scope.groupMessage.length > 0){
      messageFactory.sendGroupMessage($stateParams.group_id, $scope.groupObjects[$scope.group_id].group_name, $scope.groupMessage).then(function () {
        $scope.groupMessage = "";
        messageFactory.updateGroupMessages().then(function(){
          $scope.groupMessages = messageFactory.getGroupMessages();
          $scope.groupObjects = messageFactory.getGroupObjects();
          $scope.userObjects = messageFactory.getGroupUserObjects();
        })
      })
    }
  }

  $scope.backToGroupsPage = function (){
    $state.go('tabsController.groupsPage');
  }

}])

.controller('individualBroadcastCtrl', ['$scope', '$state', '$stateParams', 'messageFactory', '$window', '$timeout', '$cordovaInAppBrowser', '$rootScope',
function ($scope, $state, $stateParams, messageFactory, $window, $timeout, $cordovaInAppBrowser, $rootScope) {
  $scope.currentBroadcast_id = $stateParams.broadcast_id;
  $scope.broadcastObjects = messageFactory.getBroadcastObjects();
  $scope.broadcastObject = $scope.broadcastObjects[$stateParams.broadcast_id];
  $scope.broadcastMessages = messageFactory.getBroadcastMessages();

  //Update on page open
  messageFactory.updateBroadcastMessages().then(function (res) {
    $scope.broadcastObjects = messageFactory.getBroadcastObjects();
    $scope.broadcastObject = $scope.broadcastObjects[$stateParams.broadcast_id];
    $scope.broadcastMessages = messageFactory.getBroadcastMessages();
  });

  //update every ten seconds
  $rootScope.individualBroadcastUpdateInterval = setInterval(function () {
    messageFactory.updateBroadcastMessages().then(function (res) {
      $scope.broadcastObjects = messageFactory.getBroadcastObjects();
      $scope.broadcastObject = $scope.broadcastObjects[$stateParams.broadcast_id];
      $scope.broadcastMessages = messageFactory.getBroadcastMessages();
    });
  }, 10000);

  $scope.backToBroadcastsPage = function (){
    $state.go('tabsController.broadcastsPage');
  }

  $scope.goToLink = function (url) {
    var options = {
        location: 'no',
        clearcache: 'yes',
        toolbar: 'yes'
     };
    // window.open(url, '_blank');

    $cordovaInAppBrowser.open(url, '_blank', options)

      .then(function(event) {
         // success
      })

      .catch(function(event) {
         // error
      });

  }
}])

.controller('settingsCtrl', ['$scope', '$state', '$stateParams', 'messageFactory', '$cordovaCamera', 'photoFactory', '$timeout', '$ionicPush', '$localStorage', '$rootScope',
function ($scope, $state, $stateParams, messageFactory, $cordovaCamera, photoFactory, $timeout, $ionicPush, $localStorage, $rootScope) {
  $scope.data = {};
  $scope.data.currentUser = messageFactory.getCurrentUser();

  $scope.data.messageNotifications = $scope.data.currentUser.message_notifications;
  $scope.data.broadcastNotifications = $scope.data.currentUser.group_notifications;
  $scope.data.groupNotifications= $scope.data.currentUser.broadcast_notifications;

  $scope.updateNotificationSettings = function () {
    messageFactory.updateNotificationSettings($scope.data.messageNotifications, $scope.data.groupNotifications, $scope.data.broadcastNotifications);
  }

  $scope.updateMessageNotificationSettings = function () {
    console.log("update message settings");
    messageFactory.updateMessageNotificationSettings($scope.data.messageNotifications).then(function (res) {
      console.log(res);
    })
  }

  $scope.updateGroupNotificationSettings = function () {
    console.log("update group settings");
    messageFactory.updateGroupNotificationSettings($scope.data.groupNotifications).then(function (res) {
      console.log(res);
    })
  }

  $scope.updateBroadcastNotificationSettings = function () {
    console.log("update broadcast settings");
    messageFactory.updateBroadcastNotificationSettings($scope.data.broadcastNotifications).then(function (res) {
      console.log(res);
    })
  }

  $scope.data.takePhoto = function () {
    var options = {
      quality: 75,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 300,
      targetHeight: 300,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    };

    $cordovaCamera.getPicture(options).then(function (imageData) {
      // $scope.groupData.imgURI = "data:image/jpeg;base64," + imageData;
      $scope.data.imgURI = imageData;
    }, function (err) {
        console.log("error in take photo");
    });
  }

  $scope.data.choosePhoto = function () {
    var options = {
      quality: 75,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 300,
      targetHeight: 300,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    }
    $cordovaCamera.getPicture(options).then(function (imageData) {
      // $scope.groupData.imgURI = "data:image/jpeg;base64," + imageData;
      $scope.data.imgURI = imageData;
    }, function (err) {
      console.log("error has occurred in get picture");
    })
  }

  $scope.data.uploadUpdatedPhoto = function () {
    if(!$scope.data.imgURI) return;

    var filename = $scope.data.currentUser.user_id + '_PersonalProfilePic.jpg'
    photoFactory.uploadPersonalProfilePhoto(filename, $scope.data.imgURI);

    $timeout(function () {
      //TODO fix this bullshit
      messageFactory.logIn($scope.data.currentUser.phone).then(function (res) {
        console.log("in settings ctrl, received res after login");
        console.log(res);
        $scope.data.currentUser = messageFactory.getCurrentUser();
      })
    }, 1000);

  }
  $scope.backToChatPage = function () {
    $state.go('tabsController.chatPage');
  }

  $scope.goToDisciplines = function () {
    $state.go('disciplines', { returnPage: 'settingsPage' });
  }

  $scope.resetTutorials = function () {
    messageFactory.resetTutorials().then(function (res) {
      console.log(res);
    })
  }

  $scope.logout = function () {
    $ionicPush.unregister();
    delete $localStorage.whinny_user;
    clearInterval($rootScope.chatPageUpdateInterval);
    clearInterval($rootScope.individualChatUpdateInterval);
    clearInterval($rootScope.individualGroupUpdateInterval);
    clearInterval($rootScope.individualBroadcastUpdateInterval);
    messageFactory.logout();
    $state.go('welcomePage');
  }

}])


.controller('newChatMessageCtrl', ['$scope', '$state', '$stateParams', 'messageFactory', '$cordovaContacts', 'contactsFactory',
function ($scope, $state, $stateParams, messageFactory, $cordovaContacts, contactsFactory) {

  $scope.data = {};
  $scope.data.newChatRecipient = "";
  $scope.data.contactsHidden = true;

  //Load all contacts into the contacts factory
  $scope.data.contacts = contactsFactory.getContacts();

  $scope.data.chosenPhone;

  $scope.data.errors = [];

  $scope.data.chooseContact = function (name, phone) {
    $scope.data.chosenPhone = phone;
    $scope.data.newChatRecipient = name;
    $scope.data.contactsHidden = true;
  }

  $scope.data.showContacts = function () {
    $scope.data.contactsHidden = false;
  }

  $scope.createNewChatMessage = function () {
    // createNewChatMessage(to_phone, content)
    if(!$scope.data.chosenPhone){
      $scope.data.errors.push('Please enter a valid recipient!');
    } else {
      var i = $scope.data.errors.indexOf('Please enter a valid recipient!');
      if(i != -1) $scope.data.errors.splice(i, 1);
    }
    if(!$scope.chatMessage){
      $scope.data.errors.push('Please enter a message!');
    } else {
      var i = $scope.data.errors.indexOf('Please enter a message!');
      if(i != -1) $scope.data.errors.splice(i, 1);
    }
    if($scope.data.errors.length > 0){
      return;
    }
    var parsedPhone = $scope.data.chosenPhone.replace(/[\s()-]/g, "");
    console.log("parsedPhone");
    console.log(parsedPhone);
    messageFactory.createNewChatMessage(parsedPhone, $scope.chatMessage).then(function (res) {
      messageFactory.updateChatMessages().then(function (convos) {
        console.log("convos");
        console.log(convos);
        console.log("***");
        $scope.chatMessage = "";
        $scope.data.newChatRecipient = "";
        var new_convo;
        for (var i = 0; i < convos.length; i++) {
          console.log(convos[i]);
          if(convos[i].convoUser.user_id === res.data.user_id){
            new_convo = convos[i];
          }
        }
        // $stateParams.convo.convoUser.user_id
        $state.go('individualChat', { convo: new_convo });
      });
    });
  }

  $scope.addEmoji = function (emoji) {
    if($scope.chatMessage){
      $scope.chatMessage += emoji;
    } else {
      $scope.chatMessage = "" + emoji;
    }
  }

  $scope.backToChatPage = function () {
    $state.go('tabsController.chatPage');
  }
}])

.controller('createNewGroupCtrl', ['$scope', '$state', '$stateParams', 'messageFactory', 'contactsFactory', '$cordovaCamera', 'Upload', 'photoFactory', '$timeout',
function ($scope, $state, $stateParams, messageFactory, contactsFactory, $cordovaCamera, Upload, photoFactory, $timeout) {
  console.log("create new group  controller!");

  $scope.groupData = {}; //used to fix scoping issues
  $scope.groupData.errors = [];
  $scope.groupData.contacts = contactsFactory.getContacts();

  //TODO needs to be phone numbers
  //This is the object we send to the server
  $scope.groupData.createGroupInfo = {};
  $scope.groupData.createGroupInfo.invited = [];


  //Hides the button once pressed, replaces with a loading animation
  $scope.hideCreateGroupButton = false;

  //Shows and hides explanations for Public Private and Hidden when creating a group
  $scope.groupData.showExplanations = false;
  $scope.groupData.showGroupPrivacyExplanation = function () {
    $scope.groupData.showExplanations = !$scope.groupData.showExplanations;
  }

  $scope.groupData.inviteToGroup = function (contact_name, contact_phone) {
    var contact = {
      name: contact_name,
      phone: contact_phone
    }
    $scope.groupData.createGroupInfo.invited.push(contact);
    $scope.groupData.memberSearch = "";
  }

  $scope.groupData.removeInvitation = function (contact) {
    var index = $scope.groupData.createGroupInfo.invited.indexOf(contact);
    $scope.groupData.createGroupInfo.invited.splice(index, 1);
  }

  $scope.groupData.takePhoto = function () {
    var options = {
      quality: 75,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 300,
      targetHeight: 300,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    };

    $cordovaCamera.getPicture(options).then(function (imageData) {
      // $scope.groupData.imgURI = "data:image/jpeg;base64," + imageData;
      $scope.groupData.imgURI = imageData;
    }, function (err) {
        console.log("error in take photo");
    });
  }

  $scope.groupData.choosePhoto = function () {
    console.log("choosing photo");
    var options = {
      quality: 75,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 300,
      targetHeight: 300,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    }
    $cordovaCamera.getPicture(options).then(function (imageData) {
      // $scope.groupData.imgURI = "data:image/jpeg;base64," + imageData;
      $scope.groupData.imgURI = imageData;
    }, function (err) {
      console.log("error has occurred in get picture");
    })
  }

  $scope.createGroup = function () {
    console.log($scope.groupData.createGroupInfo);

    $scope.groupData.errors = [];
    if(!$scope.groupData.imgURI) $scope.groupData.errors.push('Please select a group Profile Image');
    if(!$scope.groupData.createGroupInfo.groupName){
      $scope.groupData.errors.push('Please enter a name for your group');
    } else if($scope.groupData.createGroupInfo.groupName.length === 0){
      $scope.groupData.errors.push('Please enter a name for your group');
    }
    if(!$scope.groupData.createGroupInfo.zip){
      $scope.groupData.errors.push('Please enter a zip code for your group');
    } else if($scope.groupData.createGroupInfo.zip.length === 0){
      $scope.groupData.errors.push('Please enter a zip a code for your group');
    }

    if(!$scope.groupData.createGroupInfo.description){
      $scope.groupData.errors.push('Please enter a description for your group');
    } else if($scope.groupData.createGroupInfo.description.length === 0){
      $scope.groupData.errors.push('Please enter a description for your group');
    }
    //TODO what?
    if(!$scope.groupData.createGroupInfo){
      $scope.groupData.errors.push('Please decide if your group will be private, public or hidden');
    }
    if(!$scope.groupData.createGroupInfo.discipline){
      $scope.groupData.errors.push('Please select a discipline for your group');
    }

    if($scope.groupData.errors.length === 0){
      //TODO refactor this
      if($scope.groupData.createGroupInfo.privacyStatus === 'Public'){
        $scope.groupData.createGroupInfo.is_private = false;
        $scope.groupData.createGroupInfo.hidden = false;
      }

      if($scope.groupData.createGroupInfo.privacyStatus === 'Private'){
        $scope.groupData.createGroupInfo.is_private = true;
        $scope.groupData.createGroupInfo.hidden = false;
      }
      if($scope.groupData.createGroupInfo.privacyStatus === 'Hidden'){
        $scope.groupData.createGroupInfo.is_private = false;
        $scope.groupData.createGroupInfo.hidden = true;
      }

      //Create group with placeholder link in profile pic
      messageFactory.createNewGroup($scope.groupData.createGroupInfo).then(function (res) {
        console.log("attempting to upload photo");
        var filename = res.data.group_id + '_GroupProfilePic.jpg'
        console.log("filename: ", filename);
        photoFactory.uploadGroupProfilePhoto(filename, $scope.groupData.imgURI);
        //update group pages
        messageFactory.updateGroupMessages().then(function () {
          $scope.groupData.createGroupInfo.groupName = "";
          $scope.groupData.createGroupInfo.is_private = false;
          $scope.groupData.createGroupInfo.is_public = false;
          $scope.groupData.createGroupInfo.hidden = false;
          $scope.groupData.createGroupInfo.zip = "";
          $scope.groupData.createGroupInfo.description = "";
          $scope.groupData.createGroupInfo.discipline = undefined;
          $scope.groupData.createGroupInfo.invited = [];

          $timeout(function () {
            $state.go('groupMessagePage', { group_id: res.data.group_id });
          }, 1000);
        })
      });
    }

  }

  $scope.backToChatPage = function () {
    $state.go('tabsController.groupsPage');
  }
}])

.controller('createNewBroadcastCtrl', ['$scope', '$state', '$stateParams', 'messageFactory',
function ($scope, $state, $stateParams, messageFactory) {

  console.log("create new broadcast controller!");

  $scope.createGroup = function () {
    console.log("creating new group!");
  }

  $scope.backToBroadcastsPage = function () {
    $state.go('tabsController.broadcastsPage');
  }
}])
