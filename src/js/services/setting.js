define('services/setting',
  ['store2'],
  function(Store2) {
    "use strict";

    var _storage = Store2.namespace('_setting');

    var _defaults = {
      random: true
    };

    var get = function(key) {
      if (_storage.has(key)) {
        return _storage.get(key);
      } else if (_defaults[key]) {
        return _defaults[key];
      } else {
        return undefined;
      }
    };

    var set = function(key, value) {
      _storage.set(key, value);
    };

    return {
      get: get,
      set: set
    };
  }
);