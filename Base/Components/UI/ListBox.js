/**
 * Created by ravenor on 13.07.16.
 */

var Primitive = require('./Primitives');
var UIComponent = require('../UIComponent');
var ContainerComponent = require('./ContainerComponent');
var Property = require('../../Property');

module.exports = ContainerComponent.extend('ListBox', {
    createEl: function () {
        this.el = UIComponent.document.createElement('div');
        this.el.style.overflowX = 'hidden';
        this.el.style.overflowY = 'auto';
    },
    _formathild: function (childComp) {
        var childNode = childComp.el;
        childNode.style.position = 'relative';

        if (this._data.orientation === 'horizontal') {
            childNode.style.float = 'left';
            childNode.style.clear = 'none';
        }
        if (this._data.orientation === 'vertical') {
            childNode.style.float = 'none';
            childNode.style.clear = 'both';
        }
    },
    _handleChildren: function (childComp, index) {
        var self = this;
        this._formathild(childComp);
        var childNode = childComp.el;

        childNode.addEventListener('click', function () {
            self.set('selectedIndex', index);
        });
    },
    _prop: {
        orientation: new Property('String',
            {
                set: function (name, value) {
                    var iterator = this._children.iterator(), item;

                    while (item = iterator.next()) {
                        this._formathild(item);
                    }
                },
                defaultValue: 'vertical'
            })
    }
});