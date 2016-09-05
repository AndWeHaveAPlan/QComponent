/**
 * Created by ravenor on 30.06.16.
 */

var QObject = require('../QObject'),
    AbstractComponent = require('../Components/AbstractComponent'),
    Property = require('../Property');

module.exports = AbstractComponent.extend('Selector', {
    _prop: {
        value: Property.generate.proxy('condition'),
        condition: new Property('Boolean'),
        page: new Property('Page', {}, {
            get: Property.defaultGetter,
            set: function () {
                return true;
            }
        }, QObject._knownComponents.Page)
    }
});