module.exports = (function () {
    'use strict';
    var LogicalComponent = require('./LogicalComponent');
    var Property = require('../../Property');

    var Random = LogicalComponent.extend('Random', {

        _getRandom: function () {
            var min = this.get('from') | 0;
            var max = this.get('to') || 10;
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        generate: function () {
            this.set('randomNumber', this._getRandom());
        },

        _prop: {
            from: new Property('Number', {description: 'Inclusive lower bound'}, {
                set: function (name, value) {
                },
                get: Property.defaultGetter
            }),
            to: new Property('Number', {description: 'Inclusive upper bound'}, {
                set: function (name, value) {
                },
                get: Property.defaultGetter
            }),
            randomNumber: new Property('Number', {description: 'Random integer'}, {
                set: function (name, value) {
                },
                get: Property.defaultGetter
            }, 1)
        }
    }, function (cfg) {
        LogicalComponent.call(this, cfg);
        this._data['randomNumber'] = this._getRandom();
    });

    return Random;
})();