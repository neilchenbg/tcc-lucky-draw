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
      for (var i = 0, length = _storage.length; i < length; i ++) {
        if (_storage[i].id == id) {
          return _storage[i];
        }
      }

      return undefined;
    };

    var add = function(name) {
      _storage.push({
        id: new Date().getTime(),
        name: name,
        join: true
      });
      _sync();
    };

    var edit = function(id, data) {
      for (var i = 0, length = _storage.length; i < length; i ++) {
        if (_storage[i].id == id) {
          _storage[i] = _.extend(_storage[i], data, {
            id: id
          });
          _sync();
          return true;
        }
      }

      return undefined;
    };

    var remove = function(id) {
      var newList = [];

      for (var i = 0, length = _storage.length; i < length; i ++) {
        if (_storage[i].id == id) {
          continue;
        }

        newList.push(_storage[i]);
      }

      _storage = newList;
      _sync();
    };

    var clear = function() {
      _storage = [];
      _sync();
    };

    var hasList = function() {
      return _storage.length > 0;
    };

    return {
      getList: getList,
      get: get,
      add: add,
      edit: edit,
      remove: remove,
      clear: clear,
      hasList: hasList
    };
  }
);