/**
 * Created by ravenor on 13.07.16.
 */

var Primitive = require('./Primitives');
var UIComponent = require('../UIComponent');
var Property = require('../../Property');


module.exports = UIComponent.extend('Image', {
    createEl: function () {
        var self = this;
        this.el = UIComponent.document.createElement('div');
        this.elStyle = this.el.style;
        this.elStyle.backgroundPosition = 'center';
    },
    _prop: {
        source: new Property('String', {description: 'Image source, must be valid url'}, {
            get: function () {

            },
            set: function (name, value) {
                this.elStyle.background = 'url(' + value + ')';
            }
        }),
        stretch: new Property('String', {description: 'Image source, must be valid url'}, {
            get: function () {

            },
            set: function (name, value) {
                switch (value) {
                    case 'none':
                        this.elStyle.backgroundSize = 'auto auto';
                        break;
                    case 'fill':
                        this.elStyle.backgroundSize = '100% 100%';
                        break;
                    case 'uniform':
                        this.elStyle.backgroundSize = 'contain';
                        break;
                    case 'uniformToFill':
                        this.elStyle.backgroundSize = 'cover';
                        break;
                }
            }
        }),
        value: new Property('String', {}, {overrideKey: 'source'})
    }
});