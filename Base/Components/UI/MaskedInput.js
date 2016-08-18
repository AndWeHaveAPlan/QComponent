/**
 * Created by ravenor on 13.07.16.
 */

var Primitive = require('./Primitives');
var UIComponent = require('../UIComponent');
var Property = require('../../Property');

function isArrow(event) {
    return event.keyCode == 37 || event.keyCode == 38 || event.keyCode == 39 || event.keyCode == 40;
}

function isShift(event) {
    return event.keyCode == 16; //shift;
}

function isModifierKey(event) {
    return event.keyCode == 91 || //meta/win/command/super
        event.keyCode == 17 || //ctrl
        event.keyCode == 18;
}

function isModifierCombo(event) {
    return (event.ctrlKey || event.altKey || event.metaKey);
}

module.exports = UIComponent.extend('MaskedInput', {

    _sChars: {
        'd': /[0-9]/,
        'c': /[a-z]/,
        'C': /[A-Z]/,
        'i': /[a-zA-Z]/,
        '*': /[\w]/
    },
    _unmask: function (str) {
        var mask = this._data.mask;
        if (!mask) return str;

        var count = 0;
        var ret = '';
        for (var i = 0; i < mask.length; i++) {
            if (!this._sChars[mask[i]])
                str = str.replace(mask[i], '');
        }
        return str;
    },
    _enmask: function (str) {
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
                    ret += str[i - count]
                } else {
                    count--;
                }
            }

        }
        return ret;
    },

    createEl: function () {
        var self = this;
        this.el = UIComponent.document.createElement('input');

        this.el.addEventListener('keydown', function (event) {
            var selStart = this.selectionStart;
            var selEnd = this.selectionEnd;

            if (isArrow(event) ||
                event.keyCode == 19 || //pause/break
                event.keyCode == 27 || //esc
                (isModifierCombo(event) && !isModifierKey(event))
            ) {
                return;
            }

            if (isModifierKey(event) ||
                isShift(event) ||
                event.keyCode == 20 //caps
            ) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();

            var cursor = this.selectionStart;
            var length = this.value.length;

            var valueString = this.value;

            if (event.keyCode == 8) { //backspace
                valueString = valueString.substring(0, selStart - 1) + valueString.substring(selEnd);
            } else if (event.keyCode == 46) {  //delete
                valueString = valueString.substring(0, selStart) + valueString.substring(selEnd + 1);
            } else {
                valueString = valueString.substring(0, selStart) + String.fromCharCode(event.keyCode) + valueString.substring(selEnd);
            }

            var r = self._unmask(valueString);
            this.value = self._enmask(r);

            //return cursor
            var delta = this.value.length - length;
            if (delta >= 0)
                this.setSelectionRange(cursor + delta, cursor + delta);
            else
                this.setSelectionRange(cursor, cursor);
        });

        this.el.addEventListener('paste', function (event) {
            var selStart = this.selectionStart;
            var selEnd = this.selectionEnd;

            event.stopPropagation();
            event.preventDefault();

            var clipboardData = event.clipboardData || window.clipboardData;
            var pastedData = clipboardData.getData('Text');

            var valueString = this.value;
            valueString = valueString.substring(0, selStart) + pastedData + valueString.substring(selEnd);
            var r = self._unmask(valueString);
            this.value = self._enmask(r);
        });


    },
    _prop: {
        value: Property.generate.proxy('text'),
        text: new Property('String', {}, {
            get: Property.defaultGetter,
            set: function (name, value) {
                var masked = this._enmask(value);
                this.set(['maskedText', masked]);
                this.el.value = masked;
                this.el.setAttribute('value', masked);
            }
        }, ''),
        maskedText: Property.generate.attributeProperty('value'),
        placeholder: Property.generate.attributeProperty('placeholder'),
        mask: new Property('String', {}, {
            get: Property.defaultGetter,
            set: function () {
            }
        }, null)
    }
});