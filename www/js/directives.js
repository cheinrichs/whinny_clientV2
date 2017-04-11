angular.module('app.directives', [])

.directive('showFocus', ['$timeout', function($timeout) {
  return function(scope, element, attrs) {
    scope.$watch(attrs.showFocus,
      function (newValue) {
        $timeout(function() {
            newValue && element[0].focus();
            console.log("focusing");
        }, 200);
      }, true);
  };
}])

.directive('emojiInput', function ($timeout) {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function ($scope, $el, $attr, ngModel) {
        $.emojiarea.path = 'img/emoji/';
        $.emojiarea.icons = {
            ':HappyFace:': 'HappyFace.png',
            ':LayingHorse:': 'LayingHorse.png',
            ':AngryFace:': 'AngryFace.png',
            ':BuckingHorse:': 'BuckingHorse.png',
            ':Pony:': 'Pony.png',
            ':ArabianHorse:': 'ArabianHorse.png',
            ':JumpingHorse:': 'JumpingHorse.png',
            ':BarrelHorse:': 'BarrelHorse.png',
            ':TrailHorse:': 'TrailHorse.png',
            ':ReiningHorse:': 'ReiningHorse.png',
            ':PoloPony:': 'PoloPony.png',
            ':RacingHorses:': 'RacingHorses.png',
            ':MareAndFoal:': 'MareAndFoal.png',
            ':HunterHorse:': 'HunterHorse.png',
            ':GrazingHorse:': 'GrazingHorse.png',
            ':DrivingHorse:': 'DrivingHorse.png',
            ':DressageHorse:': 'DressageHorse.png',
            ':EventingHorse:': 'EventingHorse.png',
            ':PaddockHorse:': 'PaddockHorse.png',
            ':Ribbon:': 'Ribbon.png',
            ':LegBandages:': 'LegBandages.png',
            ':VetSymbol:': 'VetSymbol.png',
            ':Blanket:': 'Blanket.png',
            ':Brush:': 'Brush.png',
            ':HoofPick:': 'HoofPick.png',
            ':EnglishSaddle:': 'EnglishSaddle.png',
            ':WesternSaddle:': 'WesternSaddle.png',
            ':Bucket:': 'Bucket.png',
            ':Wheelbarrow:': 'Wheelbarrow.png',
            ':Pitchfork:': 'Pitchfork.png',
            ':Corgi:': 'Corgi.png',
            ':Fly:': 'Fly.png',
            ':GolfCart:': 'GolfCart.png',
            ':JackRussell:': 'JackRussell.png',
            ':Tractor:': 'Tractor.png',
            ':Harrow:': 'Harrow.png',
            ':HayBale:': 'HayBale.png',
            ':Trailer:': 'Trailer.png',
            ':HorseShoe:': 'HorseShoe.png',
            ':Carrot:': 'Carrot.png'
        };
        var options = $scope.$eval($attr.emojiInput);
        var $wysiwyg = $($el[0]).emojiarea(options);
        $wysiwyg.on('change', function () {
            ngModel.$setViewValue($wysiwyg.val());
            $scope.$apply();
        });
        ngModel.$formatters.push(function (data) {
            // emojiarea doesn't have a proper destroy :( so we have to remove and rebuild
            $wysiwyg.siblings('.emoji-wysiwyg-editor, .emoji-button').remove();
            $timeout(function () {
                $wysiwyg.emojiarea(options);
            }, 0);
            return data;
      });
    }
  };
})

.directive('focusMe', function($timeout) {
  return {
    link: function(scope, element, attrs) {
      $timeout(function() {
        element[0].focus();
        console.log('focus 2');
      }, 150);
    }
  };
})

.directive('file', function() {
  return {
    restrict: 'AE',
    scope: {
      file: '@'
    },
    link: function(scope, el, attrs){
      el.bind('change', function(event){
        var files = event.target.files;
        var file = files[0];
        scope.file = file;
        scope.$parent.file = file;
        scope.$apply();
      });
    }
  };
})


/* angularjs Scroll Glue
 * version 2.0.7
 * https://github.com/Luegg/angularjs-scroll-glue
 * An AngularJs directive that automatically scrolls to the bottom of an element on changes in it's scope.
*/

// Allow module to be loaded via require when using common js. e.g. npm
if(typeof module === "object" && module.exports){
    module.exports = 'luegg.directives';
}

(function(angular, undefined){
    'use strict';

    function createActivationState($parse, attr, scope){
        function unboundState(initValue){
            var activated = initValue;
            return {
                getValue: function(){
                    return activated;
                },
                setValue: function(value){
                    activated = value;
                }
            };
        }

        function oneWayBindingState(getter, scope){
            return {
                getValue: function(){
                    return getter(scope);
                },
                setValue: function(){}
            };
        }

        function twoWayBindingState(getter, setter, scope){
            return {
                getValue: function(){
                    return getter(scope);
                },
                setValue: function(value){
                    if(value !== getter(scope)){
                        scope.$apply(function(){
                            setter(scope, value);
                        });
                    }
                }
            };
        }

        if(attr !== ""){
            var getter = $parse(attr);
            if(getter.assign !== undefined){
                return twoWayBindingState(getter, getter.assign, scope);
            } else {
                return oneWayBindingState(getter, scope);
            }
        } else {
            return unboundState(true);
        }
    }

    function createDirective(module, attrName, direction){
        module.directive(attrName, ['$parse', '$window', '$timeout', function($parse, $window, $timeout){
            return {
                priority: 1,
                restrict: 'A',
                link: function(scope, $el, attrs){
                    var el = $el[0],
                        activationState = createActivationState($parse, attrs[attrName], scope);

                    function scrollIfGlued() {
                        if(activationState.getValue() && !direction.isAttached(el)){
                            direction.scroll(el);
                        }
                    }

                    function onScroll() {
                        activationState.setValue(direction.isAttached(el));
                    }

                    scope.$watch(scrollIfGlued);

                    $timeout(scrollIfGlued, 0, false);

                    $window.addEventListener('resize', scrollIfGlued, false);

                    $el.on('scroll', onScroll);


                    // Remove listeners on directive destroy
                    $el.on('$destroy', function() {
                        $el.unbind('scroll', onScroll);
                    });

                    scope.$on('$destroy', function() {
                        $window.removeEventListener('resize', scrollIfGlued, false);
                    });
                }
            };
        }]);
    }

    var bottom = {
        isAttached: function(el){
            // + 1 catches off by one errors in chrome
            return el.scrollTop + el.clientHeight + 1 >= el.scrollHeight;
        },
        scroll: function(el){
            el.scrollTop = el.scrollHeight;
        }
    };

    var top = {
        isAttached: function(el){
            return el.scrollTop <= 1;
        },
        scroll: function(el){
            el.scrollTop = 0;
        }
    };

    var right = {
        isAttached: function(el){
            return el.scrollLeft + el.clientWidth + 1 >= el.scrollWidth;
        },
        scroll: function(el){
            el.scrollLeft = el.scrollWidth;
        }
    };

    var left = {
        isAttached: function(el){
            return el.scrollLeft <= 1;
        },
        scroll: function(el){
            el.scrollLeft = 0;
        }
    };

    var module = angular.module('luegg.directives', []);

    createDirective(module, 'scrollGlue', bottom);
    createDirective(module, 'scrollGlueTop', top);
    createDirective(module, 'scrollGlueBottom', bottom);
    createDirective(module, 'scrollGlueLeft', left);
    createDirective(module, 'scrollGlueRight', right);
}(angular));
