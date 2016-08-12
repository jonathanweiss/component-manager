;(function ( $, window, undefined ) {

    var pluginName = "loadKittens"

    function Plugin(element) {
        this.element = element;
        this.styles = {
            height: 200,
            overflow: 'hidden'
        };
        this.init();
    }

    Plugin.prototype.showKitten = function() {
        var height = 100 + Math.floor(Math.random() * 200);

        $(this.element)
            .css(this.styles)
            .html('<img src="http://placekitten.com/200/' + height +'" />')
    };

    Plugin.prototype.init = function() {
        this.showKitten();
        this.intervalHandle = window.setInterval($.proxy(this.showKitten, this), 8000);
    };

    Plugin.prototype.destroy = function() {
        window.clearInterval(this.intervalHandle);
        this.$element.removeData();
    };

    $.fn[pluginName] = function() {
        return this.each(function() {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin(this));
            }
        });
    }

}(jQuery, window));
