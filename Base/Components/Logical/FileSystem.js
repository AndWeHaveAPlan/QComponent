module.exports = (function () {
    'use strict';
    var LogicalComponent = require('./LogicalComponent');
    var Property = require('../../Property');
    var Ajax = require('./AJAX');

    var FileSystem = LogicalComponent.extend('FileSystem', {
        _prop: {
            result: new Property('Variant'),
            path: new Property('String', {
                set: function (name, value) {
                    this._ajax.set('url', value + '?json=true');
                    this._ajax.send();
                }
            }),
            value: Property.generate.proxy('result'),
        }
    }, function (cfg) {
        LogicalComponent.call(this, cfg);
        this._ajax = new Ajax({ autoActivate: false });

        var self = this;

        this._ajax.on('complete', function (res) {
            try {
                self.set('result', JSON.parse(res));
            } catch (e) {
                console.log('fs huita ' + e);
            }
        });
    });

    return FileSystem;
})();