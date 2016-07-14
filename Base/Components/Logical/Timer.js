module.exports = (function () {
    'use strict';
    var LogicalComponent = require('./LogicalComponent');

    var Timer = LogicalComponent.extend('Timer', {

        _intervalObj: void(0),

        _tick: function (self) {
            return function () {
                self.set('tick');
            }
        },

        _setter: {
            start: function (name, value) {
                if (value)
                    this.set('interval', value);

                if (this._intervalObj)
                    clearInterval(this._intervalObj);

                var int = this.get('interval');
                var t = this._tick(this);
                this._intervalObj = setInterval(t, int);

                this._onPropertyChanged(this, 'start', true, void(0));
            },
            stop: function (name, value) {
                if (this._intervalObj)
                    clearInterval(this._intervalObj);

                this._onPropertyChanged(this, 'stop', true, void(0));
            },
            interval: function (name, value) {
                var prev = this._data.interval;
                this._data.interval = value;
                this._onPropertyChanged(this, 'interval', this.get('interval'), void(0));
            },
            tick: function () {
                this._onPropertyChanged(this, 'tick', true, void(0));
            }
        }
    }, function (cfg) {
        LogicalComponent.call(this, cfg);
        this._data.interval = 1000;
    });

    return Timer;
})();