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

  var init = function() {
    debugger;
  };

  return {
    init: init
  };

}));

