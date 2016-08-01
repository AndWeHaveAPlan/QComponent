/**
 * Created by ravenor on 13.07.16.
 */

var AbstractComponent = require('./AbstractComponent');

/**
 *
 */
module.exports = AbstractComponent.extend('ContentContainer', {
    
}, function (cfg) {
    AbstractComponent.call(this, cfg);

    this.el = AbstractComponent.document.createElement('div');
});