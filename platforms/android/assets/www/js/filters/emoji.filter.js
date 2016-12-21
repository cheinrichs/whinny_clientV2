(function() {
  'use strict';

  var emojis = [
    'HappyFace',
    'LayingHorse',
    'AngryFace',
    'BuckingHorse',
    'ShetlandPony',
    'ArabianHorse',
    'JumpingHorse',
    'BarrelHorse',
    'TrailHorse',
    'ReiningHorse',
    'PoloPony',
    'RacingHorses',
    'MareAndFoal',
    'HunterHorse',
    'GrazingHorse',
    'DrivingHorse',
    'DressageHorse',
    'EventingHorse',
    'HorsePaddock',
    'Ribbon',
    'LegBandages',
    'VetSymbol',
    'Blanket',
    'Brush',
    'HoofPick',
    'EnglishSaddle',
    'WesternSaddle',
    'Bucket',
    'Wheelbarrow',
    'Pitchfork',
    'CorgiDog',
    'Fly',
    'GolfCart',
    'JackRussellDog',
    'Tractor',
    'Harrow',
    'HayBale',
    'Trailer',
    'HorseShoe',
    'Carrot'
  ];

  var emojiRegex = new RegExp(':(' + emojis.join('|') + '):', 'g');

  angular.module('app').filter('emoji', ['$filter', function ($filter) {
    return function (input) {
      return input.replace(emojiRegex, function (match, text) {
        return '<img class="emoji" src="img/emoji/'+ text + '.png">';
      });
    };
  }]);
}());
