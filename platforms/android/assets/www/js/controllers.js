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
      $scope.pageTitle = 'New Message';
    }
    if(toState.url === '/createNewGroup'){
      $scope.hideGroupIcons = true;
      $scope.showBackToGroups = true;
      $scope.showSettings = false;
      $scope.pageTitle = 'New Group';
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
    if(toState.url === '/groupSearch') $scope.hideNavBar = true;
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
      console.log("token in welcome controlller", t);
      var option = { ignore_user: true };
      return $ionicPush.saveToken(t, option);
    }).then(function (t) {
      $localStorage.token = t; //Store the token in localStorage and retrieve it in
      console.log('token in welcome controlller: ', t);
      for(key in t){
        console.log(key + ": " + t[key]);
      }
    })

  })

  //handle auto log in
  if($localStorage.whinny_user){
    if($localStorage.whinny_user.verified){
      messageFactory.versionCheck().then(function (res) {
        if(res.deprecatedClient){
          alert("Your Whinny app is now out of date! Please download the new version!");
          $scope.data.errors.push("Please download the new version of Whinny");
        } else {
          //Set the current whinny_user to the user object stored in localStorage and go to the chat page.
          messageFactory.setCurrentUser($localStorage.whinny_user);

          if($localStorage.token){

            if($localStorage.whinny_user.device_token != $localStorage.token.token){
              //also updates the current user object
              messageFactory.updateDeviceToken($localStorage.token.token).then(function (res) {
                console.log("should be user data");
                console.log(res);
                $state.go('tabsController.chatPage');
              })
            } else {
              $state.go('tabsController.chatPage');
            }

          } else {
            $state.go('tabsController.chatPage');
          }
        }
      })
    }
  }

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

