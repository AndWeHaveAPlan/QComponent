module.exports = (function () {
    'use strict';
    var LogicalComponent = require('./LogicalComponent');
    var Property = require('../../Property');

    var AJAX = LogicalComponent.extend('AJAX', {
        send: function () {
            var data = this._data.sendData;
            var self = this;
            var xhr = this._xhr;
            xhr.open(this._data.method, this._data.url, true);

            xhr.onreadystatechange = function () {
                if (xhr.readyState !== 4) return;

                if (xhr.status !== 200) {
                    self.set('error', new Error(xhr.status + ': ' + xhr.statusText));
                    self.fire('error');
                } else {
                    self.set('result', xhr.responseText);
                    self.fire('complete');
                }
            };

            if (data)
                xhr.send(data);
            else
                xhr.send();
        },
        _prop: {
            send: new Property('Function'),
            method: new Property('String', { description: 'HTTP Method (GET|POST|...)' }, {}, 'GET'),
            sendData: new Property('Variant', { description: 'Data to send' }, {}, void 0),
            result: new Property('String', { description: '' }, {}, ''),
            value: Property.generate.proxy('result'),
            err: new Property('Error', { description: '' }, {}, null),

            url: new Property('String', { description: 'URL for request' },
                {
                    get: Property.defaultGetter,
                    set: function (name, val) {
                        if (this._data['autoActivate'] && val) {
                            this.send();
                        }
                    }
                }, null),
            autoActivate: new Property('Boolean', { description: 'Sent request immediately as url set if true, send() method must be called to perform request if false, default true' },
                {
                    get: Property.defaultGetter,
                    set: function (name, val) {
                        if (val === true)
                            this.send();
                    }
                }, false)
        }
    }, function (cfg) {
        LogicalComponent.call(this, cfg);
        this._xhr = new XMLHttpRequest();
    });

    return AJAX;
})();