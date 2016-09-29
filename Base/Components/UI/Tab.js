/**
 * Created by ravenor on 13.07.16.
 */

var UIComponent = require('../UIComponent');
var Property = require('../../Property');

module.exports = UIComponent.extend('Tab', {
    _prop: {
        header: Property.generate.proxy('value'),
        value: new Property('String', { description: 'Tab header' })
    }
},
    function (cfg) {
        UIComponent.apply(this, arguments);
        this.set('height', '100%');
        this.set('width', '100%');
    });