(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define('ComponentManager', ['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS-like
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals (root is window)
        root.ComponentManager = factory(root.jQuery, root.ComponentManager);
    }
}(this, function ($) {
  var _registeredComponents = {};
  var _observer = null;

  /**
   * Reacts to changes to the DOM and calls the designated callbacks to create or delete instances
   * @param {Array} A list of {@link https://developer.mozilla.org/en-US/docs/Web/API/MutationRecord|MutationRecords}
   * @return {undefined}
   */
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

  /**
   * Registers a component
   * @param {String} selector Selector to identify the component
   * @param {Number} priority Order in which the components will be initialised
   * @param {Function} callbackAdd Function that will be executed when a DOM node matching the selector is added to the document
   * @param {Function} callbackRemove Function that will be executed when a DOM node matching the selector is removed from the document
   * @return {undefined}
   */
  var register = function (selector, priority, callbackAdd, callbackRemove) {
    _registeredComponents[name] = {
      priority: priority,
      onAdd: callbackAdd,
      onRemove: callbackRemove ? callbackRemove : $.noop
    };
  };

  var init = function () {
    _observer = new MutationObserver(_onDomChange);
    _observer.observe(document.body.get(0), {
      childList: true,
      subtree: true
    });
  }

  return {
    init: init,
    register: register
  };

}));

