(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define('ReverserController', ['jquery', 'ComponentManager'], factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS-like
        module.exports = factory(require('jquery'), require('ComponentManager'));
    } else {
        // Browser globals (root is window)
        root.ReverserController = factory(root.jQuery, root.ComponentManager);
    }
}(this, function ($) {

  var createInstance = function($collection) {
  };

  var removeInstance = function($collection) {
  };

  var reverseText = function() {
    debugger;
  };

  var bindEvent = function() {
    $('body').on('click', '[data-component-name="Reverser"] span', reverseText);
  };

  var init = function() {
    ComponentManager.register('Reverser', 100, createInstance, removeInstance);

    bindEvent();
  };

  return {
    init: init
  };

}));

