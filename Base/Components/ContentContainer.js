/**
 * Created by ravenor on 13.07.16.
 */

var AbstractComponent = require('./AbstractComponent');
var document = require("dom-lite").document;

/**
 *
 */
module.exports = AbstractComponent.extend('ContentContainer', {
    _setter: {
        value: function () {
        },
        default: function () {
        }
    },
    _getter: {
        value: function () {
        },
        default: function () {
        }
    }
}, function (cfg) {
    AbstractComponent.call(this, cfg);

    this.el = document.createElement('div');
});