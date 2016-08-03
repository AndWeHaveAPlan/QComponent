module.exports = (function () {
    'use strict';
    var LogicalComponent = require('./LogicalComponent');
    var Property = require('../../Property');

    var Branch = LogicalComponent.extend('Branch', {
        _prop: {
            input: new Property('Boolean', {description: 'start date'}, {
                set: function (name, value) {

                    if (value)
                        this.set('ifTrue', true);
                    else
                        this.set('ifFalse', false);
                }
            }),
            ifTrue: new Property('Boolean', {description: 'start date'}),
            ifFalse: new Property('Boolean', {description: 'start date'})
        }
    }, function (cfg) {
        LogicalComponent.call(this, cfg);
    });

    return Branch;
})();