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
    _startChange: function (newVal, selRange) {
    },
    _updateValue: function (newVal, selRange) {
        this.set('value', newVal);
    },
    createEl: function () {
        this.el = UIComponent.document.createElement('div');
    },
    validate: function(value) {
        var valid = this.get('validator')(value);
        if (!valid)
            this.set('input.background', '#fcc');
        else
            this.set('input.background', 'none');
    },
    _prop: {
        value: new Property('String', {}, {
            get: Property.defaultGetter,
            set: function (name, value) {
                this._data.input.set('value', value);
            }
        }, ''),
        validator: new Property('Function', {}, {}, function () { return false; }),
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
        'font-size': 'inherit',
        'background': 'none'
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

    mutatingPipe = new MutatingPipe([this.id + '.placeholder'], {
        component: input.id,
        property: 'placeholder'
    });
    mutatingPipe.addMutator(function (placeholder) {
        return placeholder;
    });
    this._eventManager.registerPipe(mutatingPipe);

    input.el.addEventListener('keypress', function (event) {
        var selRange = {
            selStart: this.selectionStart,
            selEnd: this.selectionEnd
        };

        event.preventDefault();
        event.stopPropagation();

        self._startChange(this.value, selRange);
        var valueString = this.value;

        valueString = valueString.substring(0, selRange.selStart) + String.fromCharCode(event.keyCode) + valueString.substring(selRange.selEnd);

        self._updateValue(valueString, selRange);
        self.validate(this.value);
        this.setSelectionRange(selRange.selStart + 1, selRange.selStart + 1);
    });

    input.el.addEventListener('keydown', function (event) {
        var selRange = {
            selStart: this.selectionStart,
            selEnd: this.selectionEnd
        };
        var delta = 0;

        if (!(event.keyCode === 8 || event.keyCode === 46)) {
            return;
        }

        self._startChange(this.value, selRange);
        var valueString = this.value;

        if (event.keyCode === 8) { //backspace
            valueString = valueString.substring(0, (selRange.selEnd == selRange.selStart) ? selRange.selStart - 1 : selRange.selStart) + valueString.substring(selRange.selEnd);
            if (selRange.selEnd === selRange.selStart)
                delta = -1;
        }
        if (event.keyCode === 46) {  //delete
            valueString = valueString.substring(0, selRange.selStart) + valueString.substring((selRange.selEnd == selRange.selStart) ? selRange.selEnd + 1 : selRange.selEnd);
        }

        event.preventDefault();
        event.stopPropagation();

        self._updateValue(valueString, selRange);
        self.validate(this.value);
        this.setSelectionRange(selRange.selStart + delta, selRange.selStart + delta);
    });

    input.el.addEventListener('paste', function (event) {
        var selRange = {
            selStart: this.selectionStart,
            selEnd: this.selectionEnd
        };
        var clipboardData = event.clipboardData || window.clipboardData;
        var pastedData = clipboardData.getData('Text');

        self._startChange(this.value, selRange);
        var valueString = this.value;

        event.stopPropagation();
        event.preventDefault();

        valueString = valueString.substring(0, selRange.selStart) + pastedData + valueString.substring(selRange.selEnd);

        self._updateValue(valueString, selRange);

        this.setSelectionRange(selRange.selEnd + pastedData.length, selRange.selEnd + pastedData.length);
    });
});