(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define('ComponentManager', [], factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS-like
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.ComponentManager = factory();
    }
}(this, function () {
  var _registeredComponents = {};
  var _observer = null;

  /**
   * Reacts to changes to the DOM and calls the designated callbacks to create or delete instances
   * @param {Array} A list of {@link https://developer.mozilla.org/en-US/docs/Web/API/MutationRecord|MutationRecords}
   * @return {undefined}
   */
  var _onDomChange = function (mutations) {
    mutations.forEach(function (mutation) {

      [].slice.call(mutation.addedNodes).forEach(function(addedNode) {
        addedNode.tagName && [].slice.call(addedNode.querySelectorAll('[data-component-name]')).forEach(function(specificNode) {
            var componentName = specificNode.getAttribute('data-component-name');
            if (_registeredComponents[componentName]) {
                _registeredComponents[componentName].onAdd(specificNode);
            }
        });

      });

      [].slice.call(mutation.removedNodes).forEach(function(removedNode) {
        removedNode.tagName && [].slice.call(removedNode.querySelectorAll('[data-component-name]')).forEach(function(specificNode) {
            var componentName = specificNode.getAttribute('data-component-name');
            if (_registeredComponents[componentName]) {
                _registeredComponents[componentName].onRemove(specificNode);
            }
        });
      });

    });
  };

  /**
   * Registers a component
   * @param {String} name Name to identify the component; is used as a data attribute on target nodes
   * @param {Number} priority Order in which the components will be initialised
   * @param {Function} callbackAdd Function that will be executed when a DOM node matching the selector is added to the document
   * @param {[Function=undefined]} callbackRemove Function that will be executed when a DOM node matching the selector is removed from the document
   * @return {undefined}
   */
  var register = function (name, priority, callbackAdd, callbackRemove) {
    _registeredComponents[name] = {
      priority: priority,
      onAdd: callbackAdd,
      onRemove: callbackRemove ? callbackRemove : function(){}
    };
  };

  var init = function () {
    _observer = new MutationObserver(_onDomChange);
    _observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  return {
    init: init,
    register: register
  };

}));

