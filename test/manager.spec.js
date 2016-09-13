describe('ComponentManager', function() {
    it('attaches itself to the Window object when RequireJS is not available', function() {
      expect(window.ComponentManager).not.toBe(undefined);

      expect(window.ComponentManager.init).toBeFunction();
      expect(window.ComponentManager.register).toBeFunction();
      expect(window.ComponentManager.shutdown).toBeFunction();
    });

    beforeEach(function() {
      var fixture = document.createElement('div');
      fixture.setAttribute('id', 'fixture');
      document.body.appendChild(fixture);
    });

    afterEach(function() {
      var fixtureNode = document.querySelector('#fixture');
      document.body.removeChild(fixtureNode);
      ComponentManager.shutdown();
    });

    it('registers each component only once', function() {
      var fakeComponent1 = {
        name: 'foo',
        onAdd: function(){},
        onRemove: function(){}
      };

      expect(ComponentManager.register(fakeComponent1.name, fakeComponent1.onAdd, fakeComponent1.onRemove)).toBeTrue();
      expect(ComponentManager.register(fakeComponent1.name, fakeComponent1.onAdd)).toBeFalse();
    });

    it('executes the "onAdd" callback when a DOM node with the designated name is added to the document', function(done) {
      var testNode = '<div><div data-component-name="bar">Hello, my name is "bar".</div></div>';
      var component = {
        name: 'bar',
        onAdd: function(){}
      };
      var fixtureNode = document.querySelector('#fixture');

      spyOn(component, 'onAdd');

      ComponentManager.register(component.name, component.onAdd);
      ComponentManager.init();

      fixtureNode.innerHTML = testNode;

      window.setTimeout(function() {
        expect(component.onAdd).toHaveBeenCalled();
        done();
      }, 100)
    });

    it('executes the "onRemove" callback when a DOM node with the designated name is removed from the document', function(done) {
      var testNode = '<div><div data-component-name="zort">Hello, my name is "zort".</div></div>';
      var component = {
        name: 'zort',
        onAdd: function(){},
        onRemove: function(){}
      };
      var fixtureNode = document.querySelector('#fixture');

      spyOn(component, 'onRemove');

      ComponentManager.register(component.name, component.onAdd, component.onRemove);
      ComponentManager.init();

      fixtureNode.innerHTML = testNode;
      fixtureNode.innerHTML = 'empty!';

      window.setTimeout(function() {
        expect(component.onRemove).toHaveBeenCalled();
        done();
      }, 100)
    });

    it('executes the "onAdd" callbacks in the order that is configured by the priority of the component', function(done) {
      var number = -100;
      var normalComponent = {
        name: 'normal',
        onAdd: function() {
          number += 100;
        },
        onRemove: function(){}
      };

      var importantComponent = {
        name: 'important',
        onAdd: function() {
          number *= -1;
        },
        onRemove: function(){}
      };
      var fixtureNode = document.querySelector('#fixture');

      ComponentManager.register(normalComponent.name, normalComponent.onAdd, normalComponent.onRemove, 200);
      ComponentManager.register(importantComponent.name, importantComponent.onAdd, importantComponent.onRemove, 10);
      ComponentManager.init();

      fixtureNode.innerHTML = '<div><div data-component-name="normal"></div><div data-component-name="important"></div></div>';

      window.setTimeout(function() {
        expect(number).toEqual(200);
        done();
      }, 100)
    });
});
