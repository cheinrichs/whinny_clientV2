angular.module('app.services', ['ngCordova', 'ngStorage', 'ionic.cloud'])

.factory('messageFactory', ['$http', '$localStorage', '$ionicPush', function($http, $localStorage, $ionicPush){
  var messageFactory = {
    getMessages: getMessages,

    updateChatMessages: updateChatMessages,
    updateGroupMessages: updateGroupMessages,
    updateBroadcastMessages: updateBroadcastMessages,

    getUserObjects: getUserObjects,

    getGroupObjects: getGroupObjects,
    getGroupUserObjects: getGroupUserObjects,

    getBroadcastObjects: getBroadcastObjects,
    getBroadcastObjectById: getBroadcastObjectById,

    getChatMessages: getChatMessages,
    getGroupMessages: getGroupMessages,
    getBroadcastMessages: getBroadcastMessages,

    joinWhinny: joinWhinny,

    addUserInterests: addUserInterests,

    getUserInterests: getUserInterests,

    submitConfirmationNumber: submitConfirmationNumber,

    getCurrentUser: getCurrentUser,
    setCurrentUser: setCurrentUser,

    sendChatMessage: sendChatMessage,
    sendGroupMessage: sendGroupMessage,
    sendBroadcastMessage: sendBroadcastMessage,

    createNewChatMessage: createNewChatMessage,
    createNewGroup: createNewGroup,

    getGroupInvitations: getGroupInvitations,
    updateGroupInvitations: updateGroupInvitations,
    acceptGroupInvitation: acceptGroupInvitation,
    declineGroupInvitation: declineGroupInvitation,

    getGroupApplications: getGroupApplications,
    updateGroupApplications: updateGroupApplications,
    acceptGroupApplication: acceptGroupApplication,
    declineGroupApplication: declineGroupApplication,

    getSearchGroupObjects: getSearchGroupObjects,
    updateSearchGroupObjects: updateSearchGroupObjects,

    joinGroup: joinGroup,
    leaveGroup: leaveGroup,

    getBroadcastSearchObjects: getBroadcastSearchObjects,
    updateSearchBroadcastObjects: updateSearchBroadcastObjects,

    subscribeToBroadcast: subscribeToBroadcast,
    unsubscribeToBroadcast: unsubscribeToBroadcast,

    updateNotificationSettings: updateNotificationSettings,
    updateMessageNotificationSettings: updateMessageNotificationSettings,
    updateGroupNotificationSettings: updateGroupNotificationSettings,
    updateBroadcastNotificationSettings: updateBroadcastNotificationSettings,

    versionCheck: versionCheck,

    logIn: logIn,
    logout: logout
  };

  var CLIENT_VERSION = '0.0.1';
  //holds all data for the current user. Used to send and parse messages
  var currentUser = {};//TODO
  // var currentUser = {
  //   user_id: 1,
  //   first_name: "Cooper",
  //   last_name: "Heinrichs"
  // };


  //Contains all messages sent to this specific user.
  //This is used before the messages are all parse.
  // var messages = [];

  //This is a messageId. When sent, the API only returns messages with an ID after this
  //reduce amount of extra data processing
  var latestMessageUpdated = 0;

  //An array contain each 1 on 1 message between the current user and other users
  var chatMessages = {};
  //An array containg any user in communication with the current user.
  //Each object in this array has each users name, profile picture
  var userObjects = [];

  //Contains all messages for each group the current is user is part of.
  var groupMessages = {};
  //Contains name and profile picture for each user associated with a group the
  //the current user is a part of
  var groupObjects = [];
  //Contains objects for each user for group chat
  var groupUserObjects = {};

  //Contains all messages for each broadcast
  var broadcastMessages = [];
  //contains all data for each broadcast the current user is subscribed to,
  //including name, description, and photo link
  var broadcastObjects = [];

  //contains all currently open group invitations for the current user
  var  groupInvitations = [];

  //for all groups the current user is an admin of,
  //this var contains all membership requests
  var groupApplications = {};

  //contains data for all groups. Users can search through this to find new groups to join.
  //current consists of groups that the current user is not already a member of.
  var searchGroupObjects = [];

  // contains data for all broadcasts, used to search and subscribe to broadcasts
  var searchBroadcastObjects = [];

  return messageFactory;

  function getMessages(){
    return messages;
  }

  function updateChatMessages(){
    // if(currentUser.user_id){ //TODO
      // var url = 'http://localhost:3000/chatMessages/' + currentUser.user_id;
      var url = 'https://whinny-server.herokuapp.com/chatMessages/' + currentUser.user_id;
      return $http.get(url).then(function (res) {
        console.log(res);
        chatMessages = [];
        for (var i = 0; i < res.data.length; i++) {
          console.log(res.data[i]);
          if(res.data[i] !== null){
            chatMessages.push(res.data[i])  
          }
        }
        console.log(chatMessages);
        // chatMessages = res.data;
        //TODO clean this up
        // messages = res.data.messages;
        // chatMessages = {};
        //
        // for (var i = 0; i < messages.length; i++) {
        //   if(messages[i].to_user === currentUser.user_id){
        //     if(!chatMessages[messages[i].from_user]) chatMessages[messages[i].from_user] = [];
        //     // console.log("to current user ", messages[i]);
        //     chatMessages[messages[i].from_user].push(messages[i]);
        //   } else if(messages[i].from_user === currentUser.user_id){
        //     if(!chatMessages[messages[i].to_user]) chatMessages[messages[i].to_user] = [];
        //     // console.log("from current user", messages[i]);
        //     chatMessages[messages[i].to_user].push(messages[i]);
        //   }
        // }
        //
        // userObjects = {};
        // for (var i = 0; i < res.data.userObjects.length; i++) userObjects[res.data.userObjects[i].user_id] = res.data.userObjects[i];
      })
    // } else {
    //   console.log("current user user id is not defined");
    //   return;
    // }
  }

  function updateGroupMessages(){
    // if(currentUser.user_id){
      var url = 'https://whinny-server.herokuapp.com/groupMessages/' + currentUser.user_id;
      return $http.get(url).then(function (res) {
        //groupData = {}; //TODO
        //groupData.groupMessages = res.data.groupMessages;
        groupMessages = res.data.groupMessages;
        groupObjects = res.data.groupObjects;

        for (var i = 0; i < res.data.userObjects.length; i++){
          groupUserObjects[res.data.userObjects[i].user_id] = res.data.userObjects[i];
        }
        return;
      })
    // } else {
    //   console.log("current user user id is not defined");
    //   return;
    // }
  }

  function updateBroadcastMessages(){
    // if(currentUser.user_id){
      var url = 'https://whinny-server.herokuapp.com/broadcastMessages/' + currentUser.user_id;
      return $http.get(url).then(function (res) {
        broadcastMessages = res.data.broadcastMessages;
        broadcastObjects = {};

        for (var i = 0; i < res.data.broadcastObjects.length; i++) {
          broadcastObjects[res.data.broadcastObjects[i].broadcast_id] = res.data.broadcastObjects[i];
        }

      })
    // } else {
    //   console.log("current user user id is not defined");
    //   return;
    // }
  }

  function getUserObjects() {
    return userObjects;
  }

  function getGroupObjects() {
    return groupObjects;
  }

  function getGroupUserObjects() {
    return groupUserObjects;
  }

  function getBroadcastObjects() {
    return broadcastObjects;
  }

  function getBroadcastObjectById(broadcast_id) {
    return broadcastObjects[broadcast_id];
  }

  function getChatMessages() {
    return chatMessages;
  }

  function getGroupMessages() {
    return groupMessages;
  }

  function getBroadcastMessages() {
    return broadcastMessages;
  }

  function joinWhinny(data) {
    var url = 'https://whinny-server.herokuapp.com/joinWhinny/';
    return $http.post(url, data).then(function (res) {
      return res.data;
    })
  }

  function addUserInterests(interests_array, suggested_interest) {
    var url = 'https://whinny-server.herokuapp.com/addUserInterests';
    var data = {
      currentUser: currentUser.user_id,
      interests: interests_array,
    }
    if(!suggested_interest){
      data.suggested_interest = "";
    } else {
      data.suggested_interest = suggested_interest;
    }
    return $http.post(url, data).then(function (res) {
      return res;
    })
  }

  function getUserInterests() {
    var url = 'https://whinny-server.herokuapp.com/userInterests/' + currentUser.user_id;
    return $http.get(url).then(function (res) {
      return res.data;
    })
  }

  function submitConfirmationNumber(user_phone, givenConfirmationNumber) {
    var url = 'https://whinny-server.herokuapp.com/confirmCode/' + user_phone + '/' + givenConfirmationNumber;
    return $http.get(url).then(function (res) {
      setCurrentUser(res.data);
      console.log("logged in and set current user to");
      console.log(res.data);
      $localStorage.whinny_user = res.data;
      return res;
    })

  }

  function getCurrentUser() {
    return currentUser;
  }

  function setCurrentUser(user){
    currentUser = user;
  }

  function sendChatMessage(to_user, content) {
    var data = {
      senderName: currentUser.first_name + ' ' + currentUser.last_name,
      to_user: to_user,
      from_user: currentUser.user_id,
      content: content
    }
    var url = 'https://whinny-server.herokuapp.com/sendChatMessage';
    return $http.post(url, data).then(function (res) {
      return res;
    })
  }

  function sendGroupMessage(group_id, content) {
    console.log("sending group message with ", currentUser, " to group ", group_id, " content ", content);

    var data = {
      to_group: group_id,
      from_user: currentUser.user_id,
      content: content,
      senderName: currentUser.first_name + ' ' + currentUser.last_name
    }

    var url = 'https://whinny-server.herokuapp.com/sendGroupMessage'
    return $http.post(url, data).then(function (res) {
      return res;
    })
  }

  function sendBroadcastMessage(broadcast_id, content) {
    console.log("sending broadcast message with", currentUser, " to broadcast ", broadcast_id, " content ", content);
    var url = 'https://whinny-server.herokuapp.com/sendBroadcastMessage/' + broadcast_id + '/' + currentUser.user_id + '/' + content;
    return $http.get(url).then(function (res) {
      return res;
    })
  }

  function createNewChatMessage(to_phone, content) {
    console.log("creating new chat message with ", currentUser, " to phone ", to_phone, " content ", content);
    var url = 'https://whinny-server.herokuapp.com/createNewChat/' + to_phone + '/' + currentUser.user_id + '/' + content;
    return $http.get(url).then(function (res) {
      return res;
    });
  }

  function createNewGroup(groupData) {
    // messageFactory.createNewGroup(groupName, is_private, hidden, groupZip, description, imageLink, phoneNumbers);
    console.log("creating new group with ");
    for(var key in groupData){
      console.log(groupData[key]);
    }
    var url = 'https://whinny-server.herokuapp.com/createNewGroup';
    console.log(currentUser);
    groupData.fromUser = currentUser
    groupData.hidden = false;

    return $http.post(url, groupData).then(function (res) {
      console.log("got the res", res);
      return res;
    });
  }

  function getGroupInvitations() {
    return groupInvitations;
  }

  function updateGroupInvitations() {
    var url = 'https://whinny-server.herokuapp.com/groupInvitations/' + currentUser.user_id;
    return $http.get(url).then(function (res) {
      console.log("res in update group invitations in service", res);
      groupInvitations = res.data;
      return groupInvitations;
    });
  }

  function acceptGroupInvitation(user_id, group_id) {
    console.log("accepted in the service u g", user_id, group_id);
    var data = {
      user_id: user_id,
      group_id: group_id
    };
    var url = 'https://whinny-server.herokuapp.com/acceptInvitation';
    return $http.post(url, data).then(function (res) {
      return res.data;
    })
  }

  function declineGroupInvitation(invitation_id) {
    console.log("declined in service", invitation_id);
    var data = {
      user_id: currentUser.user_id,
      invitation_id: invitation_id
    };
    var url = 'https://whinny-server.herokuapp.com/declineInvitation';
    return $http.post(url, data).then(function (res) {
      return res.data;
    })
  }

  function getGroupApplications() {
    return groupApplications;
  }

  function updateGroupApplications() {
    var url = 'https://whinny-server.herokuapp.com/groupApplications/' + currentUser.user_id;
    return $http.get(url).then(function (res) {
      groupApplications = res.data;
      return groupApplications;
    })
  }

  function acceptGroupApplication(user_id, group_id) {
    var url = 'https://whinny-server.herokuapp.com/acceptGroupApplication/';
    var data = {
      user_id: user_id,
      group_id: group_id
    };
    return $http.post(url, data).then(function (res) {
      return res.data;
    });
  }

  function declineGroupApplication(application_id) {
    var url = 'https://whinny-server.herokuapp.com/declineGroupApplication/';
    var data = {
      user_id: currentUser.user_id,
      application_id: application_id
    };
    return $http.post(url, data).then(function (res) {
      return res.data;
    });
  }

  function getSearchGroupObjects() {
    return searchGroupObjects;
  }

  function updateSearchGroupObjects() {
    var url = 'https://whinny-server.herokuapp.com/groupSearch/' + currentUser.user_id;
    return $http.get(url).then(function (res) {
      searchGroupObjects = res.data;
      return searchGroupObjects;
    })
  }

  function joinGroup(group_id) {
    var url = 'https://whinny-server.herokuapp.com/joinGroup/';
    var data = {
      user_id: currentUser.user_id,
      group_id: group_id
    }
    return $http.post(url, data).then(function (res) {
      return res.data;
    })
  }

  function leaveGroup(group_id) {
    var url = 'https://whinny-server.herokuapp.com/leaveGroup/';
    var data = {
      user_id: currentUser.user_id,
      group_id: group_id
    }
    return $http.post(url, data).then(function (res) {
      return res.data;
    })
  }

  function getBroadcastSearchObjects() {
    console.log("getting broadcast objects");
    return searchBroadcastObjects;
  }

  function updateSearchBroadcastObjects() {
    console.log("updating search broadcast data start");
    var url = 'https://whinny-server.herokuapp.com/broadcastSearch/' + currentUser.user_id;
    return $http.get(url).then(function (res) {
      console.log("updated search broadcast data", res);
      searchBroadcastObjects = res.data;
      return searchBroadcastObjects;
    })
  }

  function subscribeToBroadcast(broadcast_id) {
    var url = 'https://whinny-server.herokuapp.com/subscribeToBroadcast';
    var data = {
      user_id: currentUser.user_id,
      broadcast_id: broadcast_id
    }
    return $http.post(url, data).then(function (res) {
      return res.data;
    })
  }

  function unsubscribeToBroadcast(broadcast_id) {
    var url = 'https://whinny-server.herokuapp.com/unSubscribeFromBroadcast';
    var data = {
      user_id: currentUser.user_id,
      broadcast_id: broadcast_id
    }
    return $http.post(url, data).then(function (res) {
      return res.data;
    })
  }

  function updateNotificationSettings(messaging, group, broadcast) {
    if(!messaging || !group || !broadcast){
      console.log("Error: invalid args in updateNotificationSettings.");
    }
    var url = 'https://whinny-server.herokuapp.com/updateNotificationSettings';
    var data = {
      user_id: currentUser.user_id,
      messaging: messaging,
      group: group,
      broadcast: broadcast
    }
    return $http.post(url, data).then(function (res) {
      return res;
    })
  }

  function updateMessageNotificationSettings(messaging) {
    var url = 'https://whinny-server.herokuapp.com/updateMessageNotificationSettings';
    var data = {
      user_id: currentUser.user_id,
      messaging: messaging
    }
    return $http.post(url, data).then(function (res) {
      return res;
    })
  }

  function updateGroupNotificationSettings(group) {
    var url = 'https://whinny-server.herokuapp.com/updateGroupNotificationSettings';
    var data = {
      user_id: currentUser.user_id,
      group: group
    }
    return $http.post(url, data).then(function (res) {
      return res;
    })
  }

  function updateBroadcastNotificationSettings(broadcast) {
    var url = 'https://whinny-server.herokuapp.com/updateBroadcastNotificationSettings';
    var data = {
      user_id: currentUser.user_id,
      broadcast: broadcast
    }
    return $http.post(url, data).then(function (res) {
      return res;
    })
  }

  function versionCheck() {
    var url = 'http://whinny-server.herokuapp.com/versionCheck/' + CLIENT_VERSION;
    // var url = 'http://localhost:3000/versionCheck/' + CLIENT_VERSION;
    return $http.get(url).then(function (res) {
      return res.data;
    })
  }

  function logIn(phone) { //TODO needs fixing.
    console.log("logging in");
    var data = {};
    data.phone = phone;

    console.log($localStorage);

    if($localStorage) console.log("localStorage is defined");
    for (key in $localStorage){
      console.log(key);
      console.log($localStorage[key]);
      console.log("=====");
    }
    // data.device_token = $localStorage.tokenObject.token;
    data.version = CLIENT_VERSION;

    var url = 'https://whinny-server.herokuapp.com/logIn';
    return $http.post(url, data).then(function (res) {
      // if(res.data.deprecatedClient) alert("Your Whinny app is now out of date! Please download the new version!");
      console.log("set current user to");
      console.log(res);
      if(res.data[0]){
        if(res.data[0].user_id){
          setCurrentUser(res.data[0]);
          $localStorage.whinny_user = res.data[0];
        }
      }
      return res;
    })
  }

  function logout() {
    var data = {
      user_id: currentUser.user_id
    }
    currentUser = {};
    var url = 'https://whinny-server.herokuapp.com/logOut';
    // var url = 'http://localhost:3000/logOut';
    return $http.post(url, data).then(function (res) {
      return res;
    })
  }

}])

