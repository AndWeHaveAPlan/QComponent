/**
 * Created by zibx on 03.08.16.
 */
var LogicalComponent = require('../Logical/LogicalComponent');
var Property = require('../../Property');


module.exports = LogicalComponent.extend('Title', {
    _prop: {
        value: new Property('String', {},{
            set: function (key, val) {
                document.title = val;
            },
            get: Property.defaultGetter
        })
    }
});