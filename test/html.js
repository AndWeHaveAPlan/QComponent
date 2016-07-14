/**
 * Created by zibx on 6/26/16.
 */
var factory = require('..').Component.Factory,
    assert = require('chai').assert,

    Base = require('../Base'),
    UIComponent = require('..').Component.UIComponent,
    Primitives = require('..').Component.UI.Primitives,
    ContentContainer = Base.Component.ContentContainer,
    document = require("dom-lite").document,
    Checkbox = require('..').Component.UI.Checkbox;

describe('DOM', function () {
    var f = new factory();

    it('should nests', function () {
        var tree = f.build('h1', {
            items: ['h2', 'b', {
                item: 'h1',
                items: [{item: 'b', value: 10}]
            }]
        });
        assert.equal(tree.el.outerHTML, '<h1><h2></h2><b></b><h1><b>10</b></h1></h1>');
        tree._children.get(2)._children.get(0).set('value', 20);
        var id = tree._children.get(2).id;
        console.log(tree._children.get.id);
        assert.equal(tree.el.outerHTML, '<h1><h2></h2><b></b><h1><b>20</b></h1></h1>');
    });

    it('a href', function () {
        var a = new Primitives.a();

        assert.equal(a.el.outerHTML, '<a></a>');
        var d = new Primitives.div();
        d.addChild(a);

        a.set('href', 'http://google.com');
        assert.equal(a.get('href'), 'http://google.com');
        a.set('value', 'google!');
        assert.equal(a.el.outerHTML, '<a href="http://google.com">google!</a>');
        assert.equal(d.el.outerHTML, '<div><a href="http://google.com">google!</a></div>');
    });

    it('checkbox', function () {
        var cb = new Checkbox();

        cb.set('checked', true);
        cb.set('value', false);

        assert.equal(cb.el.outerHTML, '<input type="checkbox">');
    });
    
    it('content container', function () {
        var TestCompClass = UIComponent.extend('Checkbox', {
            createEl: function () {
                this.el = document.createElement('div');
                this.el.setAttribute('class', 'own');
            }
        }, function (cfg) {
            var self = this;
            UIComponent.call(this, cfg);

            self._ownComponents.push(new Primitives.a());
            self._ownComponents.push(new Primitives.a());

            self._ownComponents.push(new ContentContainer());

            self._ownComponents.push(new Primitives.b());
            self._ownComponents.push(new Primitives.b());
            this._init();
        });

        var testComp = new TestCompClass();

        var d = new Primitives.div();
        d.addChild(new Primitives.a().set('href', 'http://mzhvyachni.pu/'));
        testComp.addChild(d);

        assert.equal(testComp.el.outerHTML, '<div class="own"><a></a><a></a><div><div><a href="http://mzhvyachni.pu/"></a></div></div><b></b><b></b></div>');
    });

});