.controller('newUserCreationCtrl', ['$scope', '$state', '$stateParams', 'messageFactory', '$localStorage',
function ($scope, $state, $stateParams, messageFactory, $localStorage) {
  $scope.data = {};
  $scope.data.errors = [];

  $scope.data.device_token = $localStorage.tokenObject.token;

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

  $scope.data = {};
  $scope.data.errors = [];

  $scope.showConfirmForm = true;

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
      $scope.showForm = false;
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
          $scope.data.errors.push('Hmmm, looks like the code you submitted was incorrect. Try to send it again.');
          $scope.showConfirmForm = true;
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

.controller('chatPageCtrl', ['$scope', '$state', '$stateParams', 'messageFactory', 'contactsFactory', '$localStorage', '$ionicPopup', '$rootScope', '$timeout',
function ($scope, $state, $stateParams, messageFactory, contactsFactory, $localStorage, $ionicPopup, $rootScope, $timeout) {

  $scope.currentUser = messageFactory.getCurrentUser();
  //Send users to log in if there is no user id
  if(!$scope.currentUser.user_id) $state.go('welcomePage');

  document.addEventListener("deviceready", onDeviceReady, false);
  function onDeviceReady() {
    contactsFactory.updateContacts();
    messageFactory.updateGroupData();
    messageFactory.updateBroadcastData();
    messageFactory.updateChatMessages();

    $timeout(function () {
      //TODO fix this?
      $scope.chatMessages = messageFactory.getChatMessages();
    }, 1000)
  }

  //TODO remove later
  contactsFactory.updateContacts();
  messageFactory.updateGroupData();
  messageFactory.updateBroadcastData();
  messageFactory.updateChatMessages();

  $timeout(function () {
    //TODO fix this?
    $scope.chatMessages = messageFactory.getChatMessages();
  }, 1000)

  if($scope.currentUser.tutorial_1){
    //show the tutorial on true
    $scope.chatTutorial = true;
  } else {
    $scope.chatTutorial = false;
  }

  $scope.acceptChatTutorial = function () {
    $scope.chatTutorial = false;
    messageFactory.markTutorialAsRead(1);
  }

  $scope.chatMessages = messageFactory.getChatMessages();

  $scope.local_storage = $localStorage;

  $rootScope.chatPageUpdateInterval = setInterval(function () {
    messageFactory.updateChatMessages().then(function (res) {
      $scope.chatMessages = messageFactory.getChatMessages();
      console.log($scope.chatMessages);
    });
  }, 20000);

  $scope.$on('$ionicView.leave', function() {
    clearInterval($rootScope.chatPageUpdateInterval);
  });

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

  $scope.acceptGroupsTutorial = function () {
    $scope.groupsTutorial = false;
    messageFactory.markTutorialAsRead(2);
  }

  messageFactory.updateGroupData().then(function (res) {
    $scope.groupData = res;
  });

  $scope.groupInvitations = messageFactory.getGroupInvitations();
  messageFactory.updateGroupInvitations().then(function (res) {
    $scope.groupInvitations = res;
  });

  $scope.groupApplications = messageFactory.getGroupApplications();
  messageFactory.updateGroupApplications().then(function (res) {
    $scope.groupApplications = res;
  });

  $scope.viewGroup = function (group_id) {
    for (var i = 0; i < $scope.groupData.invitedGroupObjects.length; i++) {
      if($scope.groupData.invitedGroupObjects[i].group_id === group_id){
        $state.go('groupProfilePage', { group: $scope.groupData.invitedGroupObjects[i], returnPage: 'groupsPage'});
      }
    }
  }

  $scope.acceptGroupApplication = function (user_id, group_id) {
    messageFactory.acceptGroupApplication(user_id, group_id).then(function () {
      messageFactory.updateGroupApplications().then(function (apps) {
        $scope.groupApplications = apps;
        messageFactory.updateGroupData().then(function (res) {
          $scope.groupData = res;
        });
      });
    });
  }
  $scope.declineGroupApplication = function (application_id) {
    messageFactory.declineGroupApplication(application_id).then(function () {
      messageFactory.updateGroupApplications().then(function (apps) {
        $scope.groupApplications = apps;
        messageFactory.updateGroupData().then(function (res) {
          $scope.groupData = res;
        });
      });
    });
  }

  $scope.acceptGroupInvitation = function (user_id, group_id) {
    messageFactory.acceptGroupInvitation(user_id, group_id).then(function () {
      messageFactory.updateGroupInvitations().then(function (res) {
        $scope.groupInvitations = res;
        messageFactory.updateGroupData().then(function (res) {
          $scope.groupData = res;
        });
      })
    });
  }

  $scope.declineGroupInvitation = function (invitation_id) {
    messageFactory.declineGroupInvitation(invitation_id).then(function () {
      messageFactory.updateGroupInvitations().then(function (res) {
        $scope.groupInvitations = res;
      })
    })
  }

  $scope.leaveGroup = function (group_id) {
    messageFactory.leaveGroup(group_id).then(function () {
      messageFactory.updateGroupData().then(function (res) {
        $scope.groupData = res;
      });
    })
  }

  $scope.goToGroupMessage = function (group_id) {
    console.log(group_id);
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
    $state.go('groupProfilePage', { group: group,  returnPage: 'groupSearch' });
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
    console.log($stateParams);
    if($stateParams.returnPage == 'groupsPage'){
      $state.go('tabsController.groupsPage');
    } else if($stateParams.returnPage == 'groupSearch'){
      $state.go('groupSearch');
    }
  }

  $scope.$onDestroy = function () {
    console.log("group profile ctrl destroyed?");
  };

}])

.controller('groupInfoCtrl', ['$scope', '$state', '$stateParams', 'messageFactory', 'contactsFactory', '$ionicPopup', '$cordovaCamera', 'photoFactory', '$timeout',
function ($scope, $state, $stateParams, messageFactory, contactsFactory, $ionicPopup, $cordovaCamera, photoFactory, $timeout) {

  $scope.admin = false;
  $scope.owner = false;
  $scope.group_id = $stateParams.group_id;
  $scope.currentUser = messageFactory.getCurrentUser();

  $scope.displayAccountSetupMessage = false;

  messageFactory.getGroupMembers($stateParams.group_id).then(function (res) {
    $scope.groupMembers = res;

    //look through the user objects and check to see if you're an admin for this specific group
    for (var i = 0; i < $scope.groupMembers.length; i++) {
      if($scope.groupMembers[i].user_id === $scope.currentUser.user_id){
        if($scope.groupMembers[i].admin) $scope.admin = true;
        if($scope.groupMembers[i].owner) $scope.owner = true;
      }
    }
  })

  $scope.groupData = messageFactory.getGroupData();

  for (var i = 0; i < $scope.groupData.groupObjects.length; i++) {
    if($scope.groupData.groupObjects[i].group_id === $scope.group_id){
      $scope.group = $scope.groupData.groupObjects[i];
    }
  }
  // $scope.groupObjects = messageFactory.getGroupObjects();
  // $scope.userObjects = messageFactory.getGroupUserObjects();

  $scope.data = {};
  $scope.data.newChatRecipient = "";
  $scope.data.contactsHidden = false;
  $scope.data.invited = [];

  //Load all contacts into the contacts factory
  $scope.data.contacts = contactsFactory.getContacts();

  $scope.data.chosenContact = {};

  $scope.data.errors = [];

  $scope.editGroupName = function () {
    console.log("edit group name");
    $ionicPopup.prompt({
      title: 'Edit Group Name',
      inputType: 'text',
      inputPlaceholder: 'New Group Name',
      okType: 'button-tangerine'
    }).then(function(res) {
      if(res){
        if(res.length > 0){
          //Sets the current version in scope to the new name
          $scope.groupObjects[$scope.group_id].group_name = res;
          //Sets the current version on the server
          messageFactory.updateGroupName($scope.group_id, res).then(function (res) {
            messageFactory.updateGroupData().then(function () {
            })
          })
        }
      }
    });
  }

  $scope.editGroupDescription = function () {
    console.log("edit group description");
    $ionicPopup.prompt({
      title: 'Edit Group Description',
      inputType: 'text',
      inputPlaceholder: 'New Group Description ',
      okType: 'button-tangerine'
    }).then(function(res) {
      if(res){
        if(res.length > 0){
          //Sets the current version in scope to the new name
          $scope.groupObjects[$scope.group_id].description = res;
          //Sets the current version on the server
          messageFactory.updateGroupDescription($scope.group_id, res).then(function (res) {
            messageFactory.updateGroupData().then(function () {
            })
          })
        }
      }
    });
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
      $scope.imgURI = imageData;

      var filename = $scope.group_id + '_GroupProfilePic.jpg'
      photoFactory.uploadGroupProfilePhoto(filename, $scope.imgURI);

      $timeout(function () {
        console.log("updating scope");
        $scope.$apply();
      }, 500);

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
      $scope.imgURI = imageData;

      var filename = $scope.group_id + '_GroupProfilePic.jpg'
      photoFactory.uploadGroupProfilePhoto(filename, $scope.imgURI);

      $timeout(function () {
        console.log("updating scope");
        $scope.$apply();
      }, 500);

    }, function (err) {
      console.log("error has occurred in get picture");
    })
  }

  $scope.removeUserFromGroup = function (group_id, user_id, first_name, last_name, group_name) {
    console.log("remove " + user_id + " from group " + group_id);
    var confirmPopup = $ionicPopup.confirm({
     title: 'Are you sure you want to remove ' + first_name + " " + last_name + ' from ' + group_name + "?",
     cancelText: 'Don\'t Remove', // String (default: 'Cancel'). The text of the Cancel button.
     okText: 'Remove', // String (default: 'OK'). The text of the OK button.
     okType: 'button-tangerine', // String (default: 'button-positive'). The type of the OK button.
    });

    confirmPopup.then(function(res) {
      if(res) {
        messageFactory.removeUserFromGroup(group_id, user_id).then(function () {
          messageFactory.getGroupMembers($stateParams.group_id).then(function (res) {
            $scope.groupMembers = res;

            for (var i = 0; i < $scope.groupMembers.length; i++) {
              if($scope.groupMembers[i].user_id === $scope.currentUser.user_id){
                if($scope.groupMembers[i].admin){
                  $scope.admin = true;
                  console.log("admin");
                }
              }
            }
          })
        })
      } else {
       console.log('Not removing from');
      }
    });
  }

  $scope.makeUserAdmin = function (group_id, user_id, first_name, last_name) {

    var confirmPopup = $ionicPopup.confirm({
     title: 'Are you sure you want to make ' + first_name + ' ' + last_name + ' an admin? Only the group owner can remove admin privleges once you grant them.',
     cancelText: 'Don\'t Make Admin', // String (default: 'Cancel'). The text of the Cancel button.
     okText: 'Make Admin', // String (default: 'OK'). The text of the OK button.
     okType: 'button-tangerine', // String (default: 'button-positive'). The type of the OK button.
    });

    confirmPopup.then(function(res) {
      if(res) {
        console.log("Make " + user_id + " an admin for group " + group_id);
        messageFactory.makeUserAdmin(group_id, user_id).then(function () {
          messageFactory.getGroupMembers($stateParams.group_id).then(function (res) {
           $scope.groupMembers = res;

            for (var i = 0; i < $scope.groupMembers.length; i++) {
              if($scope.groupMembers[i].user_id === $scope.currentUser.user_id){
                if($scope.groupMembers[i].admin){
                  $scope.admin = true;
                }
              }
            }
          })
        });
      }
    });
  }

  $scope.removeUserAdmin = function (group_id, user_id, first_name, last_name) {
    if($scope.owner){

      var confirmPopup = $ionicPopup.confirm({
        title: 'Are you sure you want to remove admin priveledges from ' + first_name + ' ' + last_name + '?',
        cancelText: 'Don\'t Remove Admin', // String (default: 'Cancel'). The text of the Cancel button.
        okText: 'Remove Admin', // String (default: 'OK'). The text of the OK button.
        okType: 'button-tangerine', // String (default: 'button-positive'). The type of the OK button.
      });

      confirmPopup.then(function(res) {
        if(res) {
          console.log("Remove " + user_id + " as an admin for group " + group_id);
          messageFactory.removeUserAdmin(group_id, user_id).then(function () {
            messageFactory.getGroupMembers($stateParams.group_id).then(function (res) {
              $scope.groupMembers = res;

              for (var i = 0; i < $scope.groupMembers.length; i++) {
                if($scope.groupMembers[i].user_id === $scope.currentUser.user_id){
                  if($scope.groupMembers[i].admin){
                    $scope.admin = true;
                  }
                }
              }
            })
          });
        }
      });
    }
  }

  $scope.newPersonalMessage = function (member) {
    if(member.user_id !== $scope.currentUser.user_id){
      $state.go('newChatMessage', { groupMember: member, returnPage: $stateParams.group_id });
    }
  }

  $scope.data.showContacts = function () {
    $scope.data.contactsHidden = false;
  }

  $scope.data.inviteToGroup = function (contact_name, contact_phone) {
    var contact = {
      name: contact_name,
      phone: contact_phone
    }
    $scope.data.invited.push(contact);
    $scope.data.memberSearch = "";
  }

  $scope.data.removeInvitation = function (contact) {
    var index = $scope.data.invited.indexOf(contact);
    $scope.data.invited.splice(index, 1);
  }

  $scope.data.sendInvitations = function () {
    if($scope.data.invited.length > 0){
      var parsedinvitations = [];
      for (var i = 0; i < $scope.data.invited.length; i++) {
        $scope.data.invited[i].phone = $scope.data.invited[i].phone.replace(/[^\d]/g, '');
        if($scope.data.invited[i].phone[0] === '1'){
          $scope.data.invited[i].phone = $scope.data.invited[i].phone.substring(1);
        }
      }
      console.log($scope.data.invited);
      messageFactory.sendInvitations($scope.group_id, $scope.data.invited, $scope.currentUser.user_id).then(function () {
        $scope.data.invited = [];
      })
    }
  }

  $scope.leaveGroup = function (group_name) {
    console.log("leaving group", $stateParams.group_id);

    var confirmPopup = $ionicPopup.confirm({
     title: 'Are you sure you want to leave ' + group_name + '?',
     cancelText: 'Don\'t Leave', // String (default: 'Cancel'). The text of the Cancel button.
     okText: 'Leave', // String (default: 'OK'). The text of the OK button.
     okType: 'button-tangerine', // String (default: 'button-positive'). The type of the OK button.
    });

    confirmPopup.then(function(res) {
     if(res) {
       console.log("leaving group");
       messageFactory.leaveGroup($stateParams.group_id).then(function () {
         $state.go('tabsController.groupsPage');
       })
     } else {
       console.log('Not Leaving');
     }
    });

  }

  $scope.deleteGroup = function (group_id, group_name) {
    var confirmPopup = $ionicPopup.confirm({
     title: 'Are you sure you want to DELETE ' + group_name + '?',
     template: 'WARNING! This action can not be undone. All group messages will be deleted FOREVER.',
     cancelText: 'Don\'t Delete', // String (default: 'Cancel'). The text of the Cancel button.
     okText: 'DELETE IT', // String (default: 'OK'). The text of the OK button.
     okType: 'button-tangerine', // String (default: 'button-positive'). The type of the OK button.
    });

    confirmPopup.then(function(res) {
     if(res) {
       console.log("Deleting group");
       messageFactory.deleteGroup($stateParams.group_id).then(function () {
         $state.go('tabsController.groupsPage');
       })
     } else {
       console.log('Not Deleting');
     }
    });
  }

  $scope.data.emailMessagePrintout = function (group_name) {
    console.log("printout");
    if(!$scope.currentUser.account_is_setup){
      $scope.displayAccountSetupMessage = true;
      return;
    }

    var confirmPopup = $ionicPopup.confirm({
     title: 'Are you sure you want to email a log of all messages in ' + group_name + '?',
     template: 'Important: A printable log will be emailed to the email address associated with your Whinny account.',
     cancelText: 'Cancel', // String (default: 'Cancel'). The text of the Cancel button.
     okText: 'Email Log', // String (default: 'OK'). The text of the OK button.
     okType: 'button-tangerine', // String (default: 'button-positive'). The type of the OK button.
    });

    confirmPopup.then(function(res) {
     if(res) {
       console.log("email message log for group" + group_name);
       messageFactory.printGroupContent($stateParams.group_id, group_name).then(function () {

         var printSuccessfulAlert = $ionicPopup.alert({
           title: 'Success',
           template: 'A message log for this group has been created and sent to your Whinny email address.',
         })

         printSuccessfulAlert.then(function (res) {
           if(res){
             console.log("clearing alert?");
           }
         })
       })
     } else {
       console.log('Not emailing');
     }
    });
  }

  $scope.data.backToGroupPage = function () {
    //return to the group messages page from whence you came
    $state.go('groupMessagePage', { group_id: $stateParams.group_id });
  }

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

  //TODO local storage all the chat data? Refresh on only pushes?

  messageFactory.updateBroadcastData().then(function (res) {
    $scope.broadcastData = res;
  });

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
      messageFactory.updateBroadcastData().then(function (res) {
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

.controller('individualChatCtrl', ['$scope', '$state', '$stateParams', 'messageFactory', '$rootScope', '$cordovaCamera', 'photoFactory', '$timeout', '$ionicPopup', '$ionicModal', '$ionicScrollDelegate', '$ionicActionSheet',
function ($scope, $state, $stateParams, messageFactory, $rootScope, $cordovaCamera, photoFactory, $timeout , $ionicPopup, $ionicModal, $ionicScrollDelegate, $ionicActionSheet) {

  $scope.data = {};

  $scope.currentUser = messageFactory.getCurrentUser();
  $scope.chatMessages = messageFactory.getChatMessages();

  $scope.hideInput = false;
  $scope.data.imgURI = '';

  for (var i = 0; i < $scope.chatMessages.length; i++) {
    if($scope.chatMessages[i].convoUser.user_id === $stateParams.convo.convoUser.user_id) $scope.convo = $scope.chatMessages[i];
  }
  $timeout(function () {
    console.log("scroll to bottom");
    $ionicScrollDelegate.$getByHandle('data.individualChatScroll').scrollBottom(true);
  }, 100);

  //when we enter an individual chat, take the chat message ids of that specific
  //user and send the ids in an array in a post request to tell the server they
  //are all read
  var newlyReadMessages = [];
  for (var i = 0; i < $scope.convo.messages.length; i++) {
    //If the message is unread and it wasn't sent by the current user, mark it as read
    if(!$scope.convo.messages[i].read && $scope.convo.messages[i].from_user !== $scope.currentUser.user_id) newlyReadMessages.push($scope.convo.messages[i].message_id);
  }
  messageFactory.markChatMessagesAsRead(newlyReadMessages).then(function () {
    var emitObject = {
      messagesRead: newlyReadMessages,
      source: 'chat'
    }
    $rootScope.$emit('readMessages', emitObject);
  })

  $rootScope.individualChatUpdateInterval = setInterval(function () {
    messageFactory.updateChatMessages().then(function (res) {
      $scope.chatMessages = messageFactory.getChatMessages();
      $scope.chatUsers = messageFactory.getUserObjects();
      $timeout(function () {
        $ionicScrollDelegate.$getByHandle('data.individualChatScroll').scrollBottom(true);
      }, 100);
    });
  }, 10000);

  $scope.$on('$ionicView.leave', function() {
    console.log("LEFFFT individual chat. Canceling update interval");
    clearInterval($rootScope.individualChatUpdateInterval);
  });

  $scope.addPhoto = function () {

    var hideSheet = $ionicActionSheet.show({
      buttons: [
        { text: 'Camera' },
        { text: 'Gallery' }
      ],
      cancelText: 'Cancel',
      cancel: function() {

      },
      buttonClicked: function(index) {
        switch(index){
        case 0:
          $scope.takePhoto();
          return true;
        case 1:
          $scope.choosePhoto();
          return true;
        }
      }
    });
  }

  $scope.takePhoto = function () {

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
      $scope.data.imgURI = imageData;
      $scope.hideInput = true;
    })
  }

  $scope.choosePhoto = function () {

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
      $scope.data.imgURI = imageData;
      $scope.hideInput = true;
    }, function (err) {
      console.log("error has occurred in get picture");
    })
  }

  $scope.clearStagedPhoto = function () {
    $scope.data.imgURI = '';
    $scope.hideInput = false;
  }

  $scope.addEmoji = function (emoji) {

    console.log("adding emoji", emoji);
    var imgEmoji = emoji.substring(1, emoji.length - 1);

    document.getElementById("chatboxDiv").innerHTML += '<img class="emoji" src="img/emoji/'+imgEmoji+'.png"></img>';
    document.getElementById("chatboxDiv").innerHTML = document.getElementById("chatboxDiv").innerHTML.replace(new RegExp('<br>', 'g'), '');
    placeCaretAtEnd( document.getElementById("chatboxDiv") );

  }

  $scope.sendChatMessage = function () {
    console.log("sending message");
    if($scope.data.imgURI.length > 1){

      var filename = $scope.currentUser.user_id + '_chatMessage_'+ Date.now() + '.jpg';
      photoFactory.uploadChatPhoto(filename, $scope.data.imgURI);

      var photoMessage = 'https://s3.amazonaws.com/whinnyphotos/chat_images/' + filename;
      messageFactory.sendChatImage($stateParams.convo.convoUser.user_id, photoMessage).then(function () {
        //insert into the convo? TODO

        messageFactory.updateChatMessages().then(function (res) {
          $scope.chatMessages = messageFactory.getChatMessages();
          $scope.chatUsers = messageFactory.getUserObjects();

          for (var i = 0; i < $scope.chatMessages.length; i++) {
            if($scope.chatMessages[i].convoUser.user_id === $stateParams.convo.convoUser.user_id) $scope.convo = $scope.chatMessages[i];
          }

          $scope.hideInput = false;
          $scope.data.imgURI = '';

          $timeout(function () {
            var delegate = $ionicScrollDelegate.$getByHandle('data.individualChatScroll').scrollBottom(true);
            console.log(delegate);
          }, 100);

        });
      })

    } else {
      if(document.getElementById("chatboxDiv").innerHTML){

        if (window.cordova && window.cordova.plugins) cordova.plugins.Keyboard.close();

        var chatMessageEncoded = document.getElementById("chatboxDiv").innerHTML;
        var emojiIds = [ 'HappyFace','LayingHorse','AngryFace','BuckingHorse','Pony','ArabianHorse','JumpingHorse','BarrelHorse','TrailHorse','ReiningHorse','PoloPony','RacingHorses','MareAndFoal','HunterHorse','GrazingHorse','DrivingHorse','DressageHorse','EventingHorse','PaddockHorse','Ribbon','LegBandages','VetSymbol','Blanket','Brush','HoofPick','EnglishSaddle','WesternSaddle','Bucket','Wheelbarrow','Pitchfork','Corgi','Fly','GolfCart', 'JackRussell', 'Tractor', 'Harrow', 'HayBale', 'Trailer', 'HorseShoe', 'Carrot'];

        var chatMessageDecoded; 
        var emojiIdsLength = emojiIds.length;
        for (var i = 0; i < emojiIdsLength; i++){
           chatMessageDecoded = chatMessageEncoded.replace(new RegExp('<img class="emoji" src="img/emoji/' + emojiIds[i] + '.png"></img>', 'g'), ":" + emojiIds[i] + ":");
        }

        console.log("controller) sending message to ", $stateParams.convo.convoUser.user_id, chatMessageDecoded);
        messageFactory.sendChatMessage($stateParams.convo.convoUser.user_id, chatMessageDecoded).then(function () {

          document.getElementById("chatboxDiv").innerHTML = "";

          messageFactory.updateChatMessages().then(function (res) {
            $scope.chatMessages = messageFactory.getChatMessages();
            $scope.chatUsers = messageFactory.getUserObjects();

            for (var i = 0; i < $scope.chatMessages.length; i++) {
              if($scope.chatMessages[i].convoUser.user_id === $stateParams.convo.convoUser.user_id) $scope.convo = $scope.chatMessages[i];
            }
            console.log("updated");
            console.log($scope.chatMessages);

            $timeout(function () {
              var delegate = $ionicScrollDelegate.$getByHandle('data.individualChatScroll').scrollBottom(true);
              console.log(delegate);
            }, 100);

          });
        })
      }
    }
  }

  $scope.data.showModal = function (imageSource) {
    $scope.imageUrl = imageSource;
    $ionicModal.fromTemplateUrl('templates/broadcastZoomView.html', {
      scope: $scope,
      animation: 'scale-in'
    }).then(function (modal) {
      $scope.modal = modal;
      $scope.modal.show();
    })
  }

  $scope.closeModal = function () {
    $scope.modal.remove();
  }

  $scope.backToChatPage = function (){
    $state.go('tabsController.chatPage');
  }

  function placeCaretAtEnd(el) {
    el.focus();
    if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
      console.log("the defined top");
      var range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    } else if (typeof document.body.createTextRange != "undefined") {
      console.log("the undefined bottom");
      var textRange = document.body.createTextRange();
      textRange.moveToElementText(el);
      textRange.collapse(false);
      textRange.select();
    }
  }

}])

.controller('individualGroupCtrl', ['$scope', '$state', '$stateParams', 'messageFactory', '$rootScope', '$cordovaCamera', 'photoFactory', '$ionicPopup', '$ionicModal', '$timeout', '$ionicScrollDelegate', '$ionicActionSheet',
function ($scope, $state, $stateParams, messageFactory, $rootScope, $cordovaCamera, photoFactory, $ionicPopup, $ionicModal, $timeout, $ionicScrollDelegate, $ionicActionSheet) {

  $scope.data = {};

  $scope.currentUser = messageFactory.getCurrentUser();
  $scope.group_id = $stateParams.group_id;
  $scope.groupData = messageFactory.getGroupData();

  $scope.hideInput = false;
  $scope.data.imgURI = '';


  for (var i = 0; i < $scope.groupData.groupObjects.length; i++) {
    //Set the current group to match the one in the passed in group id
    if($scope.groupData.groupObjects[i].group_id === $scope.group_id) $scope.currentGroup = $scope.groupData.groupObjects[i];
  }

  var messagesRead = [];
  for (var i = 0; i < $scope.groupData.unread.length; i++) {
    if(!$scope.groupData.unread[i].read && $scope.groupData.unread[i].group_id === $scope.group_id){
      messagesRead.push($scope.groupData.unread[i].group_message_read_id);
    }
  }

  $timeout(function () {
    $ionicScrollDelegate.$getByHandle('data.individualGroupScroll').scrollBottom(false);
  }, 100);

  messageFactory.markGroupMessagesAsRead(messagesRead).then(function () {
    messageFactory.updateGroupData().then(function(res){
      $scope.groupData = res;

      //Tell the tab controller you read messages to decrement the badges on tabs
      var emitObj = {
        messagesRead: messagesRead,
        source: 'groups'
      }
      $rootScope.$emit('readMessages', emitObj);
    })
  })

  $rootScope.individualGroupUpdateInterval = setInterval(function () {
    messageFactory.updateGroupData().then(function(res){
      $scope.groupData = res;
    })
  }, 10000);

  $scope.$on('$ionicView.leave', function() {
    console.log("LEFFFT Group chat. Canceling update interval");
    clearInterval($rootScope.individualGroupUpdateInterval);
  });

  $scope.addPhoto = function () {

    var hideSheet = $ionicActionSheet.show({
     buttons: [
       { text: 'Camera' },
       { text: 'Gallery' }
     ],
     cancelText: 'Cancel',
     cancel: function() {
          // add cancel code..
        },
     buttonClicked: function(index) {
       switch(index){
        case 0:
          $scope.takePhoto();
          return true;
        case 1:
          $scope.choosePhoto();
          return true;
       }
     }
   });
  }

  $scope.takePhoto = function () {

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
      $scope.data.imgURI = imageData;
      $scope.hideInput = true;
    })
  }

  $scope.choosePhoto = function () {

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
      $scope.data.imgURI = imageData;
      $scope.hideInput = true;
    }, function (err) {
      console.log("error has occurred in get picture");
    })
  }

  $scope.clearStagedPhoto = function () {
    $scope.data.imgURI = '';
    $scope.hideInput = false;
  }

  $scope.addEmoji = function (emoji) {

    console.log("adding emoji", emoji);
    var imgEmoji = emoji.substring(1, emoji.length - 1);

    document.getElementById("groupChatboxDiv").innerHTML += '<img class="emoji" src="img/emoji/'+imgEmoji+'.png"></img>';
    document.getElementById("groupChatboxDiv").innerHTML = document.getElementById("groupChatboxDiv").innerHTML.replace(new RegExp('<br>', 'g'), '');
    placeCaretAtEnd( document.getElementById("groupChatboxDiv") );

  }

  $scope.sendGroupMessage = function () {
    if($scope.data.imgURI.length > 1){
      //create the filename using time stamp
      var filename = $scope.currentUser.user_id + '_groupChatMessage_'+ Date.now() + '.jpg';
      //upload the photo to s3
      photoFactory.uploadGroupChatPhoto(filename, $scope.data.imgURI);

      //sends message with img:true, content: ':img linktoS3'
      //send image
      var photoMessage = 'https://s3.amazonaws.com/whinnyphotos/group_chat_images/' + filename;
      messageFactory.sendGroupImage($scope.group_id, $scope.currentGroup.group_name, photoMessage).then(function () {
        //insert into the convo? TODO

        messageFactory.updateChatMessages().then(function (res) {

          messageFactory.updateGroupData().then(function(res){
            $scope.groupData = res;
          })

          $scope.hideInput = false;
          $scope.data.imgURI = '';

          $timeout(function () {
            $ionicScrollDelegate.$getByHandle('data.individualGroupScroll').scrollBottom(false);
          }, 100);

        });
      })

    } else {
      if(document.getElementById("groupChatboxDiv").innerHTML){

        if (window.cordova && window.cordova.plugins) cordova.plugins.Keyboard.close();

        var groupChatMessageEncoded = document.getElementById("groupChatboxDiv").innerHTML;

        var emojiIds = [ 'HappyFace','LayingHorse','AngryFace','BuckingHorse','Pony','ArabianHorse','JumpingHorse','BarrelHorse','TrailHorse','ReiningHorse','PoloPony','RacingHorses','MareAndFoal','HunterHorse','GrazingHorse','DrivingHorse','DressageHorse','EventingHorse','PaddockHorse','Ribbon','LegBandages','VetSymbol','Blanket','Brush','HoofPick','EnglishSaddle','WesternSaddle','Bucket','Wheelbarrow','Pitchfork','Corgi','Fly','GolfCart', 'JackRussell', 'Tractor', 'Harrow', 'HayBale', 'Trailer', 'HorseShoe', 'Carrot'];

        var groupChatMessageDencoded; 
        var emojiIdsLength = emojiIds.length;
        for (var i = 0; i < emojiIdsLength; i++){
           groupChatMessageDencoded = groupChatMessageEncoded.replace(new RegExp('<img class="emoji" src="img/emoji/' + emojiIds[i] + '.png"></img>', 'g'), ":" + emojiIds[i] + ":");
        }

        messageFactory.sendGroupMessage($stateParams.group_id, $scope.currentGroup.group_name, groupChatMessageDencoded).then(function () {
          document.getElementById("groupChatboxDiv").innerHTML = "";
          messageFactory.updateGroupData().then(function(){
            $scope.groupData = messageFactory.getGroupData();
            $timeout(function () {
              $ionicScrollDelegate.$getByHandle('data.individualGroupScroll').scrollBottom(false);
            }, 100);
          })
        })
      }
    }
  }

  $scope.data.showModal = function (imageSource) {
    $scope.imageUrl = imageSource;
    $ionicModal.fromTemplateUrl('templates/broadcastZoomView.html', {
      scope: $scope,
      animation: 'scale-in'
    }).then(function (modal) {
      $scope.modal = modal;
      $scope.modal.show();
    })
  }

  $scope.closeModal = function () {
    $scope.modal.remove();
  }

  $scope.goToGroupInfo = function () {
    $state.go('groupInfo', { group_id: $stateParams.group_id });
  }

  $scope.backToGroupsPage = function (){
    $state.go('tabsController.groupsPage');
  }

  function placeCaretAtEnd(el) {
    el.focus();
    if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
      var range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    } else if (typeof document.body.createTextRange != "undefined") {
      var textRange = document.body.createTextRange();
      textRange.moveToElementText(el);
      textRange.collapse(false);
      textRange.select();
    }
  }

}])

