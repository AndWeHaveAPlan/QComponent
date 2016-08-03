module.exports = (function () {
    'use strict';
    var LogicalComponent = require('./LogicalComponent');
    var Property = require('../../Property');

    var Gate = LogicalComponent.extend('Branch', {


        _prop: {
            input: new Property('Variant', {description: 'start date'}, {
                set: function (name, value) {

                    if (this.get('open')===true)
                        this.set('output', value);
                }
            }),
            open: new Property('Boolean', {description: 'start date'})
        }
    }, function (cfg) {
        LogicalComponent.call(this, cfg);
    });

    return Gate;
})();