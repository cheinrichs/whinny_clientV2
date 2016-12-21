(function() {
  'use strict';

  angular.module('app').filter('nameShortener', ['$filter', function ($filter) {
    return function (input) {
      if(input){
        if(input.length > 12){
          return input.substring(0, 12) + '...';
        } else {
          return input;
        }
      } else {
        return;
      }
    };
  }]);
}());
