(function() {
  'use strict';

  var emojis = [
    '午```',
    'LayingHorse',
    'AngryFace',
    'BuckingHorse',
    'Pony',
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
    'PaddockHorse',
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
    'Corgi',
    'Fly',
    'GolfCart',
    'JackRussell',
    'Tractor',
    'Harrow',
    'HayBale',
    'Trailer',
    'HorseShoe',
    'Carrot'
  ];

  // var emojiRegex = new RegExp(':(' + emojis.join('|') + '):', 'g');
  var emojiRegex = new RegExp(emojis.join('|'), 'g');

  angular.module('app').filter('emoji', ['$filter', function ($filter) {
    return function (input) {
      if(input){
        return input.replace(emojiRegex, function (match, text) {
          return '<img class="emoji" src="img/emoji/'+ match[0] + '.png">';
        });
      }
    };
  }]);
}());
