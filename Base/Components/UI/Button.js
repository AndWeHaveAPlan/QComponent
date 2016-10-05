/**
 * Created by ravenor on 13.07.16.
 */

var Primitive = require('./Primitives');
var UIComponent = require('../UIComponent');
var Property = require('../../Property');


module.exports = UIComponent.extend('Button', {
    createEl: function () {
        var self = this;
        this.el = UIComponent.document.createElement('input');
        this.el.setAttribute('type', 'button');
        this.el.addEventListener('click', function (event) {
            self.fire('click', event);
        });
    },
    hide: function () {
        this.set('visibility', 'hidden');
    },
    show: function () {
        this.set('visibility', 'visible');
    },
    _prop: {
        hide: new Property('Function'),
        show: new Property('Function'),
        value: Property.generate.attributeProperty('value')
    }
});