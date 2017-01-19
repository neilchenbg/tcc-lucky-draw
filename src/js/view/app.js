define('view/app',
  [
    'inc', 'bh/view/base', 'bh/util/log', 'services/ui', 'services/member', 'services/setting', 'services/random',
    'require-i18n!nls/view.app',
    'require-text!tpls/app.html',
    'require-text!tpls/components/joinMembers.html',
    'require-text!tpls/components/luckyDrawButtons.html',
    'require-text!tpls/components/nomineesMembers.html',
    'require-text!tpls/components/nominees.html'
  ],
  function(
    Inc, BhViewBase, BhUtilLog, ServiceUi, ServiceMember, ServiceSetting, ServiceRandom,
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
          settingRandomSeed: ServiceSetting.get('randomSeed'),
          joinMembers: {
            hasList: ServiceMember.hasList(),
            list: ServiceMember.getList()
          },
          nominees: {
            animate: false,
            processing: false
          },
          nomineesMembers: {
            show: false,
            list: []
          },
          luckyDrawButtons: {
            active: 0,
            show: false,
            showWinner: false,
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
        model.set('settingRandom', ServiceSetting.get('random'));
      },

      _evSaveSettingRandomSeed: function(e, $button) {
        var context = this,
            model = context.getModelInstance(),
            $form = $button.parents('[data-bh-entry="randomSeedForm"]').eq(0),
            $field = $('[data-bh-entry="randomSeed"]', $form);

        if ($form.length > 0 && $field.length > 0) {
          if ($field.val() != '') {
            var seed = $field.val() + '-' + new Date().getTime();

            ServiceSetting.set('randomSeed', seed);
            ServiceRandom.setSeed(seed);
            ServiceUi.showAlert(I18n.SUCCESS_EDIT_RANDOM_SEED);

            model.set('settingRandomSeed', ServiceSetting.get('randomSeed'));
          } else {
            ServiceUi.showAlert(I18n.ERROR_EDIT_RANDOM_SEED);
          }
        } else {
          _traceError('Unable to find form field!', {}, '_evSaveSettingRandomSeed');
        }
      },

      _evClearSettingRandomSeed: function(e, $button) {
        var context = this,
            model = context.getModelInstance(),
            $form = $button.parents('[data-bh-entry="randomSeedForm"]').eq(0),
            $field = $('[data-bh-entry="randomSeed"]', $form);

        if ($form.length > 0 && $field.length > 0) {
          $field.val('');
        } else {
          _traceError('Unable to find form field!', {}, '_evClearSettingRandomSeed');
        }
      },

      _evNominees: function(e, $button) {
        var context = this,
            model = context.getModelInstance(),
            memberCount = ServiceMember.getJoinMemberCount();

        if (memberCount < 2) {
          ServiceUi.showAlert(I18n.ERROR_JOIN_MEMBER_COUNT);
        } else {
          model.set('nominees', {
            animate: true,
            processing: true
          });

          var nomineesMembers = ServiceMember.getNomineesMembers(),
              luckyDrawButtons = ServiceMember.getLuckyDrawButtons();

          setTimeout(function() {
            model.set('nominees', {
              animate: false,
              processing: true
            });
            model.set('nomineesMembers', {
              show: true,
              list: nomineesMembers
            });
            model.set('luckyDrawButtons', {
              active: 0,
              show: true,
              showWinner: false,
              list: luckyDrawButtons
            });
          }, Inc.NOMINEES_ANIMATE_SEC * 1000)
        }
      },

      _evRefreshNominees: function(e, $button) {
        var context = this,
            model = context.getModelInstance();
        model.set('nominees', {
          animate: false,
          processing: false
        });
        model.set('nomineesMembers', {
          show: false,
          list: []
        });
        model.set('luckyDrawButtons', {
          show: false,
          showWinner: false,
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

      _evSelectLuckyDraw: function(e, $button) {
        var context = this,
            model = context.getModelInstance(),
            luckyDrawButtons = model.get('luckyDrawButtons').list,
            luckyDrawButtonsActiveCount = 0;

        for (var i = 0, length = luckyDrawButtons.length; i < length; i ++) {
          if (luckyDrawButtons[i].key == $button.data('bhParamKey')) {
            luckyDrawButtons[i].active = true;
          }

          if (luckyDrawButtons[i].active) {
            luckyDrawButtonsActiveCount ++;
          }
        }

        model.set('luckyDrawButtons', {
          active: luckyDrawButtonsActiveCount,
          show: true,
          showWinner: false,
          list: luckyDrawButtons
        });

        if (luckyDrawButtonsActiveCount == luckyDrawButtons.length) {
          setTimeout(function() {
            model.set('nominees', {
              animate: true,
              processing: true
            });

            setTimeout(function() {
              model.set('nominees', {
                animate: false,
                processing: true
              });
              model.set('luckyDrawButtons', {
                active: luckyDrawButtonsActiveCount,
                show: true,
                showWinner: true,
                list: luckyDrawButtons
              });
            }, Inc.WINNER_ANIMATE_SEC * 1000);
          }, 1000);
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
        'click [data-bh-func="SaveSettingRandomSeed"]': function(e) {
          e.stopPropagation();
          this._evSaveSettingRandomSeed(e, $(e.currentTarget));
        },
        'click [data-bh-func="ClearSettingRandomSeed"]': function(e) {
          e.stopPropagation();
          this._evClearSettingRandomSeed(e, $(e.currentTarget));
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
        },
        'click [data-bh-func="SelectLuckyDraw"][data-bh-param-key]': function(e) {
          e.stopPropagation();
          this._evSelectLuckyDraw(e, $(e.currentTarget));
        }
      },

      initialize: function() {
        var context = this;

        BhViewBase.prototype.initialize.call(context);

        var model = context.getModelInstance();

        context.listenTo(model, 'change:joinMembers', function() {
          context.renderComponent('joinMembers');
        });

        context.listenTo(model, 'change:nomineesMembers', function() {
          context.renderComponent('nomineesMembers');
        });

        context.listenTo(model, 'change:luckyDrawButtons', function() {
          context.renderComponent('luckyDrawButtons');
        });

        context.listenTo(model, 'change:nominees', function() {
          context.renderComponent('nominees');
        });

        context.listenTo(model, 'change:settingRandomSeed', function() {
          context.renderComponent('joinMembers');
        });

        context
          ._setMainHtml(htmlMain)
          ._setComponent('joinMembers', htmlJoinMembers)
          ._setComponent('luckyDrawButtons', htmlLuckyDrawButtons)
          ._setComponent('nomineesMembers', htmlNominateMembers)
          ._setComponent('nominees', htmlNominees)
          .render()
          .renderComponent('joinMembers')
          .renderComponent('luckyDrawButtons')
          .renderComponent('nomineesMembers')
          .renderComponent('nominees');
      }
    });
  }
);