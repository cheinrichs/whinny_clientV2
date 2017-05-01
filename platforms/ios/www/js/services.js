angular.module('app.services', ['ngCordova', 'ngStorage', 'ionic.cloud'])

.factory('messageFactory', ['$http', '$localStorage', '$ionicPush', function($http, $localStorage, $ionicPush){
  var messageFactory = {
    getMessages: getMessages,

    updateChatMessages: updateChatMessages,
    updateGroupData: updateGroupData,
    updateBroadcastData: updateBroadcastData,

    getUserObjects: getUserObjects,

    getGroupObjects: getGroupObjects,
    getGroupUserObjects: getGroupUserObjects,
    getGroupMembers: getGroupMembers,

    getGroupData: getGroupData,

    getBroadcastData: getBroadcastData,

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
    sendChatImage: sendChatImage,
    sendGroupMessage: sendGroupMessage,
    sendGroupImage: sendGroupImage,
    sendBroadcastMessage: sendBroadcastMessage,

    markChatMessagesAsRead: markChatMessagesAsRead,
    markGroupMessagesAsRead: markGroupMessagesAsRead,
    markBroadcastMessagesAsRead: markBroadcastMessagesAsRead,
    markTutorialAsRead: markTutorialAsRead,
    resetTutorials: resetTutorials,

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
    applyToGroup: applyToGroup,

    updateGroupName: updateGroupName,
    updateGroupDescription: updateGroupDescription,
    removeUserFromGroup: removeUserFromGroup,
    makeUserAdmin: makeUserAdmin,
    removeUserAdmin: removeUserAdmin,
    sendInvitations: sendInvitations,
    deleteGroup: deleteGroup,

    getBroadcastSearchObjects: getBroadcastSearchObjects,
    updateSearchBroadcastObjects: updateSearchBroadcastObjects,

    subscribeToBroadcast: subscribeToBroadcast,
    unsubscribeToBroadcast: unsubscribeToBroadcast,

    updateNotificationSettings: updateNotificationSettings,
    updateMessageNotificationSettings: updateMessageNotificationSettings,
    updateGroupNotificationSettings: updateGroupNotificationSettings,
    updateBroadcastNotificationSettings: updateBroadcastNotificationSettings,

    markAccountAsSetUp: markAccountAsSetUp,

    updateDeviceToken: updateDeviceToken,

    versionCheck: versionCheck,

    logIn: logIn,
    logout: logout
  };

  //TODO switch between databases when you push!!@?!@#!@#
  //Remember to switch in the photo upload factory as well
  //Production
  // var API_URL = 'https://whinny-server.herokuapp.com';
  //Staging
  var API_URL = 'https://whinny-staging.herokuapp.com';
  //Local
  // var API_URL = 'http://localhost:3000';

  var CLIENT_VERSION = '0.0.1';
  //holds all data for the current user. Used to send and parse messages
  var currentUser = {};

  //Contains all messages sent to this specific user.
  //This is used before the messages are all parse.
  // var messages = [];

  //This is a messageId. When sent, the API only returns messages with an ID after this
  //reduce amount of extra data processing
  var latestMessageUpdated = 0;

  //An array contain each 1 on 1 message between the current user and other users
  var chatMessages = [];
  //An array containg any user in communication with the current user.
  //Each object in this array has each users name, profile picture
  var userObjects = [];

  var groupData;

  //Contains all messages for each group the current is user is part of.
  // var groupMessages = {};
  // Contains name and profile picture for each user associated with a group the
  //the current user is a part of
  // var groupObjects = [];
  //Contains objects for each user for group chat
  // var groupUserObjects = {};

  //Contains all messages for each broadcast
  var broadcastMessages = [];
  //contains all data for each broadcast the current user is subscribed to,
  //including name, description, and photo link
  var broadcastObjects = [];

  var broadcastData;

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
    if(Object.keys(currentUser).length === 0) return;
    var url = API_URL + '/chatMessages/' + currentUser.user_id;
    return $http.get(url).then(function (res) {
      chatMessages = res.data;
      return res.data;
    })
  }

  function updateGroupData(){
    if(Object.keys(currentUser).length === 0){
      var holderData = [
        {
          unread: false,
          messages: [],
          convoUser: null
        }
      ]
      return holderData;
    }
    var url = API_URL + '/groupMessages/' + currentUser.user_id;
    return $http.get(url).then(function (res) {

      var groupDataUnparsed = res.data;
      var unreadGroups = [];
      var unreadGroupMessages = [];

      //loop through the unread messages and push those into their own array
      if(groupDataUnparsed.unread){
        for (var i = 0; i < groupDataUnparsed.unread.length; i++) {
          unreadGroups.push(groupDataUnparsed.unread[i].group_id);
          unreadGroupMessages.push(groupDataUnparsed.unread[i].group_message_read_id)
        }
      }

      //mark each broadcast with an unread message with unread = true
      for (var i = 0; i < groupDataUnparsed.groupObjects.length; i++) {
        groupDataUnparsed.groupObjects[i].unread = false;
        if(unreadGroups.indexOf(groupDataUnparsed.groupObjects[i].group_id) >= 0){
          groupDataUnparsed.groupObjects[i].unread = true;
        }
      }

      //mark each unread message with unread = true
      //this will be used to mark the message as read
      for (var i = 0; i < groupDataUnparsed.groupMessages.length; i++) {
        groupDataUnparsed.groupMessages[i].unread = false;
        if(unreadGroupMessages.indexOf(groupDataUnparsed.groupMessages[i].group_message_id) >= 0){
          groupDataUnparsed.groupMessages[i].unread = true;
        }
      }

      groupDataUnparsed.groupMembersById = {};

      for (var i = 0; i < groupDataUnparsed.userObjects.length; i++) {
        groupDataUnparsed.groupMembersById[groupDataUnparsed.userObjects[i].user_id] = groupDataUnparsed.userObjects[i];
      }

      groupData = groupDataUnparsed;

      console.log(groupData);

      return groupData;
    })
  }

  function updateBroadcastData(){
    if(Object.keys(currentUser).length === 0) return;
    var url = API_URL + '/broadcastMessages/' + currentUser.user_id;
    return $http.get(url).then(function (res) {
      var broadcastDataUnparsed = res.data;
      var unreadBroadcasts = [];
      var unreadMessages = [];

      //loop through the unread messages and push those into their own array
      for (var i = 0; i < broadcastDataUnparsed.unread.length; i++) {
        unreadBroadcasts.push(broadcastDataUnparsed.unread[i].broadcast_id);
        unreadMessages.push(broadcastDataUnparsed.unread[i].broadcast_message_id);
      }

      //mark each broadcast with an unread message with unread = true
      for (var i = 0; i < broadcastDataUnparsed.broadcasts.length; i++) {
        broadcastDataUnparsed.broadcasts[i].unread = false;
        if(unreadBroadcasts.indexOf(broadcastDataUnparsed.broadcasts[i].broadcast_id) >= 0){
          broadcastDataUnparsed.broadcasts[i].unread = true;
        }
      }

      //mark each unread message with unread = true
      //this will be used to mark the message as read
      for (var i = 0; i < broadcastDataUnparsed.messages.length; i++) {
        broadcastDataUnparsed.messages[i].unread = false;
        if(unreadMessages.indexOf(broadcastDataUnparsed.messages[i].broadcast_message_id) >= 0){
          broadcastDataUnparsed.messages[i].unread = true;
        }
      }

      broadcastData = broadcastDataUnparsed;

      return broadcastData;
    })
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

  function getGroupMembers(group_id) {
    var url = API_URL + '/groupMembers/' + group_id;
    return $http.get(url).then(function (res) {
      return res.data;
    })
  }

  function getBroadcastData() {
    return broadcastData;
  }

  function getGroupData() {
    return groupData;
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
    var url = API_URL + '/joinWhinny/';
    return $http.post(url, data).then(function (res) {
      return res.data;
    })
  }

  function addUserInterests(interests_array, suggested_interest) {
    var url = API_URL + '/addUserInterests';
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
    var url = API_URL + '/userInterests/' + currentUser.user_id;
    return $http.get(url).then(function (res) {
      return res.data;
    })
  }

  function submitConfirmationNumber(user_phone, givenConfirmationNumber) {
    var url = API_URL + '/confirmCode/' + user_phone + '/' + givenConfirmationNumber;
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
    var url = API_URL + '/sendChatMessage';
    return $http.post(url, data).then(function (res) {
      return res;
    })
  }

  function sendChatImage(to_user, link) {
    var data = {
      senderName: currentUser.first_name + ' ' + currentUser.last_name,
      to_user: to_user,
      from_user: currentUser.user_id,
      image_src: link
    }
    var url = API_URL + '/sendChatImage';
    return $http.post(url, data).then(function (res) {
      return res;
    })
  }

  function sendGroupMessage(group_id, groupName, content) {

    var data = {
      groupName: groupName,
      to_group: group_id,
      from_user: currentUser.user_id,
      content: content,
      senderName: currentUser.first_name + ' ' + currentUser.last_name
    }

    var url = API_URL + '/sendGroupMessage'
    // var url = 'http://localhost:3000/sendGroupMessage';
    return $http.post(url, data).then(function (res) {
      return res;
    })
  }

  function sendGroupImage(group_id, groupName, image_src) {
    var data = {
      groupName: groupName,
      to_group: group_id,
      from_user: currentUser.user_id,
      content: '',
      senderName: currentUser.first_name + ' ' + currentUser.last_name,
      image: true,
      image_src: image_src
    }
    var url = API_URL + '/sendGroupImage'
    return $http.post(url, data).then(function (res) {
      return res;
    })
  }

  function sendBroadcastMessage(broadcast_id, content) {
    console.log("sending broadcast message with", currentUser, " to broadcast ", broadcast_id, " content ", content);
    var url = API_URL + '/sendBroadcastMessage/' + broadcast_id + '/' + currentUser.user_id + '/' + content;
    return $http.get(url).then(function (res) {
      return res;
    })
  }

  function markChatMessagesAsRead(newlyReadMessages) {
    var data = {
      newlyReadMessages: newlyReadMessages
    };
    // var url = 'http://localhost:3000/markChatMessagesAsRead';
    var url = API_URL + '/markChatMessagesAsRead';
    return $http.post(url, data).then(function (res) {
      return res;
    });
  }

  function markGroupMessagesAsRead(newlyReadMessages) {
    var data = {
      user_id: currentUser.user_id,
      newlyReadMessages: newlyReadMessages
    };
    var url = API_URL + '/markGroupMessagesAsRead';
    return $http.post(url, data).then(function (res) {
      return res;
    })
  }

  function markBroadcastMessagesAsRead(newlyReadMessages) {
    var data = {
      user_id: currentUser.user_id,
      newlyReadMessages: newlyReadMessages
    }
    var url = API_URL + '/markBroadcastMessagesAsRead';
    return $http.post(url, data).then(function (res) {
      return res;
    });
  }

  function markTutorialAsRead(tutorial) {
    switch(tutorial){
      case 1:
        currentUser.tutorial_1 = false;
        break;
      case 2:
        currentUser.tutorial_2 = false;
        break;
      case 3:
        currentUser.tutorial_3 = false;
        break;
      case 4:
        currentUser.tutorial_4 = false;
        break;
      case 5:
        currentUser.tutorial_5 = false;
        break;
    }
    var data = {
      user_id: currentUser.user_id,
      tutorial: tutorial
    }
    // var url = 'http://localhost:3000/markTutorialAsRead';
    var url = API_URL + '/markTutorialAsRead';
    return $http.post(url, data).then(function (res) {
      return res;
    })
  }

  function resetTutorials() {
    var data = {
      user_id: currentUser.user_id
    }
    // var url = 'http://localhost:3000/resetTutorials';
    var url = API_URL + '/resetTutorials';
    return $http.post(url, data).then(function (res) {
      console.log(res.data.updatedUser);
      setCurrentUser(res.data.updatedUser);
      return res;
    })
  }

  function createNewChatMessage(to_phone, content, first_name, last_name) {
    var data = {
      to_phone: to_phone,
      from_user: currentUser.user_id,
      content: content,
      first_name: first_name,
      last_name: last_name
    }
    var url = API_URL + '/createNewChat';
    return $http.post(url, data).then(function (res) {
      return res;
    });
  }

  function createNewGroup(groupData) {
    var url = API_URL + '/createNewGroup';
    groupData.fromUser = currentUser
    console.log("creating new group with ", groupData);
    return $http.post(url, groupData).then(function (res) {
      console.log("got the res", res);
      return res;
    });
  }

  function getGroupInvitations() {
    return groupInvitations;
  }

  function updateGroupInvitations() {
    var url = API_URL + '/groupInvitations/' + currentUser.user_id;
    return $http.get(url).then(function (res) {
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
    var url = API_URL + '/acceptInvitation';
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
    var url = API_URL + '/declineInvitation';
    return $http.post(url, data).then(function (res) {
      return res.data;
    })
  }

  function getGroupApplications() {
    return groupApplications;
  }

  function updateGroupApplications() {
    var url = API_URL + '/groupApplications/' + currentUser.user_id;
    return $http.get(url).then(function (res) {
      groupApplications = res.data;
      return groupApplications;
    })
  }

  function acceptGroupApplication(user_id, group_id) {
    var url = API_URL + '/acceptGroupApplication/';
    var data = {
      user_id: user_id,
      group_id: group_id
    };
    return $http.post(url, data).then(function (res) {
      return res.data;
    });
  }

  function declineGroupApplication(application_id) {
    var url = API_URL + '/declineGroupApplication/';
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
    var url = API_URL + '/groupSearch/' + currentUser.user_id;
    return $http.get(url).then(function (res) {
      searchGroupObjects = res.data;
      return searchGroupObjects;
    })
  }

  function joinGroup(group_id) {
    console.log("trying to join ", group_id);
    var url = API_URL + '/joinGroup/';
    var data = {
      user_id: currentUser.user_id,
      group_id: group_id
    }
    return $http.post(url, data).then(function (res) {
      console.log("res in join group");
      return res.data;
    })
  }

  function leaveGroup(group_id) {
    var url = API_URL + '/leaveGroup/';
    var data = {
      user_id: currentUser.user_id,
      group_id: group_id
    }
    return $http.post(url, data).then(function (res) {
      return res.data;
    })
  }

  function applyToGroup(group_id) {
    var url = API_URL + '/applyToGroup/';
    var data = {
      user_id: currentUser.user_id,
      group_id: group_id
    }
    return $http.post(url, data).then(function (res) {
      return res.data;
    })
  }

  function updateGroupName(group_id, newGroupName) {
    var url = API_URL + '/updateGroupName';
    var data = {
      group_id: group_id,
      groupName: newGroupName
    }
    return $http.post(url, data).then(function (res) {
      return res.data;
    })
  }

  function updateGroupDescription(group_id, newGroupDescription) {
    var url = API_URL + '/updateGroupDescription';
    var data = {
      group_id: group_id,
      groupDescription: newGroupDescription
    }
    return $http.post(url, data).then(function (res) {
      return res.data;
    })
  }

  function removeUserFromGroup(group_id, user_id) {
    var url = API_URL + '/removeUserFromGroup';
    var data = {
      group_id: group_id,
      user_id: user_id
    }
    return $http.post(url, data).then(function (res) {
      return res.data;
    })

  }

  function makeUserAdmin(group_id, user_id) {
    var url = API_URL + '/makeUserAdmin';
    var data = {
      group_id: group_id,
      user_id: user_id
    }
    return $http.post(url, data).then(function (res) {
      return res.data;
    })
  }

  function removeUserAdmin(group_id, user_id) {
    var url = API_URL + '/removeUserAdmin';
    var data = {
      group_id: group_id,
      user_id: user_id
    }
    return $http.post(url, data).then(function (res) {
      return res.data;
    })
  }

  function sendInvitations(group_id, invitations, user_id) {
    var url = API_URL + '/inviteToGroup';
    var data = {
      group_id: group_id,
      invitations: invitations,
      from_user_id: user_id
    }
    return $http.post(url, data).then(function (res) {
      return res.data;
    })
  }

  function printGroupContent(group_id, groupName) {
    var emailRegex = new Regex(/.*[@].*[.].*/, 'g');
    if(emailRegex.test(currentUser.email)){
      console.log("valid email");
    } else {
      //prompt a user to update their email
      console.log("invalid email");
    }
    var data = {
      group_id: group_id,
      user_id: currentUser.user_id,
      groupName: groupName,
      user_email: currentUser.email
    }
    var url = API_URL + '/printGroupContent'
    return $http.post(url, data).then(function (res) {
      return res.data;
    })
  }

  function deleteGroup(group_id) {
    var url = API_URL + '/deleteGroup';
    var data = {
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
    var url = API_URL + '/broadcastSearch/' + currentUser.user_id;
    return $http.get(url).then(function (res) {
      console.log("updated search broadcast data", res);
      searchBroadcastObjects = res.data;
      return searchBroadcastObjects;
    })
  }

  function subscribeToBroadcast(broadcast_id) {
    var url = API_URL + '/subscribeToBroadcast';
    var data = {
      user_id: currentUser.user_id,
      broadcast_id: broadcast_id
    }
    return $http.post(url, data).then(function (res) {
      return res.data;
    })
  }

  function unsubscribeToBroadcast(broadcast_id) {
    var url = API_URL + '/unSubscribeFromBroadcast';
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
    var url = API_URL + '/updateNotificationSettings';
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
    var url = API_URL + '/updateMessageNotificationSettings';
    var data = {
      user_id: currentUser.user_id,
      messaging: messaging
    }
    return $http.post(url, data).then(function (res) {
      return res;
    })
  }

  function updateGroupNotificationSettings(group) {
    var url = API_URL + '/updateGroupNotificationSettings';
    var data = {
      user_id: currentUser.user_id,
      group: group
    }
    return $http.post(url, data).then(function (res) {
      return res;
    })
  }

  function updateBroadcastNotificationSettings(broadcast) {
    var url = API_URL + '/updateBroadcastNotificationSettings';
    var data = {
      user_id: currentUser.user_id,
      broadcast: broadcast
    }
    return $http.post(url, data).then(function (res) {
      return res;
    })
  }

  function markAccountAsSetUp(user_id) {
    var url = API_URL + '/markAccountAsSetUp';
    var data = {
      user_id: user_id
    }
    return $http.post(url, data).then(function (res) {
      return res.data;
    })
  }

  function updateDeviceToken(token) {
    var url = API_URL + '/updateDeviceToken';
    var data = {
      user_id: currentUser.user_id,
      device_token: token,
    }
    return $http.post(url, data).then(function (res) {
      return res.data;
    })
  }

  function versionCheck() {
    var url = API_URL + '/versionCheck/' + CLIENT_VERSION;
    return $http.get(url).then(function (res) {
      return res.data;
    })
  }

  function logIn(phone) {
    console.log("logging in");
    var data = {};
    data.phone = phone;

    data.device_token = $localStorage.tokenObject.token;
    data.version = CLIENT_VERSION;

    var url = API_URL + '/logIn';
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
    var url = API_URL + '/logOut';
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
    uploadChatPhoto: uploadChatPhoto,
    uploadGroupChatPhoto: uploadGroupChatPhoto,
    uploadPersonalProfilePhoto: uploadPersonalProfilePhoto,
    uploadGroupProfilePhoto: uploadGroupProfilePhoto
  }

  //Production
  // var API_URL = 'https://whinny-server.herokuapp.com';
  //Staging
  var API_URL = 'https://whinny-staging.herokuapp.com';
  //local
  // var API_URL = 'http://localhost:3000';

  return photoFactory;

  function uploadChatPhoto(fileName, fileURI) {
    var uri = encodeURI(API_URL + '/chatMessageUpload');
    var options = new FileUploadOptions();

    options.fileKey = "file";
    options.fileName = fileName;
    options.mimeType = "text/plain";
    options.ACL = 'public-read';

    var ft = new FileTransfer();
    return ft.upload(fileURI, uri, onSuccess, onError, options);

    function onSuccess(res) {
      console.log("successful file upload", res);
    }

    function onError(err) {
      console.log("error in the file upload", err);
    }
  }

  function uploadGroupChatPhoto(fileName, fileURI) {
    var uri = encodeURI(API_URL + '/groupMessageUpload');
    var options = new FileUploadOptions();

    options.fileKey = "file";
    options.fileName = fileName;
    options.mimeType = "text/plain";
    options.ACL = 'public-read';

    var ft = new FileTransfer();
    return ft.upload(fileURI, uri, onSuccess, onError, options);

    function onSuccess(res) {
      console.log("successful file upload", res);
    }

    function onError(err) {
      console.log("error in the file upload", err);
    }
  }

  function uploadGroupProfilePhoto(fileName, fileURI) {
    var uri = encodeURI(API_URL + '/groupProfilePhotoUpload');
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
      console.log("successful file upload", res);
    }

    function onError(err) {
      console.log("error in the file upload", err);
    }

  }

  function uploadPersonalProfilePhoto(fileName, fileURI) {
    console.log("uploading personal photo in service");
    var uri = encodeURI(API_URL + '/personalProfilePhotoUpload');
    var options = new FileUploadOptions();

    options.fileKey = "file";
    options.fileName = fileName;
    options.mimeType = "text/plain";
    options.ACL = 'public-read';

    var ft = new FileTransfer();
    return ft.upload(fileURI, uri, onSuccess, onError, options);

    function onSuccess(res) {
      console.log("successful file upload", res);
    }

    function onError(err) {
      console.log("error in the file upload", err);
    }
  }

}])
