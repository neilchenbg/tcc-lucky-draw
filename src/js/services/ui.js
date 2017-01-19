define('services/ui',
  ['require-i18n!nls/services.ui'],
  function(I18n) {
    "use strict";

    var showAlert = function(message, duration, position) {
      var funArgs = arguments;

      if (!duration) {
        duration = 5000;
      }

      if (!position) {
        position = 'top';
      }

      if (window.plugins && window.plugins.toast) {
        window.plugins.toast.showWithOptions(
          {
            message: message,
            duration: duration,
            position: position
          },
          function() {},
          function(error) {
            _traceError(errorThrown, UtilLog.toLogArgs(['message', 'duration', 'position'], funArgs), 'showAlert');
            deferred.reject(errorThrown);
          }
        );
      } else {
        alert(message);
      }
    };

    var showConfirm = function(message, argeeCallback, options) {
      options = _.extend({
        title: I18n.CONFIRM_TITLE,
        argeeText: I18n.CONFIRM_ARGEE_BTN,
        cancelText: I18n.CINFIRM_CANCEL_BTN,
        cancelCallback: function() {}
      }, options);

      if (navigator.notification && navigator.notification.confirm) {
        navigator.notification.confirm(
          message,
          function(btnIndex) {
            if (btnIndex == 1) {
              if (_.isFunction(argeeCallback)) {
                argeeCallback();
              }
            } else {
              if (_.isFunction(options.cancelCallback)) {
                options.cancelCallback();
              }
            }
          },
          options.title,
          [options.argeeText, options.cancelText]
        );
      } else {
        var result = window.confirm(message);

        if (result) {
          if (_.isFunction(argeeCallback)) {
            argeeCallback();
          }
        } else {
          if (_.isFunction(options.cancelCallback)) {
            options.cancelCallback();
          }
        }
      }
    };

    return {
      showAlert: showAlert,
      showConfirm: showConfirm
    };
  }
);