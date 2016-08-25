/**
 * Created by ravenor on 13.07.16.
 */

var Primitive = require('./Primitives');
var UIComponent = require('../UIComponent');
var Property = require('../../Property');
var MutatingPipe = require('../../Pipes/MutatingPipe');

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
        this.el = UIComponent.document.createElement('div');
    },
    _prop: {
        value: new Property('String', {}, {
            get: Property.defaultGetter,
            set: function (name, value) {
                this._data.input.set('value', value);
            }
        }, ''),
        placeholder: Property.generate.attributeProperty('placeholder'),
        input: new Property('input')
    }
}, function (cfg) {
    UIComponent.call(this, cfg);
    var self = this;

    var input = this.set('input', new Primitive.input({
        id: 'input',
        height: '100%',
        width: '100%',
        'font-family': 'inherit',
        'font-size': 'inherit'
    }));

    this.addChild(input);
    this._eventManager.registerComponent(input);

    var mutatingPipe = new MutatingPipe([input.id + '.value'], {
        component: this.id,
        property: 'value'
    });
    mutatingPipe.addMutator(function (value) {
        return value;
    });
    this._eventManager.registerPipe(mutatingPipe);

    input.el.addEventListener('keypress', function (event) {
        var selStart = this.selectionStart;
        var selEnd = this.selectionEnd;
        var length = this.value.length;
        var delta = 1;
        event.preventDefault();
        event.stopPropagation();
        var valueString = this.value;
        valueString = valueString.substring(0, selStart) + String.fromCharCode(event.keyCode) + valueString.substring(selEnd);
        self._updateValue(valueString, selStart, selEnd);
        this.setSelectionRange(selStart + delta, selStart + delta);
    });

    input.el.addEventListener('keydown', function (event) {
        var selStart = this.selectionStart;
        var selEnd = this.selectionEnd;
        var length = this.value.length;
        var delta = 0;
        var valueString = this.value;
        if (event.keyCode == 8) { //backspace
            valueString = valueString.substring(0, selStart - 1) + valueString.substring(selEnd);
        } else if (event.keyCode == 46) {  //delete
            valueString = valueString.substring(0, selStart) + valueString.substring(selEnd + 1);
            delta = 1;
        } else {
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        self._updateValue(valueString, selStart, selEnd);
        delta += this.value.length - length;
        this.setSelectionRange(selStart + delta, selStart + delta);
    });

    input.el.addEventListener('paste', function (event) {
        var selStart = this.selectionStart;
        var selEnd = this.selectionEnd;
        event.stopPropagation();
        event.preventDefault();
        var clipboardData = event.clipboardData || window.clipboardData;
        var pastedData = clipboardData.getData('Text');
        var valueString = this.value;
        valueString = valueString.substring(0, selStart) + pastedData + valueString.substring(selEnd);
        self._updateValue(valueString, selStart, selEnd);
        this.setSelectionRange(selEnd, selEnd);
    });
});