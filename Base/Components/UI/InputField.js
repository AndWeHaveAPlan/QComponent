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

/**
 * @Abstract
 */
module.exports = UIComponent.extend('InputField', {
    _updateValue: function (newVal, selectionStart, selectionEnd) {
        this.set('value', newVal);
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

            //var cursor = this.selectionStart;
            //var length = this.value.length;

            var valueString = this.value;

            if (event.keyCode == 8) { //backspace
                valueString = valueString.substring(0, selStart - 1) + valueString.substring(selEnd);
            } else if (event.keyCode == 46) {  //delete
                valueString = valueString.substring(0, selStart) + valueString.substring(selEnd + 1);
            } else {
                valueString = valueString.substring(0, selStart) + String.fromCharCode(event.keyCode) + valueString.substring(selEnd);
            }

            self._updateValue(valueString, selStart, selEnd);
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

            self._updateValue(valueString, selStart, selEnd);
        });
    },
    _prop: {
        value: Property.generate.attributeProperty('value'),
        placeholder: Property.generate.attributeProperty('placeholder')
    }
});