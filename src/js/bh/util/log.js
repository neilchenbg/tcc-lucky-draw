define('bh/util/log',
  [],
  function() {
    "use strict";

    var toLogArgs = function(argsNameArray, argsArray) {
      var returnArgs = {};

      if (_.isArray(argsNameArray) && argsNameArray.length > 0) {
        var length = argsNameArray.length;

        for (var i = 0; i < length; i++) {
          if (argsArray[i]) {
            returnArgs[argsNameArray[i]] = argsArray[i];
          }
        }
      }

      return returnArgs;
    };

    var _trace = function(logType, logMsg, logArgs, logModule, logFunc) {
      var logString = [];
      
      logString.push(['[', logType, ']'].join(''));
      logString.push(['[', [logModule, logFunc].join('::'), ']'].join(''));
      logString.push([' ', logMsg].join(''));

      if (logArgs && _.isObject(logArgs)) {
        logString.push([' [Args:', JSON.stringify(logArgs), ']'].join(' '));
      }

      console.log(logString.join(''));
    };

    var traceNotice = function(logMsg, logModule, logFunc) {
      _trace('NOTICE', logMsg, undefined, logModule, logFunc);
    };

    var traceError = function(logMsg, logArgs, logModule, logFunc) {
      _trace('ERROR', logMsg, logArgs, logModule, logFunc);
    };

    return {
      toLogArgs: toLogArgs,
      traceNotice: traceNotice,
      traceError: traceError
    };
  }
);