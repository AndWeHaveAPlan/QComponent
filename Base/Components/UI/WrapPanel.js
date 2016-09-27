/**
 * Created by ravenor on 13.07.16.
 */

var Primitive = require('./Primitives');
var UIComponent = require('../UIComponent');
var ContainerComponent = require('./ContainerComponent');
var Property = require('../../Property');

module.exports = ContainerComponent.extend('WrapPanel', {
    createEl: function () {
        this.el = UIComponent.document.createElement('div');
    },
    _handleChildren: function (childComp, index) {
        var self = this;
        var childNode = childComp.el;
        childNode.style.width = this._data['itemWidth'];
        childNode.style.float = 'left';
        childNode.style.position = 'relative';
        childNode.style.overflow = 'hidden';

        childNode.addEventListener('click', function () {
            self.set('selectedIndex', index);
            self.fire('itemClick', self.get('selectedItem'), index);
        });
    },
    _prop: {
        itemWidth: new Property('String', {description: 'Single item width'}, null, 'auto')
    }
});