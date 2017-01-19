if (window.cordova) {
  document.addEventListener("deviceready", function() {
    require(
      ['jquery', 'view/app'],
      function ($, ViewApp) {
        "use strict";

        var AppView = new ViewApp({el: $('#app')});
      }
    );
  }, false);
} else {
  require(
    ['jquery', 'view/app'],
    function ($, ViewApp) {
      "use strict";

      var AppView = new ViewApp({el: $('#app')});
    }
  );
}