module.exports = (function () {
    'use strict';
    var LogicalComponent = require('./LogicalComponent');
    var Property = require('../../Property');

    var Timer = LogicalComponent.extend('Timer', {

        start: function () {
            if (this._intervalObj)
                clearInterval(this._intervalObj);

            var int = this.get('interval');
            var t = this._tick(this);
            this._intervalObj = setInterval(t, int);
            this.set('enabled', true);
        },

        stop: function () {
            if (this._intervalObj)
                clearInterval(this._intervalObj);
            this.set('enabled', false);
        },

        _intervalObj: void(0),

        _tick: function (self) {
            return function () {
                self.set('tick', true);
                self.fire('tick');
            };
        },

        _prop: {
            enabled: new Property('Boolean', {description: 'start date'}, {
                set: function (name, value) {
                    if (value) {
                        this.start();
                    } else {
                        this.stop();
                    }
                },
                get: Property.defaultGetter
            }, false),
            interval: new Property('Variant', {description: 'timer interval'}, {
                set: function (name, value) {
                    var enabled = this.get('enabled');
                    if (enabled) {
                        this.start();
                    }
                },
                get: Property.defaultGetter
            }),
            tick: new Property('Boolean', {description: 'timer interval'}, {})
        }
    }, function (cfg) {
        LogicalComponent.call(this, cfg);
        this._data.interval = 1000;
    });

    return Timer;
})();