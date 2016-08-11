module.exports = (function () {
    'use strict';
    var LogicalComponent = require('./LogicalComponent');
    var Property = require('../../Property');

    var HTTPRequest = LogicalComponent.extend('HTTPRequest', {
        /**
         *
         */
        send: function () {
            var self = this;
            var xhr = this._xhr;
            xhr.open(this._data.method, this._data.url, true);

            xhr.onreadystatechange = function () {
                if (xhr.readyState != 4) return;

                if (xhr.status != 200) {
                    self.set('error', new Error(xhr.status + ': ' + xhr.statusText));
                    self.fire('error');
                } else {
                    console.log(xhr.responseText);
                    self.set('result', xhr.responseText);
                    self.fire('complete');
                }
            };

            xhr.send();
        },
        _prop: {
            method: new Property('String', {description: 'HTTP Method (GET|POST|...)'}, {}, 'GET'),
            url: new Property('String', {description: 'URL for request'}, {
                get: Property.defaultGetter,
                set: function (name, val) {
                    if (this._data['autoActivate'] && val) {
                        this.send();
                    }
                }
            }, null),
            autoActivate: new Property('Boolean', {description: 'Sent request immediately as url set if true, send() method must be called to perform request if false, default true'}, {}, true),
            result: new Property('String', {description: ''}, {}, ''),
            err: new Property('Error', {description: ''}, {}, null)
        }
    }, function (cfg) {
        LogicalComponent.call(this, cfg);
        this._xhr = new XMLHttpRequest();
    });

    return HTTPRequest;
})();