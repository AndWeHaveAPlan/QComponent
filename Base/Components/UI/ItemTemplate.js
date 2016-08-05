/**
 * Created by ravenor on 13.07.16.
 */

var Property = require('../../Property');
var UIComponent = require('./../UIComponent');
var Primitives = require('./Primitives');

/**
 *
 */
module.exports = UIComponent.extend('ItemTemplate', {
    _prop: {
        value: new Property('String', {description: 'text content'}, {
            set: function (name, val) {
                if (!this.textNode) {
                    this.textNode = new Primitives['textNode'];
                    this._children.unshift(this.textNode);
                }
                this.textNode.set('value', val);
            },
            get: Property.defaultGetter
        })
    }
}, function (cfg) {
    UIComponent.call(this, cfg);
});