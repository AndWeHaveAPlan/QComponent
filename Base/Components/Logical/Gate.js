module.exports = (function () {
    'use strict';
    var LogicalComponent = require('./LogicalComponent');

    var Gate = LogicalComponent.extend('Branch', {

        open: true,


        _setter: {
            input: function (name,val) {
                if (this.open) {
                    var prev = this._data['value'];
                    this._data['value'] = val;
                    this._onPropertyChanged(this, 'output', this._data['value'], prev);
                }
            },
            open: function () {
                var prev = tris.open;
                this.open = true;
                this._onPropertyChanged(this, 'open', true, prev);
            },
            close: function () {
                var prev = this.open;
                this.open = false;
                this._onPropertyChanged(this, 'open', false, prev);
            },
            toggle: function () {
                this.open = !this.open;
                this._onPropertyChanged(this, 'open', this.open, !this.open);
            }
        }
    }, function (cfg) {
        LogicalComponent.call(this, cfg);
    });

    return Gate;
})();