.controller('individualBroadcastCtrl', ['$scope', '$state', '$stateParams', 'messageFactory', '$window', '$timeout', '$cordovaInAppBrowser', '$rootScope', '$ionicModal',
function ($scope, $state, $stateParams, messageFactory, $window, $timeout, $cordovaInAppBrowser, $rootScope, $ionicModal) {
  $scope.currentBroadcast_id = $stateParams.broadcast_id;


  $scope.broadcastData = messageFactory.getBroadcastData();

  for (var i = 0; i < $scope.broadcastData.broadcasts.length; i++) {
    if($scope.broadcastData.broadcasts[i].broadcast_id === $stateParams.broadcast_id) $scope.currentBroadcast = $scope.broadcastData.broadcasts[i];
  }

  $scope.currentBroadcastMessages = $scope.broadcastData.messages;

  //Update on page open
  messageFactory.updateBroadcastData().then(function (res) {
    $scope.broadcastData = messageFactory.getBroadcastData();
  });

  //update every ten seconds
  $rootScope.individualBroadcastUpdateInterval = setInterval(function () {
    messageFactory.updateBroadcastData().then(function (res) {
      $scope.broadcastData = messageFactory.getBroadcastData();
    });
  }, 10000);

  $scope.$on('$ionicView.leave', function() {
    console.log("LEFFFT Broadcasts. Canceling update interval");
    clearInterval($rootScope.individualBroadcastUpdateInterval);
  });

  var messagesRead = [];
  for (var i = 0; i < $scope.currentBroadcastMessages.length; i++) {
    if($scope.currentBroadcastMessages[i].unread && $scope.currentBroadcastMessages[i].to_broadcast === $scope.currentBroadcast_id){
      messagesRead.push($scope.currentBroadcastMessages[i].broadcast_message_id);
    }
  }
  messageFactory.markBroadcastMessagesAsRead(messagesRead);
  var emitObj = {
    messagesRead: messagesRead,
    source: 'broadcasts'
  }
  $rootScope.$emit('readMessages', emitObj);

  $scope.showModal = function (imageUrl) {
    $scope.imageUrl = imageUrl;
    $ionicModal.fromTemplateUrl('templates/broadcastZoomView.html', {
      scope: $scope,
      animation: 'scale-in'
    }).then(function (modal) {
      $scope.modal = modal;
      $scope.modal.show();
    })
  }

  $scope.closeModal = function () {
    $scope.modal.remove();
  }

  $scope.backToBroadcastsPage = function (){
    $state.go('tabsController.broadcastsPage');
  }

  $scope.goToLink = function (url) {
    var options = {
        location: 'no',
        clearcache: 'yes',
        toolbar: 'yes'
     };

    $cordovaInAppBrowser.open(url, '_blank', options)
      .then(function(event) {})
      .catch(function(event) {});
  }


}])

