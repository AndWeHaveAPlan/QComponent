/**
 * Created by ravenor on 13.07.16.
 */

var Primitive = require('./Primitives');
var UIComponent = require('../UIComponent');
var Property = require('../../Property');


module.exports = UIComponent.extend('Checkbox', {
    createEl: function () {
        var self = this;
        this.el = UIComponent.document.createElement('input');
        this.el.setAttribute('type', 'checkbox');
        this.el.addEventListener('click', function (event) {
            self.set('checked', this.checked);
        });
    },
    _prop: {
        checked: Property.generate.attributeProperty('checked'),
        disabled: Property.generate.attributeProperty('disabled'),
        value: new Property('String', {},{overrideKey: 'checked'})
    },
    simlink: {

    }
});