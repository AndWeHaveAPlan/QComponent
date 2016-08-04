/**
 * Created by ravenor on 13.07.16.
 */

var Primitive = require('./Primitives');
var UIComponent = require('../UIComponent');
var Property = require('../../Property');


module.exports = UIComponent.extend('Page', {
    _prop: {
        title: new Property('String', {description: 'Page Title'}, {
            set: function (name, value) {
                document.title = value;
            },
            get: function (name, value) {
                return document.title;
            }
        }, '')
    },
    simlink: {}
});