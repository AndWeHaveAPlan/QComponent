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
        },

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