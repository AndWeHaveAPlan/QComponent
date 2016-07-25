/**
 * Created by ravenor on 13.07.16.
 */

var Primitive = require('./Primitives');
var UIComponent = require('../UIComponent');
var ContainerComponent = require('./ContainerComponent');

module.exports = ContainerComponent.extend('ListBox', {
    createEl: function () {
        this.el = UIComponent.document.createElement('div');
    }
});