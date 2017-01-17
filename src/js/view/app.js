define('view/app',
  [
    'inc', 'bh/view/base', 'bh/util/log', 'services/ui', 'services/member', 'services/setting',
    'require-i18n!nls/view.app',
    'require-text!tpls/app.html',
    'require-text!tpls/components/joinMembers.html',
    'require-text!tpls/components/luckyDrawButtons.html',
    'require-text!tpls/components/nominateMembers.html',
    'require-css!css/style.css'
  ],
  function(
    Inc, BhViewBase, BhUtilLog, ServiceUi, ServiceMember, ServiceSetting,
    I18n,
    htmlMain,
    htmlJoinMembers,
    htmlLuckyDrawButtons,
    htmlNominateMembers
  ) {
    "use strict";

    var _traceError = function(logMsg, logArgs, logFunc) {
      BhUtilLog.traceError(logMsg, logArgs, 'view/app', logFunc);
    };

    return BhViewBase.extend({
      _setModelDefault: function() {
        return {
          i18n: I18n,
          settingRandom: ServiceSetting.get('random'),
          joinMembers: {
            hasList: ServiceMember.hasList(),
            list: ServiceMember.getList()
          }
        };
      },

      _evAddMember: function(e, $button) {
        var context = this,
            model = context.getModelInstance(),
            $form = $button.parents('form[data-bh-entry="addMemberForm"]').eq(0),
            $field = $('input[data-bh-entry="memberName"]', $form);

        if ($form.length > 0 && $field.length > 0) {
          ServiceMember.add($field.val());
          model
            .set('joinMembers', {
              hasList: ServiceMember.hasList(),
              list: ServiceMember.getList()
            })
            .trigger('change:joinMembers');
          ServiceUi.showAlert(I18n.SUCCESS_ADD_MEMBER.format($field.val()));
        } else {
          _traceError('Unable to find form field!', {}, '_evAddMember');
        }
      },

      _evToggleJoin: function(e, $button) {
        var context = this,
            model = context.getModelInstance(),
            memberId = $button.data('bhParamId');

        ServiceUi.showConfirm(
          $button.prop('checked') ? I18n.CONFIRM_ADD_JOIN_MEMBER : I18n.CONFIRM_REMOVE_JOIN_MEMBER,
          function() {
            if (ServiceMember.edit(memberId, {join: $button.prop('checked')})) {
              model
                .set('joinMembers', {
                  hasList: ServiceMember.hasList(),
                  list: ServiceMember.getList()
                })
                .trigger('change:joinMembers');
            } else {
              e.preventDefault();
              _traceError('Unable to find member: ' + memberId, {}, '_evToggleJoin');
              ServiceUi.showAlert(I18n.ERROR_MEMBER_NOTFOUND.format(memberId));
            }
          },
          {cancelCallback: function() {
            e.preventDefault();
          }}
        );
      },

      _evRemoveMember: function(e, $button) {
        var context = this,
            model = context.getModelInstance(),
            memberId = $button.data('bhParamId');

        ServiceUi.showConfirm(I18n.CONFIRM_REMOVE_MEMBER, function() {
          ServiceMember.remove(memberId);
          model
            .set('joinMembers', {
              hasList: ServiceMember.hasList(),
              list: ServiceMember.getList()
            })
            .trigger('change:joinMembers');
          ServiceUi.showAlert(I18n.SUCCESS_REMOVE_MEMBER);
        });
      },

      _evToggleSettingRandom: function(e, $button) {
        var context = this,
            model = context.getModelInstance();

        ServiceSetting.set('random', $button.prop('checked'));
        model.set('settingRandom', ServiceSetting.get('random'));
      },

      _evNominees: function(e, $button) {
        var memberCount = ServiceMember.getJoinMemberCount(),
            buttonMax = 0;

        if (memberCount < 2) {
          ServiceUi.showAlert(I18n.ERROR_JOIN_MEMBER_COUNT);
        } else {
          buttonMax = Math.floor(memberCount / 2);

          if (buttonMax > Inc.MAX_NOMINEES_COUNT) {
            buttonMax = Inc.MAX_NOMINEES_COUNT;
          }

          var joinMemberList = ServiceMember.getJoinMemberList().shuffle();
          
          if (ServiceSetting.get('random')) {
            
          }
        }
      },

      events: {
        'click [data-bh-func="AddMember"]': function(e) {
          e.stopPropagation();
          this._evAddMember(e, $(e.currentTarget));
        },
        'click [data-bh-func="ToggleJoin"][data-bh-param-id]': function(e) {
          e.stopPropagation();
          this._evToggleJoin(e, $(e.currentTarget));
        },
        'click [data-bh-func="removeMember"][data-bh-param-id]': function(e) {
          e.stopPropagation();
          this._evRemoveMember(e, $(e.currentTarget));
        },
        'click [data-bh-func="ToogleSettingRandom"]': function(e) {
          e.stopPropagation();
          this._evToggleSettingRandom(e, $(e.currentTarget));
        },
        'click [data-bh-func="Nominees"]': function(e) {
          e.stopPropagation();
          this._evNominees(e, $(e.currentTarget));
        }
      },

      initialize: function() {
        var context = this;

        BhViewBase.prototype.initialize.call(context);

        var model = context.getModelInstance();

        context.listenTo(model, 'change:joinMembers', function() {
          context.renderComponent('joinMembers');
        });

        context.listenTo(model, 'change:settingRandom', function() {
          context.renderComponent('joinMembers');
        });

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