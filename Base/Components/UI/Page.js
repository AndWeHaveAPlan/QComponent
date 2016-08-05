/**
 * Created by ravenor on 13.07.16.
 */

var UIComponent = require('../UIComponent');
var Property = require('../../Property');


module.exports = UIComponent.extend('Page', {
    createEl: function () {
        var self = this;
        this.el = UIComponent.document.body;

    },
    _prop: {
        title: new Property('String', {description: 'Page Title'}, {
            set: function (name, value) {
                document.title = value;
            },
            get: function (name, value) {
                return document.title;
            }
        }, '')
    }
});