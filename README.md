# ComponentManager

## What is this?
Helper utility that takes care of creating and destroying instances (e.g. of jQuery plugins) as soon as specific DOM nodes are added to the document, respectively removed from the document.

## (Longer) Introduction
Many websites or web apps examine the DOM and create instances (e.g. of jQuery plugins) for specific DOM nodes during the initial load. Often a class name indicates what kind of instance should be created for a specific DOM Node.

### Creation of instances during runtime
Example 1: Tabs that use a jQuery plugin:

`$('.tabs').tabs();`

While this works fine for the markup that is present at the time the website or web app is loaded, dealing with dynamic markup is more complicated. Every time new DOM nodes are loaded into the document one must take care that instances for those new nodes are also created.

Example 2: new markup is loaded into the page:

```
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

```
$.get('/server/foo/bar', function(markup) {
  $('#theTargetNode')
	.find('.tabs').tabs('destroy');

  $('#theTargetNode')
  	.html(markup)
  	.find('.tabs').tabs();
});
```

Not only must the little snippet know all about the components that are use, but also about the destructors and how to call them.

## "Automagic" handling of creating and destroying instances

ComponentManger solves all these problems by creating instances for DOM nodes as soon as they are inserted into the DOM. It also takes care of calling the destructor functions when a DOM node is removed from the DOM.

ComponentManager has zero dependencies and uses a universal JavaScript module to be used in any environments. It depends on `MutationOberserver` which is supported by all modern browser.

### Creating instances



### Executing destructors
