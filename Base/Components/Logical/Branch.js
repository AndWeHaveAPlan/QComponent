module.exports = (function () {
    'use strict';
    var LogicalComponent = require('./LogicalComponent');

    var Branch = LogicalComponent.extend('Branch', {
        _setter: {
            input: function (name, value) {
                if (!!value)
                    this.set('ifTrue');
                else
                    this.set('ifFalse');
            },
            ifTrue: function () {
                this._onPropertyChanged(this, 'ifTrue', true, void(0));
            },
            ifFalse: function () {
                this._onPropertyChanged(this, 'ifFalse', false, void(0));
            }
        }
    }, function (cfg) {
        LogicalComponent.call(this, cfg);
    });

    return Branch;
})();