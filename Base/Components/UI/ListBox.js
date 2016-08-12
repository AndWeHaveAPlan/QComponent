/**
 * Created by ravenor on 13.07.16.
 */

var Primitive = require('./Primitives');
var UIComponent = require('../UIComponent');
var ContainerComponent = require('./ContainerComponent');

module.exports = ContainerComponent.extend('ListBox', {
    createEl: function () {
        this.el = UIComponent.document.createElement('div');
        this.el.style.overflowX='hidden';
        this.el.style.overflowY='auto';
    },
    _handleChildren: function (childComp, index) {
        var self = this;
        var childNode = childComp.el;
        childNode.style.clear = 'both';
        childNode.style.position = 'relative';

        childNode.addEventListener('click', function () {
            self.set('selectedIndex', index);
        });
    },
});