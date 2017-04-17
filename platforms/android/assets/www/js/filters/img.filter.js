(function() {
  'use strict';

  var emojiRegex = new RegExp(':(img.*):', 'g');
  // var emojiRegex = new RegExp(emojis.join('|'), 'g');

  angular.module('app').filter('imageFilter', ['$filter', function ($filter) {
    return function (input) {
      if(input){
        return input.replace(emojiRegex, function (match, text) {
          var imgSource = match.substring(4, match.length-1);
          return '<img class="chatImage" preload-image src="'+ imgSource + ' ng-click="showModal('+ imgSrouce + ')"">';
        });
      }
    };
  }]);
}());
