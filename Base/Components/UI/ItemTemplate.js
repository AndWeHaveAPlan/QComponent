/**
 * Created by ravenor on 13.07.16.
 */

var Property = require('../../Property');
var UIComponent = require('./../UIComponent');
var Primitives = require('./Primitives');

/**
 *
 */
/*Property.defineType('ItemTemplate', {
    get: Property.defaultGetter
})*/
module.exports = UIComponent.extend('ItemTemplate', {
    _prop: {
        value: new Property('String', {description: 'text content'}, {
            set: function (name, val) {
                if (!this.textNode) {
                    this.textNode = UIComponent.document.createTextNode('');
                    this.el.appendChild(this.textNode);
                }
                this.textNode.nodeValue = val;
            },
            get: Property.defaultGetter
        }),
        'default': new Property('Variant')
    }
}, function (cfg) {
    UIComponent.call(this, cfg);
});