.controller('settingsCtrl', ['$scope', '$state', '$stateParams', 'messageFactory', '$cordovaCamera', 'photoFactory', '$timeout', '$ionicPush', '$localStorage', '$rootScope', '$ionicActionSheet',
function ($scope, $state, $stateParams, messageFactory, $cordovaCamera, photoFactory, $timeout, $ionicPush, $localStorage, $rootScope, $ionicActionSheet) {
  $scope.data = {};
  $scope.data.currentUser = messageFactory.getCurrentUser();
  $scope.showLoader = false;
  $scope.data.uploadSuccessful = false;
  $scope.data.emailSetupRequired = false;
  $scope.showPasswordUpdated = false;

  //call to the server, see if the user needs to add an email and password to their account
  if(!$scope.data.currentUser.account_is_setup){
    messageFactory.emailAndPasswordIsValid().then(function (res) {
      if(!res.account_is_setup){
        $scope.data.emailSetupRequired = true;
      } else {
        //set the local user account_is_setup to true
        $scope.data.currentUser.account_is_setup = true
        messageFactory.setCurrentUser($scope.data.currentUser);
        $scope.data.currentUser = messageFactory.getCurrentUser();
      }
    })
  }


  var emailRegex = new RegExp(/.*[@].*[.].*/, 'g'); //TODO

  $scope.data.messageNotifications = $scope.data.currentUser.message_notifications;
  $scope.data.broadcastNotifications = $scope.data.currentUser.group_notifications;
  $scope.data.groupNotifications= $scope.data.currentUser.broadcast_notifications;

  $scope.errors = [];

  $scope.data.updateEmailAndPassword = function () {

    $scope.errors = [];

    if($scope.data.newEmail){
      if($scope.data.newEmail.length < 1){
        $scope.errors.push("Please enter an email address");
      }

      if(!emailRegex.test($scope.data.newEmail)){
        $scope.errors.push("Please enter a valid email");
      }

      console.log($scope.data.newEmail.length < 1);
      console.log(emailRegex.test($scope.data.newEmail));

    } else {
      $scope.errors.push("Please enter a valid email");
    }

    if(!$scope.data.newPasswordOne || !$scope.data.newPasswordTwo){
      $scope.errors.push("Please enter and confirm a password");
    } else {
      if($scope.data.newPasswordOne.length < 6){
        $scope.errors.push("Please enter a password with at least 6 characters")
      }
    }
    if($scope.data.newPasswordOne !== $scope.data.newPasswordTwo) $scope.errors.push("Given passwords don't match.");

    if($scope.errors.length === 0){
      messageFactory.updateEmailAndPassword($scope.data.newEmail, $scope.data.newPasswordOne).then(function (res) {
        console.log(res);
        console.log("______-----^^^^^^----________");
        if(res.confirmationEmail === 'sent'){
          //Update the current User
          $scope.showPasswordUpdated = true;
        }
      })
    }


  }

  $scope.updateNotificationSettings = function () {
    messageFactory.updateNotificationSettings($scope.data.messageNotifications, $scope.data.groupNotifications, $scope.data.broadcastNotifications);
  }

  $scope.updateMessageNotificationSettings = function () {
    messageFactory.updateMessageNotificationSettings($scope.data.messageNotifications).then(function (res) {
      console.log(res);
    })
  }

  $scope.updateGroupNotificationSettings = function () {
    messageFactory.updateGroupNotificationSettings($scope.data.groupNotifications).then(function (res) {
      console.log(res);
    })
  }

  $scope.updateBroadcastNotificationSettings = function () {
    messageFactory.updateBroadcastNotificationSettings($scope.data.broadcastNotifications).then(function (res) {
      console.log(res);
    })
  }

  $scope.data.addPhoto = function () {

    var hideSheet = $ionicActionSheet.show({
     buttons: [
       { text: 'Camera' },
       { text: 'Gallery' }
     ],
     cancelText: 'Cancel',
     cancel: function() {
          // add cancel code..
        },
     buttonClicked: function(index) {
       switch(index){
        case 0:
          $scope.data.takePhoto();
          return true;
        case 1:
          $scope.data.choosePhoto();
          return true;
       }
     }
   });
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

      var filename = $scope.data.currentUser.user_id + '_PersonalProfilePic.jpg'
      photoFactory.uploadPersonalProfilePhoto(filename, $scope.data.imgURI);

      $scope.showLoader = true;

      $timeout(function () {
        $scope.data.uploadSuccessful = true;
        $scope.showLoader = false;
        $scope.data.currentUser = messageFactory.getCurrentUser();
        $scope.apply();
      }, 2000);

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

      var filename = $scope.data.currentUser.user_id + '_PersonalProfilePic.jpg'
      photoFactory.uploadPersonalProfilePhoto(filename, $scope.data.imgURI);

      $scope.showLoader = true;

      $timeout(function () {
        $scope.data.uploadSuccessful = true;
        $scope.showLoader = false;
        $scope.data.currentUser = messageFactory.getCurrentUser();
        $scope.apply();
      }, 2000);

    }, function (err) {
      console.log("error has occurred in get picture");
    })
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

.controller('newChatMessageCtrl', ['$scope', '$state', '$stateParams', 'messageFactory', '$cordovaContacts', 'contactsFactory', '$ionicActionSheet', '$cordovaCamera', 'photoFactory',
function ($scope, $state, $stateParams, messageFactory, $cordovaContacts, contactsFactory, $ionicActionSheet, $cordovaCamera, photoFactory) {

  $scope.data = {};
  $scope.data.contactsHidden = true;
  $scope.data.isWhinnyUser = false;
  $scope.data.newChatRecipient = "";
  $scope.data.imgURI = '';
  $scope.hideInput = false;

  $scope.showLoader = false;

  if($stateParams.groupMember.first_name){
    console.log($stateParams.groupMember);
    $scope.data.isWhinnyUser = true;
    $scope.data.newChatRecipient = $stateParams.groupMember.first_name + ' ' + $stateParams.groupMember.last_name + '';
  }

  //Load all contacts into the contacts factory
  $scope.data.contacts = contactsFactory.getContacts();

  $scope.data.chosenPhone;

  $scope.data.errors = [];

  $scope.data.chooseContact = function (name, phone) {
    $scope.data.chosenPhone = phone;
    $scope.data.newChatRecipient = name;

    var firstSpace = name.indexOf(' ');
    $scope.data.newChatFirstName = name.substring(0, firstSpace);
    $scope.data.newChatLastName = name.substring(firstSpace+1);

    $scope.data.contactsHidden = true;
  }

  $scope.data.showContacts = function () {
    $scope.data.contactsHidden = false;
  }

  $scope.addPhoto = function () {

    var hideSheet = $ionicActionSheet.show({
      buttons: [
        { text: 'Camera' },
        { text: 'Gallery' }
      ],
      cancelText: 'Cancel',
      cancel: function() {

      },
      buttonClicked: function(index) {
        switch(index){
        case 0:
          $scope.takePhoto();
          return true;
        case 1:
          $scope.choosePhoto();
          return true;
        }
      }
    });
  }

  $scope.takePhoto = function () {

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
      $scope.data.imgURI = imageData;
      $scope.hideInput = true;
    })
  }

  $scope.choosePhoto = function () {

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
      $scope.data.imgURI = imageData;
      $scope.hideInput = true;
    }, function (err) {
      console.log("error has occurred in get picture");
    })
  }

  $scope.clearStagedPhoto = function () {
    $scope.data.imgURI = '';
    $scope.hideInput = false;
  }

  $scope.createNewChatMessage = function () {
    $scope.data.errors = [];
    if($scope.showLoader){
      return;
    }
    if(!$scope.data.chosenPhone && !$scope.data.isWhinnyUser){
      $scope.data.errors.push('Please enter a valid recipient!');
    }
    if(document.getElementById("newChatboxDiv").innerHTML == "" && $scope.data.imgURI.length < 1){
      $scope.data.errors.push('Please enter a message!');
    }
    if($scope.data.errors.length > 0){
      return;
    } else {
      $scope.showLoader = true;
    }

    var newChatMessage;
    if($scope.data.imgURI.length > 1){
      var filename = $scope.currentUser.user_id + '_chatMessage_'+ Date.now() + '.jpg';
      photoFactory.uploadChatPhoto(filename, $scope.data.imgURI);
      newChatMessage = 'https://s3.amazonaws.com/whinnyphotos/chat_images/' + filename;
    } else {
      newChatMessage = $scope.chatMessage;
    }

    var chatMessageEncoded = document.getElementById("newChatboxDiv").innerHTML;
    var emojiIds = [ 'HappyFace','LayingHorse','AngryFace','BuckingHorse','Pony','ArabianHorse','JumpingHorse','BarrelHorse','TrailHorse','ReiningHorse','PoloPony','RacingHorses','MareAndFoal','HunterHorse','GrazingHorse','DrivingHorse','DressageHorse','EventingHorse','PaddockHorse','Ribbon','LegBandages','VetSymbol','Blanket','Brush','HoofPick','EnglishSaddle','WesternSaddle','Bucket','Wheelbarrow','Pitchfork','Corgi','Fly','GolfCart', 'JackRussell', 'Tractor', 'Harrow', 'HayBale', 'Trailer', 'HorseShoe', 'Carrot'];

    var chatMessageDecoded; 
    var emojiIdsLength = emojiIds.length;
    for (var i = 0; i < emojiIdsLength; i++){
       chatMessageDecoded = chatMessageEncoded.replace(new RegExp('<img class="emoji" src="img/emoji/' + emojiIds[i] + '.png"></img>', 'g'), ":" + emojiIds[i] + ":");
    }

    //if you're speaking to another whinny user, send the chat the easy way
    if($scope.data.isWhinnyUser){

      messageFactory.sendChatMessage($stateParams.groupMember.user_id, chatMessageDecoded).then(function (res) {
        messageFactory.updateChatMessages().then(function (convos) {
          $scope.chatMessage = "";
          $scope.data.newChatRecipient = "";
          var new_convo;
          for (var i = 0; i < convos.length; i++) {
            if(convos[i].convoUser.user_id === $stateParams.groupMember.user_id){
              new_convo = convos[i];
            }
          }
          console.log(new_convo);
          $state.go('individualChat', { convo: new_convo });
        })
      })

    //If you're not speaking to a whinny user, we have to make sure the phone number is valid
    } else {
      var parsedPhone = $scope.data.chosenPhone.replace(/[\s()-]/g, "");
      messageFactory.createNewChatMessage(parsedPhone, chatMessageDecoded, $scope.data.newChatFirstName, $scope.data.newChatLastName).then(function (res) {
        messageFactory.updateChatMessages().then(function (convos) {
          $scope.chatMessage = "";
          $scope.data.newChatRecipient = "";
          var new_convo;
          for (var i = 0; i < convos.length; i++) {
            if(convos[i].convoUser.user_id === res.data.user_id){
              new_convo = convos[i];
            }
          }
          $state.go('individualChat', { convo: new_convo });
        });
      });
    }
  }

  $scope.addEmoji = function (emoji) {

    console.log("adding emoji", emoji);
    var imgEmoji = emoji.substring(1, emoji.length - 1);

    document.getElementById("newChatboxDiv").innerHTML += '<img class="emoji" src="img/emoji/'+imgEmoji+'.png"></img>';
    document.getElementById("newChatboxDiv").innerHTML = document.getElementById("newChatboxDiv").innerHTML.replace(new RegExp('<br>', 'g'), '');
    placeCaretAtEnd( document.getElementById("newChatboxDiv") );

  }

  $scope.backToChatPage = function () {
    if($stateParams.returnPage){
      $state.go('groupInfo', { group_id: $stateParams.returnPage });
    } else {
      $state.go('tabsController.chatPage');
    }
  }

  //TODO remove and place in service?
  function placeCaretAtEnd(el) {
    el.focus();
    if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
      var range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    } else if (typeof document.body.createTextRange != "undefined") {
      var textRange = document.body.createTextRange();
      textRange.moveToElementText(el);
      textRange.collapse(false);
      textRange.select();
    }
  }

}])

