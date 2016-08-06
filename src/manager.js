(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS-like
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals (root is window)
        root.ComponentManager = factory(root.jQuery);
    }
}(this, function ($) {
  var _registeredComponents = {};
  var _observer = null;

  var _onDomChange = function (mutations) {
    mutations.forEach(function (mutation) {
      var addedComponents = $(mutation.addedNodes).find('[data-component-name]');
      var removedComponents = $(mutation.removedNodes).find('[data-component-name]');

      addedComponents.each(function () {
        var $element = $(this);
        var componentName = $element.attr('[data-component-name]');

        if (_registeredComponents[componentName]) {
          _registeredComponents[componentName].onAdd($element)
        }
      });

      removedComponents.each(function (index, element) {
        var $element = $(this);
        var componentName = $element.attr('[data-component-name]');

        if (_registeredComponents[componentName]) {
          _registeredComponents[componentName].onRemove($element)
        }
      });

    });
  };

  var registerComponent = function (name, priority, callbackAdd, callbackRemove) {
    _registeredComponents[name] = {
      priority: priority,
      onAdd: callbackAdd,
      onRemove: callbackRemove ? callbackRemove : null
    };
  };

  var init = function () {
    _observer = new MutationObserver(_onDomChange);
    _observer.observe($('body').get(0), {
      childList: true,
      subtree: true
    });
  }

  return {
    init: init,
    registerComponent: registerComponent
  };

}));

