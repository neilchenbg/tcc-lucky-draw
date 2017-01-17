require.config({
  paths: {
    'underscore': 'vendor/underscore-min',
    'backbone': 'vendor/backbone-min',
    'backbone/localstorage': 'vendor/backbone.localStorage-min',
    'mustache': 'vendor/mustache.min',
    'jquery': 'vendor/jquery.min',
    'store2': 'vendor/store2.min'
  },
  map: {
    '*': {
      'require-css': 'vendor/require-js/css.min',
      'require-i18n': 'vendor/require-js/i18n.min',
      'require-text': 'vendor/require-js/text.min'
    }
  },
  shim : {},
  config: {
    // i18n: {locale: 'zh-CN'}
  },
  urlArgs: "ts=" + (new Date()).getTime()
});

if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

if (!Array.prototype.shuffle) {
  Array.prototype.shuffle = function() {
    var input = this;
    for (var i = input.length - 1; i >= 0; i--) {
      var randomIndex = Math.floor(Math.random() * (i + 1));
      var itemAtIndex = input[randomIndex];
      input[randomIndex] = input[i];
      input[i] = itemAtIndex;
    }
    return input;
  };
}