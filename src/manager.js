/*! ComponentManager - v1.1.0
 * https://github.com/jonathanweiss/component-manager
 * Copyright (c) 2016 https://github.com/jonathanweiss/component-manager/authors.txt
 * License: MIT
 */
(function(root, factory) {
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
}(this, function() {
  var DATA_ATTRIBUTE = 'data-component-name';
  var registeredComponents = {};
  var observer = null;

    /**
    * Reacts to changes to the DOM and calls the designated callbacks to create or delete instances
    * @param {Array} A list of {@link https://developer.mozilla.org/en-US/docs/Web/API/MutationRecord|MutationRecords}
    * @return {undefined}
    */
    var _onDomChange = function(mutations) {
        mutations.forEach(function(mutation) {

            [].slice.call(mutation.addedNodes).forEach(function(addedNode) {
                if (addedNode.tagName) {
                    [].slice.call(addedNode.querySelectorAll('[' + DATA_ATTRIBUTE + ']'))
                        .sort(function(a, b) {
                            return registeredComponents[a.getAttribute('data-component-name')].priority >
                                   registeredComponents[b.getAttribute('data-component-name')].priority;
                        })
                        .forEach(function(specificNode) {
                            var componentName = specificNode.getAttribute(DATA_ATTRIBUTE);
                            if (registeredComponents[componentName]) {
                                registeredComponents[componentName].onAdd(specificNode);
                            }
                        });
                    }
            });

            [].slice.call(mutation.removedNodes).forEach(function(removedNode) {
                if (removedNode.tagName) {
                    [].slice.call(removedNode.querySelectorAll('[' + DATA_ATTRIBUTE + ']')).forEach(function(specificNode) {
                        var componentName = specificNode.getAttribute(DATA_ATTRIBUTE);
                        if (registeredComponents[componentName]) {
                            registeredComponents[componentName].onRemove(specificNode);
                        }
                    });
                }
            });

        });
    };

    /**
    * Registers a component
    * @param {String} name Name to identify the component; is used as a data attribute on target nodes
    * @param {Function} callbackAdd Function that will be executed when a DOM node matching the selector is added to the document
    * @param {[Function=undefined]} callbackRemove Function that will be executed when a DOM node matching the selector is removed from the document
    * @param {[Number=100]} priority Important of the component with 0 being the most important.
    * @return {undefined}
    */
    var register = function(name, callbackAdd, callbackRemove, priority) {
        if (!registeredComponents[name]) {
            registeredComponents[name] = {
                onAdd: callbackAdd,
                onRemove: callbackRemove ? callbackRemove : function(){},
                priority: priority || 100
            };
        }
    };

    /**
    * Starts listening to changes to the DOM
    * @return {undefined}
    */
    var init = function() {
        observer = new MutationObserver(_onDomChange);
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    };

    /**
    * Stops listening to changes to the DOM
    * @return {undefined}
    */
    var shutdown = function() {
        if (observer) {
            observer.disconnect();
        }
    };

    return {
        init: init,
        register: register,
        shutdown: shutdown
    };

}));
