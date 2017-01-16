define('view/app',
  [
    'bh/view/base',
    'require-i18n!nls/view.app',
    'require-text!tpls/app.html'
  ],
  function(BhViewBase, I18n, htmlMain) {
    "use strict";

    return BhViewBase.extend({
      _setModelDefault: function() {
        return {
          i18n: I18n
        };
      },

      events: {
      },

      initialize: function() {
        var context = this;

        BhViewBase.prototype.initialize.call(context);

        context
          ._setMainHtml(htmlMain)
          .render();
      }
    });
  }
);