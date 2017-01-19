define('services/random',
  ['underscore', 'chance', 'services/setting'],
  function(_, Chance, ServiceSetting) {
    "use strict";

    var _instance = new Chance(ServiceSetting.get('randomSeed'));

    var _defaults = {
      random: true
    };

    var getInteger = function(min, max) {
      return _instance.integer({min: min, max: max});
    };

    var shuffleArray = function(input) {
      if (_.isArray(input)) {
        for (var i = input.length - 1; i >= 0; i--) {
          var randomIndex = getInteger(0, i);
          var itemAtIndex = input[randomIndex];
          input[randomIndex] = input[i];
          input[i] = itemAtIndex;
        }

        return input;
      } else {
        return input;
      }
    };

    return {
      getInteger: getInteger,
      shuffleArray: shuffleArray
    };
  }
);