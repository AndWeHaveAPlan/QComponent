/**
 * Created by zibx on 6/26/16.
 */
var factory = require('..').Component.Factory,
    assert = require('chai').assert,

    UIComponent = require('..').Component.UIComponent,
    Primitives = require('..').Component.UI.Primitives;

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
        console.log(tree._children.get.id)
        assert.equal(tree.el.outerHTML, '<h1><h2></h2><b></b><h1><b>20</b></h1></h1>');
    });
});