//messageFactory.$inject = [];
.factory('contactsFactory', ['$cordovaContacts', function ($cordovaContacts) {
  var contactsFactory = {
    updateContacts: updateContacts,
    getContacts: getContacts,
    filterContacts: filterContacts
  };

  var contacts = [];

  return contactsFactory;

  function updateContacts() {
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
      if($cordovaContacts){
        if(contacts.length === 0){
          $cordovaContacts.find({ filter: '', multiple: true}).then(function (local_contacts) {
            contacts = local_contacts;
            return contacts;
          })
        }
      } else {
        return [];
      }
    }
  }

  function getContacts() {
    return contacts;
  }

  function filterContacts() {
    console.log("filtering contacts");
  }
}])

.factory('photoFactory', ['$http', function ($http) {
  var photoFactory = {
    uploadPersonalProfilePhoto: uploadPersonalProfilePhoto,
    uploadGroupProfilePhoto: uploadGroupProfilePhoto
  }

  return photoFactory;

  function uploadGroupProfilePhoto(fileName, fileURI) {
    var uri = encodeURI('https://whinny-server.herokuapp.com/groupProfilePhotoUpload');
    var options = new FileUploadOptions();

    options.fileKey = "file";
    options.fileName = fileName;
    options.mimeType = "text/plain";
    options.ACL = 'public-read';

    //TODO - This is not returning a promise and there is a waiting Then statement
    //onSuccess and onError are not firing
    //Also getting invalid PNG file: iDOt doesn't point to valid IDAT chunk
    //Photo is uploading

    var ft = new FileTransfer();
    return ft.upload(fileURI, uri, onSuccess, onError, options);

    function onSuccess(res) {
      console.log("successful file upload");
      console.log(res);
    }

    function onError(err) {
      console.log("error in the file upload");
      console.log(err);
    }

  }

  function uploadPersonalProfilePhoto(fileName, fileURI) {
    console.log("uploading personal photo in service");
    var uri = encodeURI('https://whinny-server.herokuapp.com/personalProfilePhotoUpload');
    var options = new FileUploadOptions();

    options.fileKey = "file";
    options.fileName = fileName;
    options.mimeType = "text/plain";
    options.ACL = 'public-read';

    var ft = new FileTransfer();
    return ft.upload(fileURI, uri, onSuccess, onError, options);

    function onSuccess(res) {
      console.log("res in photo service success");
      console.log(res);
    }

    function onError(err) {
      console.log(err);
    }
  }

}])
