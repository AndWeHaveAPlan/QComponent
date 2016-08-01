module.exports = (function () {
    'use strict';
    var LogicalComponent = require('./LogicalComponent');
    var Property = require('../../Property');

    var Timer = LogicalComponent.extend('Timer', {

        _intervalObj: void(0),

        _tick: function (self) {
            return function () {
                self.set('tick', true);
            };
        },

        _prop: {
            start: new Property('Variant', {description: 'start date'}, {
                set: function (name, value) {
                    
                    if (value)
                        this.set('interval', value);

                    if (this._intervalObj)
                        clearInterval(this._intervalObj);

                    var int = this.get('interval');
                    var t = this._tick(this);
                    this._intervalObj = setInterval(t, int);
                }
            }),
            stop: new Property('Variant', {description: 'stop timer'}, {
                set:function (name, value) {
                    if (this._intervalObj)
                        clearInterval(this._intervalObj);

                    this._onPropertyChanged(this, 'stop', true, void(0));
                }
            }),
            interval: new Property('Variant', {description: 'timer interval'}, {
                set: function (name, value) {},
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