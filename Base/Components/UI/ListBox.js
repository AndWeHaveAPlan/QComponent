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
    _handleChildren: function (childComp, index) {
        var self = this;
        var childNode = childComp.el;
        childNode.style.position = 'relative';

        if (this._data.orientation === 'horizontal') {
            childNode.style.float = 'left';
        } else {
            childNode.style.clear = 'both';
        }

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
                        var childNode = item.el;
                        if (value === 'vertical') {
                            childNode.style.clear = 'both';
                            childNode.style.float = 'none';
                        } else if (value === 'horizontal') {
                            childNode.style.clear = 'none';
                            childNode.style.float = 'left';
                        }
                    }
                },
                defaultValue: 'vertical'
            })
    }
});