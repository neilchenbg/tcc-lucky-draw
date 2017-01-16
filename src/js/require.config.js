require.config({
  paths: {
    'underscore': 'vendor/underscore-min',
    'backbone': 'vendor/backbone-min',
    'mustache': 'vendor/mustache.min',
    'jquery': 'vendor/jquery.min'
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
  }
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