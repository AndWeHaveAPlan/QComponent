/**
 * Created by zibx on 17.08.16.
 */

var UIComponent = require('../../UIComponent');
var Property = require('../../../Property');


var BaseInput = UIComponent.extend('BaseInput', {
    mixin: 'focusable'
});

var TestInput = BaseInput.extend('TestInput', {
    mixin: 'focusable',
    createEl: function () {
        this.el = UIComponent.document.createElement('input');
        this.focus();
    },
    _prop: {
        value: Property.generate.attributeProperty('value')
    }
});

module.exports = BaseInput;