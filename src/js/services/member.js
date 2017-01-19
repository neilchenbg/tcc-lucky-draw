define('services/member',
  ['inc', 'jquery', 'store2', 'services/random', 'services/setting'],
  function(Inc, $, Store2, ServiceRandom, ServiceSetting) {
    "use strict";

    if (!Store2.has('_member')) {
      Store2.set('_member', []);
    }

    var _storage = Store2.get('_member');

    var _sync = function() {
      Store2.set('_member', _storage);
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

    var getJoinMemberList = function() {
      var newList = [];

      for (var i = 0, length = _storage.length; i < length; i ++) {
        if (_storage[i].join) {
          newList.push(_storage[i]);
        }
      }

      return newList;
    };

    var getJoinMemberCount = function() {
      var count = 0;

      for (var i = 0, length = _storage.length; i < length; i ++) {
        if (_storage[i].join) {
          count ++;
        }
      }

      return count;
    };
    // 取得入圍人數
    var getNomineesCount = function() {
      var joinMemberCount = getJoinMemberCount(),
          nomineesCount = 0;

      nomineesCount = Math.ceil(joinMemberCount / 2);

      if (nomineesCount > Inc.MAX_NOMINEES_COUNT) {
        nomineesCount = Inc.MAX_NOMINEES_COUNT;
      }

      return nomineesCount;
    };
    // 取得入圍人列表
    var getNomineesMembers = function() {
      var joinMemberList = getJoinMemberList(),
          nomineesCount = getNomineesCount(),
          nomineesMembers = [],
          nomineesDestiny = [];

      for (var i = 0; i < 10; i ++) {
        nomineesDestiny.push(ServiceRandom.shuffleArray(_.clone(joinMemberList)));
      }

      var start = ServiceRandom.getInteger(0, 9),
          end = start + 1;

      nomineesDestiny = nomineesDestiny.slice(start, end)[0];
      nomineesMembers = nomineesDestiny.slice(0, nomineesCount);

      return nomineesMembers;
    };
    // 取得抽獎按鈕
    var getLuckyDrawButtons = function() {
      var nomineesCount = getNomineesCount(),
          winnerCount = 1,
          luckyDrawButtons = [];

      if (ServiceSetting.get('random')) {
        winnerCount = ServiceRandom.getInteger(1, nomineesCount);
      }

      for (var i = 1; i <= nomineesCount; i ++) {
        if (i <= winnerCount) {
          luckyDrawButtons.push({isWinner: true, active: false});
        } else {
          luckyDrawButtons.push({isWinner: false, active: false});
        }
      }

      luckyDrawButtons = ServiceRandom.shuffleArray(luckyDrawButtons);

      for (var i = 0, length = luckyDrawButtons.length; i < length; i ++) {
        luckyDrawButtons[i].key = i + 1;
      }

      return luckyDrawButtons;
    };

    return {
      getList: getList,
      get: get,
      add: add,
      edit: edit,
      remove: remove,
      clear: clear,
      hasList: hasList,
      getJoinMemberList: getJoinMemberList,
      getJoinMemberCount: getJoinMemberCount,
      getNomineesMembers: getNomineesMembers,
      getLuckyDrawButtons: getLuckyDrawButtons
    };
  }
);