/* global jQuery */
;(function ($, window) {
  var pluginName = 'fakeLatin'

  function Plugin (element) {
    this.element = element
    this.words = ['ad', 'adipisicing', 'aliqua', 'aliquip', 'amet', 'anim', 'aute', 'cillum', 'commodo', 'consectetur', 'consequat', 'culpa', 'cupidatat', 'deserunt', 'do', 'dolor', 'dolore', 'duis', 'ea', 'eiusmod', 'elit', 'enim', 'esse', 'est', 'et', 'eu', 'ex', 'excepteur', 'exercitation', 'fugiat', 'id', 'in', 'incididunt', 'ipsum', 'irure', 'labore', 'laboris', 'laborum', 'lorem', 'magna', 'minim', 'mollit', 'nisi', 'non', 'nostrud', 'nulla', 'occaecat', 'officia', 'pariatur', 'proident', 'qui', 'quis', 'reprehenderit', 'sed', 'sint', 'sit', 'sunt', 'tempor', 'ullamco', 'ut', 'velit', 'veniam', 'voluptate']

    this.intervalHandle = null

    this.init()
  }

  Plugin.prototype.displayGibberish = function () {
    var amount = 2 + Math.floor(Math.random() * 5)
    var i = -1
    var sentence = []
    var index = 0

    for (; ++i < amount;) {
      index = Math.floor(Math.random() * this.words.length)
      sentence.push(this.words[index])
    }

    $(this.element).html(sentence.join(' '))
  }

  Plugin.prototype.init = function () {
    this.displayGibberish()
    this.intervalHandle = window.setInterval($.proxy(this.displayGibberish, this), 2000)
  }

  Plugin.prototype.destroy = function () {
    window.clearInterval(this.intervalHandle)
    $(this.element).removeData()
  }

  $.fn[pluginName] = function () {
    return this.each(function () {
      if (!$.data(this, 'plugin_' + pluginName)) {
        $.data(this, 'plugin_' + pluginName, new Plugin(this))
      }
    })
  }
}(jQuery, window))
