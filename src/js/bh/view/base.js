define('bh/view/base',
  ['jquery', 'underscore', 'backbone', 'mustache', 'bh/util/log'],
  function($, _, Backbone, Mustache, BhUtilLog) {
    "use strict";

    var BhViewBase = Backbone.View.extend({
      _setViewName: function(name) {
        this._viewName = name;
        return this;
      },

      _setMainHtml: function(html) {
        this._mainHtml = html;
        return this;
      },

      _setComponent: function(name, html) {
        this._components[name] = html;
        return this;
      },

      _setModelDefault: function() {
        return undefined;
      },

      _traceError: function(logMsg, logArgs, logFunc) {
        BhUtilLog.traceError(logMsg, logArgs, 'bh/view/base(' + this._viewName + ')', logFunc);
      },

      initialize: function() {
        Backbone.View.prototype.initialize.call(this);

        var context = this;
        
        context._viewName = '';
        context._mainHtml = '';
        context._components = {};

        var viewModelDefaults = context._setModelDefault();

        if (viewModelDefaults) {
          var _ViewModel = Backbone.Model.extend({
            defaults: context._setModelDefault()
          });
          context._model = new _ViewModel();
        } else {
          context._model = {
            toJSON: function() {
              return {};
            }
          };
        }        
      },

      getModelInstance: function() {
        return this._model;
      },

      renderComponent: function(componentName) {
        var context = this,
            $component = $('[data-bh-entry="viewComponent"][data-bh-param-name="' + componentName + '"]', context.el);

        if (context._components[componentName] && $component.length > 0) {
          $component
            .empty()
            .html(Mustache.render(context._components[componentName], context._model.toJSON()));

          context.trigger('renderComponent:' + componentName, $component);
        } else {
          context._traceError('Unable to find Component: "' + componentName + '"', BhUtilLog.toLogArgs(['componentName'], arguments), 'renderComponent');
        }

        return context;
      },

      render: function() {
        var context = this;

        context.$el
          .empty()
          .html(Mustache.render(context._mainHtml, context._model.toJSON()));

        context
          .trigger('render');

        return context;
      },

      remove: function() {
        this.undelegateEvents();
        this.$el.removeData().unbind();
        
        Backbone.View.prototype.remove.call(this);
      }
    });
    return BhViewBase;
  }
);