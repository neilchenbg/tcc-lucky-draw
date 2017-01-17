define('view/app',
  [
    'bh/view/base', 'services/member',
    'require-i18n!nls/view.app',
    'require-text!tpls/app.html',
    'require-text!tpls/components/joinMembers.html',
    'require-text!tpls/components/luckyDrawButtons.html',
    'require-text!tpls/components/nominateMembers.html',
    'require-css!css/style.css'
  ],
  function(BhViewBase, ServiceMember, I18n, htmlMain, htmlJoinMembers, htmlLuckyDrawButtons, htmlNominateMembers) {
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
          ._setComponent('joinMembers', htmlJoinMembers)
          ._setComponent('luckyDrawButtons', htmlLuckyDrawButtons)
          ._setComponent('nominateMembers', htmlNominateMembers)
          .render()
          .renderComponent('joinMembers')
          .renderComponent('luckyDrawButtons')
          .renderComponent('nominateMembers');
      }
    });
  }
);