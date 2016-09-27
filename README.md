# ComponentManager

[![Size](https://img.shields.io/badge/min+gz-583%20b-blue.svg)](https://unpkg.com/verwalter/dist/manager.min.js)
[![Build](https://api.travis-ci.org/jonathanweiss/component-manager.svg?branch=master)](https://travis-ci.org/jonathanweiss/component-manager/)
[![Coverage Status](https://coveralls.io/repos/github/jonathanweiss/component-manager/badge.svg?branch=master)](https://coveralls.io/github/jonathanweiss/component-manager?branch=master)
[![devDependencies Status](https://david-dm.org/jonathanweiss/component-manager/dev-status.png)](https://david-dm.org/jonathanweiss/component-manager?type=dev)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![Version](https://img.shields.io/npm/v/verwalter.svg?maxAge=2592000)](https://www.npmjs.com/package/verwalter)
[![License](https://img.shields.io/github/license/mashape/apistatus.svg)](https://opensource.org/licenses/mit-license.php)
## What is this?
Utility that takes care of creating and destroying instances (e.g. of jQuery plugins) as soon as specific DOM nodes are added to the document, respectively removed from the document.
Universal  minimal (1.2 KB, 583 bytes compressed) helper with zero dependencies.

## (Longer) Introduction
Many websites or web apps examine the DOM and create instances (e.g. of jQuery plugins) for specific DOM nodes during the initial load. Often a class name indicates what kind of instance should be created for a specific DOM Node.

### Creation of instances during runtime
Example 1: Tabs that use a jQuery plugin:

```javascript
$('.tabs').tabs();
```

While this works fine for the markup that is present at the time the website or web app is loaded, dealing with dynamic markup is more complicated. Every time new DOM nodes are loaded into the document one must take care that instances for those new nodes are also created.

Example 2: new markup is loaded into the page:

```javascript
$.get('/server/foo/bar', function(markup) {
  $('#theTargetNode')
    .html(markup)
    .find('.tabs').tabs();
});
```

This approach is problematic because 

  1. should one just query for every plugin that is known to the system?
  1. should the little snippet **know** what kind of plugins are used in the response?
 
These questions show the problem: in this case the separation of concerns is violated! Every piece of code that deals with loading markup must either know what plugins are expected in the result or know the complete list of plugins used on the page.
  
Loading data from the server is not the only place where the markup is changed. JavaScript templates are often used to create HTML markup during runtime. 

### Destroying instances during runtime
Many components need a destructor to clean up variables or unbind from events to avoid memory leaks. This makes our little example even more complicated:

Example 3: load markup and clean up before the new markup is added:

```javascript
$.get('/server/foo/bar', function(markup) {
  $('#theTargetNode')
    .find('.tabs').tabs('destroy');

  $('#theTargetNode')
    .html(markup)
    .find('.tabs').tabs();
});
```

Not only must the little snippet know all about the components that are use, but also about the destructors and how to call them.

## Creating and destroying instances "automagically"

ComponentManager solves all these problems by creating instances for DOM nodes as soon as they are inserted into the DOM. It also takes care of calling the destructor functions when a DOM node is removed from the DOM.

ComponentManager has zero dependencies and uses a universal JavaScript module to be used in any environment. It depends on `MutationOberserver` which is supported by all modern browser.

### Registering a component

Example 4: Register a new component and provide callback for creating and removing instances:

```javascript
var createTab = function(node) {
  $(node).tabs();
};

var removeTab = function(node) {
  $(node).tabs('destroy');
}

ComponentManager.register('tabs', createTab, removeTab);
```

Every time a DOM node with the data attribute configuration `data-component-name="tabs"` is added to the DOM, `createTab()` is executed with this node as parameter. As soon as a DOM node with this attribute and value is removed, `removeTabs()` (with the node as payload).

### Bringing it all together

Example 5: Registering a component and using it

```javascript
var createTab = function(node) {
  $(node).tabs();
};

var removeTab = function(node) {
  $(node).tabs('destroy');
}

ComponentManager.register('tabs', createTab, removeTab);

$.get('/server/foo/bar', function(markup) {
  $('#theTargetNode').html(markup);
});
```

We've successfully decoupled loading markup into the DOM from the creation of instances of the jQuery tab plugin. The small snippet that loads markup into the page doesn't need to know about components and the ComponentManager doesn't need to know any specifics about how a component works.
Any specific code can, of course, be used in the callbacks.

Example 6: How to use component-specific code in a callback:

```javascript
var createTab = function(node) {
  var $node = $(node);
  var options = $node.data('options');

  $node.tabs(options);
};
```

## Prioritisation of component initialisation
Sometimes one component depends on another and therefore they should be initialised in a specific manner. If you need a specific order you can use the optional fourth argument when registering a component. A lower number indicates a higher priority.


Example 7: Components can have a priority when they are registered

```javascript
ComponentManager.register('tabs', createTab, removeTab, 10);
ComponentManager.register('gmaps', createGmap, removeGmap, 20);
```

You can also have a look at the second demo to see this in action.

## Getting started

There are four ways to use ComponentManager.

1. Installation via bower: `bower install component-manager`
1. Installation via NPM: `npm install verwalter`
1. Load the minified file via [unpkg.com](https://unpkg.com/verwalter/dist/manager.min.js) `<script src="https://unpkg.com/verwalter/dist/manager.min.js"></script>`
1. Download the [minified file](https://raw.githubusercontent.com/jonathanweiss/component-manager/master/dist/manager.min.js) and store it locally: `<script src="manager.min.js"></script>`

## Gotchas
Please note that due to the nature of `MutationObserver` the callbacks for creating and removing instances will be called asynchronously.

Example 8: Instances are used too early:

```javascript
// see Example 5 for the code of the callbacks
ComponentManager.register('tabs', createTab, removeTab);

$.get('/server/foo/bar', function(markup) {
  $('#theTargetNode').html(markup);
  $('#theTargetNode .tabs').eq(0).tabs('load', '#foo'); // <-Uncaught TypeError: $(...).tabs is not a function
});
```

There are many solutions to wait for the `MutationObserver` to finish working before using the instances. They range from a (somewhat sloppy) call of `setTimeout(callback, 0)` to using events.

Example 9: Wait for event before using instances

```javascript
var createTab = function(node) {
  $(node)
    .tabs()
    .trigger('TabCreated');
};

var removeTab = function(node) {
  $(node).tabs('destroy');
}

ComponentManager.register('tabs', createTab, removeTab);

$.get('/server/foo/bar', function(markup) {
  $('#theTargetNode')
    html(markup)
    .one('TabCreated', '.tabs', function() {
      $('#theTargetNode .tabs').eq(0).tabs('load', '#foo');
    });
});
```

