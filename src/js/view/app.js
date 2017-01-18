define('view/app',
  [
    'inc', 'bh/view/base', 'bh/util/log', 'services/ui', 'services/member', 'services/setting',
    'require-i18n!nls/view.app',
    'require-text!tpls/app.html',
    'require-text!tpls/components/joinMembers.html',
    'require-text!tpls/components/luckyDrawButtons.html',
    'require-text!tpls/components/nominateMembers.html',
    'require-text!tpls/components/nominees.html',
    'require-css!css/style.css'
  ],
  function(
    Inc, BhViewBase, BhUtilLog, ServiceUi, ServiceMember, ServiceSetting,
    I18n,
    htmlMain,
    htmlJoinMembers,
    htmlLuckyDrawButtons,
    htmlNominateMembers,
    htmlNominees
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
          },
          nominees: {
            animate: false,
            processing: false
          },
          nominateMembers: {
            show: false,
            list: []
          },
          luckyDrawButtons: {
            show: false,
            list: []
          }
        };
      },

      _evAddMember: function(e, $button) {
        var context = this,
            model = context.getModelInstance(),
            $form = $button.parents('form[data-bh-entry="addMemberForm"]').eq(0),
            $field = $('input[data-bh-entry="memberName"]', $form);

        if ($form.length > 0 && $field.length > 0) {
          if ($field.val() != '') {
            ServiceMember.add($field.val());
            model
              .set('joinMembers', {
                hasList: ServiceMember.hasList(),
                list: ServiceMember.getList()
              })
              .trigger('change:joinMembers');
            ServiceUi.showAlert(I18n.SUCCESS_ADD_MEMBER.format($field.val()));
          } else {
            ServiceUi.showAlert(I18n.ERROR_ADD_MEMBER);
          }
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
        ServiceSetting.set('random', $button.prop('checked') ? false : true);
      },

      _evNominees: function(e, $button) {
        var context = this,
            model = context.getModelInstance(),
            memberCount = ServiceMember.getJoinMemberCount(),
            buttonMax = 0;

        if (memberCount < 2) {
          ServiceUi.showAlert(I18n.ERROR_JOIN_MEMBER_COUNT);
        } else {
          model.set('nominees', {
            animate: true,
            processing: true
          });

          buttonMax = Math.floor(memberCount / 2);

          if (buttonMax > Inc.MAX_NOMINEES_COUNT) {
            buttonMax = Inc.MAX_NOMINEES_COUNT;
          }

          var joinMemberList = ServiceMember.getJoinMemberList(),
              nominateMembers = [],
              destiny = [];

          for (var i = 0; i < 10; i ++) {
            destiny.push(_.clone(joinMemberList).shuffle());
          }

          destiny = destiny.shuffle().slice(0, 1)[0];
          nominateMembers = destiny.slice(0, buttonMax);

          setTimeout(function() {
            model.set('nominees', {
              animate: false,
              processing: true
            });
            model.set('nominateMembers', {
              show: true,
              list: nominateMembers
            });
          }, Inc.NOMINEES_ANIMATE_SEC * 1000)
          
          if (ServiceSetting.get('random')) {
            
          } else {
            
          }
        }
      },

      _evRefreshNominees: function(e, $button) {
        var context = this,
            model = context.getModelInstance();
        model.set('nominees', {
          animate: false,
          processing: false
        });
        model.set('nominateMembers', {
          show: false,
          list: []
        });
        model.set('luckyDrawButtons', {
          loaded: false,
          list: []
        });
      },

      _evToggleSetting: function(e, $button) {
        var context = this,
            $setting = $('[data-bh-entry="toggleSetting"]', context.el);

        $setting.each(function() {
          if ($(this).hasClass('container')) {
            if ($(this).hasClass('open-setting')) {
              $(this).removeClass('open-setting');
            } else {
              $(this).addClass('open-setting');
            }
          } else {
            if ($(this).hasClass('active')) {
              $(this).removeClass('active');
            } else {
              $(this).addClass('active');
            }
          }
        });
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
        },
        'click [data-bh-func="RefreshNominees"]': function(e) {
          e.stopPropagation();
          this._evRefreshNominees(e, $(e.currentTarget));
        },
        'click [data-bh-func="ToggleSetting"]': function(e) {
          e.stopPropagation();
          this._evToggleSetting(e, $(e.currentTarget));
        }
      },

      initialize: function() {
        var context = this;

        BhViewBase.prototype.initialize.call(context);

        var model = context.getModelInstance();

        context.listenTo(model, 'change:joinMembers', function() {
          context.renderComponent('joinMembers');
        });

        context.listenTo(model, 'change:nominees', function() {
          context.renderComponent('nominees');
        });

        context.listenTo(model, 'change:nominateMembers', function() {
          context.renderComponent('nominateMembers');
        });

        context
          ._setMainHtml(htmlMain)
          ._setComponent('joinMembers', htmlJoinMembers)
          ._setComponent('luckyDrawButtons', htmlLuckyDrawButtons)
          ._setComponent('nominateMembers', htmlNominateMembers)
          ._setComponent('nominees', htmlNominees)
          .render()
          .renderComponent('joinMembers')
          .renderComponent('luckyDrawButtons')
          .renderComponent('nominateMembers')
          .renderComponent('nominees');
      }
    });
  }
);