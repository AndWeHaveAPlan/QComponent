/**
 * Created by ravenor on 13.07.16.
 */

var Primitive = require('./Primitives');
var UIComponent = require('../UIComponent');
var Property = require('../../Property');


module.exports = UIComponent.extend('TextBox', {
    createEl: function () {
        var self = this;
        this.el = UIComponent.document.createElement('input');
        this.el.setAttribute('type', 'text');

        this.el.addEventListener('keydown', function (event) {
            self.set('value', this.value);
        });
    },
    _prop: {
        value: Property.generate.proxy('text'),
        text: Property.generate.attributeProperty('value'),
        placeholder: Property.generate.attributeProperty('placeholder')
    }
});