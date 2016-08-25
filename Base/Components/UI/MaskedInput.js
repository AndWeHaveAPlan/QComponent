/**
 * Created by ravenor on 13.07.16.
 */

var Primitive = require('./Primitives');
var UIComponent = require('../UIComponent');
var Property = require('../../Property');
var InputField = require('./InputField');

module.exports = InputField.extend('MaskedInput', {
    _sChars: {
        'd': /[0-9]/,
        'c': /[a-z]/,
        'C': /[A-Z]/,
        'i': /[a-zA-Z]/,
        '*': /[\w]/
    },
    _unmask: function (str, selRange) {
        var mask = this._data.mask;
        if (!mask) return str;
        for (var i = 0; i < mask.length; i++) {
            if (!this._sChars[mask[i]]) {
                str = str.replace(mask[i], '');

                // fix selection
                if (i < selRange.selStart) {
                    selRange.selStart -= 1;
                    selRange.selEnd -= 1;
                } else if (i < selRange.selEnd) {
                    selRange.selEnd -= 1;
                }
            }
        }
        return str;
    },
    _enmask: function (str, selRange) {
        var mask = this._data.mask;
        if (!mask) return str;

        var count = 0;
        var ret = '';
        for (var i = 0; i < mask.length; i++) {
            if (!str[i - count]) break;

            if (!this._sChars[mask[i]]) {
                ret += mask[i];
                count++;
            } else {
                if (this._sChars[mask[i]].test(str[i - count])) {
                    ret += str[i - count];

                    // fix selection
                    if (i < selRange.selStart) {
                        selRange.selStart += 1;
                        selRange.selEnd += 1;
                    } else if (i < selRange.selEnd) {
                        selRange.selEnd += 1;
                    }

                } else {
                    count--;
                }
            }

        }
        return ret;
    },
    _startChange: function (newVal, selRange) {
        this.set('value', this._unmask(newVal, selRange));
        console.log(selRange);
        return selRange;
    },
    _updateValue: function (newVal, selRange) {
        this.set('value', this._enmask(newVal, selRange));
        return selRange;
    },
    _prop: {
        text: new Property('String', {}, {
            get: Property.defaultGetter,
            set: function (name, value) {
                var masked = this._enmask(value);
                this.set(['maskedText', masked]);
                this.el.value = masked;
                this.el.setAttribute('value', masked);
            }
        }, ''),
        maskedText: Property.generate.proxy('value'),
        mask: new Property('String')
    }
});