# Component Manager

## Introduction
Many websites or web apps examine the DOM and create instances (e.g. of jQuery plugins) for specific DOM nodes during the initial load. Often a class name indicates what kind of instance should be created for a specific DOM Node.

### Creation of instances during runtime
Example 1: Tabs that use a jQuery plugin:

`$('.tabs').tabs();`

While this works fine for the markup that is present at the time the website or web app is loaded, dealing with dynamic markup is more complicated. Every time new DOM nodes are loaded into the document one must take care that instances for those new nodes are also created.

Example 2: new markup is loaded into the page:

```
$.get('/server/foo/bar', function(markup) {
  $('#theTargetNode')
  	.append(markup)
  	.find('.tabs').tabs();
});
```

This approach is problematic because 

  1. should one just query for every plugin that is known to the system?
  1. should the little snippet **know** what kind of plugins are used in the response?
  
Loading data from the server is not the only place where the markup is changed. JavaScript templates are often used to create HTML markup during runtime. Using the classic approach all these places must either know exactly what plugins are expected to be present in the response or query for every known plugin.

### Destroying instances during runtime

