(function() {
  'use strict';

  angular.module('app').filter('messageShortener', ['$filter', function ($filter) {
    return function (input) {
      if(input){
        if(input.length > 30){
          return input.substring(0, 30) + '...';
        } else {
          return input;
        }
      } else {
        return;
      }
    };
  }]);
}());
