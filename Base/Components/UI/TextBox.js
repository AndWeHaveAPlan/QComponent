/**
 * Created by ravenor on 13.07.16.
 */

var Primitive = require('./Primitives');
var UIComponent = require('../UIComponent');
var Property = require('../../Property');
var InputField = require('./InputField');


module.exports = InputField.extend('TextBox', {
    _prop: {
        text: Property.generate.proxy('value')
    }
});