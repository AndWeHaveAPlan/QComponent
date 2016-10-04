/**
 * Created by ravenor on 30.06.16.
 */

var QObject = require('../QObject'),
    AbstractComponent = require('../Components/AbstractComponent'),
    Property = require('../Property'),
    Page = require('../Components/UI/Page');

module.exports = AbstractComponent.extend('Selector', {
    _prop: {
        value: Property.generate.proxy('condition'),
        condition: new Property('Boolean', {}, {
            get: Property.defaultGetter,
            set: Property.defaultSetter
        }, true),

        scene: new Property('AbstractComponent', {}, {
            get: Property.defaultGetter,
            set: Property.defaultSetter
        }, Page)
    }
});