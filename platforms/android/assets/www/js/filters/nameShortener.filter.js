(function() {
  'use strict';

  angular.module('app').filter('nameShortener', ['$filter', function ($filter) {
    return function (input) {
      if(input){
        if(input.length > 40){
          return input.substring(0, 40) + '...';
        } else {
          return input;
        }
      } else {
        return;
      }
    };
  }]);
}());
