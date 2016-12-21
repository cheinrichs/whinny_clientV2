(function() {
  'use strict';

  angular.module('app').filter('unread', ['$filter', function ($filter) {
    console.log("unread filter");
    return function (input) {
      console.log(input);
      return input;
    };
  }]);
}());
