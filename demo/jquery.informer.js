;(function ( $, window, undefined ) {

    var pluginName = "informer"

    function Plugin(element) {
        this.element = element;
        this.intervalHandle = null;

        this.init();
    }

    Plugin.prototype.init = function() {
        var $childElement = $(this.element).find('> blockquote');
        var $paragraph = $(this.element).find('> p');
        var pluginData = $childElement.data('plugin_fakeLatin');

        $paragraph.html('My child plugin knows ' + pluginData.words.length + ' words and the interval handle is ' + pluginData.intervalHandle);
    };

    Plugin.prototype.destroy = function() {
        $(this.element).removeData();
    };

    $.fn[pluginName] = function() {
        return this.each(function() {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin(this));
            }
        });
    }

}(jQuery, window));