.controller('createNewGroupCtrl', ['$scope', '$state', '$stateParams', 'messageFactory', 'contactsFactory', '$cordovaCamera', 'Upload', 'photoFactory', '$timeout',
function ($scope, $state, $stateParams, messageFactory, contactsFactory, $cordovaCamera, Upload, photoFactory, $timeout) {
  console.log("create new group  controller!");

  $scope.groupData = {};
  $scope.groupData.errors = [];
  $scope.groupData.contacts = contactsFactory.getContacts();

  //TODO needs to be phone numbers
  //This is the object we send to the server
  $scope.groupData.createGroupInfo = {};
  $scope.groupData.createGroupInfo.invited = [];

  if(!$scope.groupData.imgURI){
    $scope.groupData.showPlaceholderPortrait = true;
  }


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
      $scope.groupData.showPlaceholderPortrait = false;
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
      $scope.groupData.showPlaceholderPortrait = false;
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
      if($scope.groupData.createGroupInfo.privacyStatus === 'Log'){
        $scope.groupData.createGroupInfo.is_private = true;
        $scope.groupData.createGroupInfo.hidden = true;
      }

      //Create group with placeholder link in profile pic
      messageFactory.createNewGroup($scope.groupData.createGroupInfo).then(function (res) {
        console.log("attempting to upload photo");
        var filename = res.data.group_id + '_GroupProfilePic.jpg'
        console.log("filename: ", filename);
        photoFactory.uploadGroupProfilePhoto(filename, $scope.groupData.imgURI);
        //update group pages
        messageFactory.updateGroupData().then(function () {
          $scope.groupData.createGroupInfo.groupName = "";
          $scope.groupData.createGroupInfo.is_private = false;
          $scope.groupData.createGroupInfo.is_public = false;
          $scope.groupData.createGroupInfo.hidden = false;
          $scope.groupData.createGroupInfo.zip = "";
          $scope.groupData.createGroupInfo.description = "";
          $scope.groupData.createGroupInfo.discipline = undefined;
          $scope.groupData.createGroupInfo.invited = [];
          $scope.groupData.showPlaceholderPortrait = true;

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

.controller('tabsController', ['$rootScope', '$scope', 'messageFactory', '$timeout', '$cordovaBadge', '$localStorage',
function ($rootScope, $scope, messageFactory, $timeout, $cordovaBadge, $localStorage) {

  var badgeNumber = 0;
  $scope.currentUser = messageFactory.getCurrentUser();

  $timeout(function () {
    //Chat badges
    $scope.chatMessages = messageFactory.getChatMessages();
    var unreadChatMessages = 0;
    for (var i = 0; i < $scope.chatMessages.length; i++) {
      for (var j = 0; j < $scope.chatMessages[i].messages.length; j++) {
        if(!$scope.chatMessages[i].messages[j].read && $scope.chatMessages[i].messages[j].from_user !== $scope.currentUser.user_id){
          unreadChatMessages++;
        }
      }
    }
    $scope.messageBadges = unreadChatMessages;

    //Group Badges
    $scope.groupData = messageFactory.getGroupData();
    if($scope.groupData){
      if($scope.groupData.unread){
        $scope.groupBadges = $scope.groupData.unread.length;
      } else {
        $scope.groupBadges = 0;
      }
    }

    //Broadcast Badges
    $scope.broadcastData = messageFactory.getBroadcastData();
    if($scope.broadcastData){
      if($scope.broadcastData.unread){
        $scope.broadcastBadges = $scope.broadcastData.unread.length;
      } else {
        $scope.broadcastBadges = 0;
      }
    }

    //Update the app's icon badge number
    if (window.cordova && window.cordova.plugins) {
      badgeNumber = $scope.messageBadges + $scope.groupBadges + $scope.broadcastBadges
      cordova.plugins.notification.badge.set(badgeNumber);

      $localStorage.badgeNumber = badgeNumber;
    }

  }, 1000);

  $rootScope.$on('readMessages', function (ev, args) {
    if(args.source === 'chat'){
      $scope.messageBadges -= args.messagesRead.length;
      if($scope.messageBadges < 0){
        $scope.messageBadges = 0;
      }
    } else if(args.source === 'groups'){
      $scope.groupBadges -= args.messagesRead.length;
      if($scope.groupBadges < 0){
        $scope.groupBadges = 0;
      }
    } else  if(args.source === 'broadcasts'){
      $scope.broadcastBadges -= args.messagesRead.length;
      if($scope.broadcastBadges < 0){
        $scope.broadcastBadges = 0;
      }
    }

    //Update the app's icon badge number
    if (window.cordova && window.cordova.plugins) {
      badgeNumber = $scope.messageBadges+ $scope.groupBadges + $scope.broadcastBadges
      cordova.plugins.notification.badge.set(badgeNumber);

      $localStorage.badgeNumber = badgeNumber;
    }
  })

}])
