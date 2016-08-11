(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define('ReverserController', ['jquery', 'ComponentManager'], factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS-like
        module.exports = factory(require('jquery'), require('ComponentManager'));
    } else {
        // Browser globals (root is window)
        root.ExampleComponent = factory(root.jQuery, root.ComponentManager);
    }
}(this, function ($) {

    var createInstance = function(node) {
        $(node).on('click', 'span', reverseText);
    };

    var removeInstance = function(node) {
        $(node).off('click', 'span', reverseText);
    };

    var reverseText = function(clickEvent) {
        var $target = $(clickEvent.target);
        var text = $target.text();

        $target.html(text.split('').reverse().join(''));
    };

    var init = function() {
        ComponentManager.register('reverser', 100, createInstance, removeInstance);
    };

    return {
        init: init
    };

}));

