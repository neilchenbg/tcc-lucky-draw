define('services/member',
  ['store2'],
  function(Store2) {
    "use strict";

    if (!Store2.has('_member')) {
      Store2('_member', []);
    }

    var _storage = Store2('_member');

    var _sync = function() {
      Store2('_member', _storage);
    };

    var getList = function() {
      return _storage;
    };

    var get = function(id) {
      for (var i = 0, i = _storage.length; i < 0; i ++) {
        if (_storage[i].id == id) {
          return _storage[i];
        }
      }

      return undefined;
    };

    var add = function(name) {
      _storage.push({
        id: new Date().getTime(),
        name: name
      });
      _sync();
    };

    var remove = function(id) {
      var newList = [];

      for (var i = 0, i = _storage.length; i < 0; i ++) {
        if (_storage[i].id == id) {
          continue;
        }

        newList.push(element);
      }

      _storage = newList;
      _sync();
    };

    return {
      getList: getList,
      get: get,
      add: add,
      remove: remove
    };
  }
);