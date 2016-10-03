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

module.exports = UIComponent.extend('NumberBox', {
    _prop: {
        value: Property.generate.proxy('number'),
        number: new Property('Number', {}, { defaultValue: 0 }),
        placeholder: Property.generate.attributeProperty('placeholder')
    }
}, function (cfg) {
    cfg.height = '30px';
    UIComponent.call(this, cfg);

    var self = this;

    var increase = new Primitive.input({
        id: 'increase',
        type: 'button',
        position: 'absolute',
        right: '0',
        height: '100%',
        width: '50px',
        value: '+'
    });
    increase.on('click', function () {
        self.set('number', (parseFloat(self._data.number) | 0) + 1);
    });
    this._ownComponents.push(increase);

    var decrease = new Primitive.input({
        id: 'decrease',
        type: 'button',
        position: 'absolute',
        left: '0',
        height: '100%',
        width: '50px',
        value: '-'
    });
    decrease.on('click', function () {
        self.set('number', (parseFloat(self._data.number) | 0) - 1);
    });
    this._ownComponents.push(decrease);

    var numberField = new Primitive.input({
        id: 'numberField',
        type: 'text',
        position: 'absolute',
        left: '50px',
        height: '100%',
        right: '50px'
    });
    numberField.el.addEventListener('keydown', function (event) {
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
            if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105))
                valueString = valueString.substring(0, selStart) + String.fromCharCode(event.keyCode) + valueString.substring(selEnd);
            if (event.key == '+') {
                valueString = valueString.substring(0, selStart) + '+' + valueString.substring(selEnd);
            }
            if (event.key == '-') {
                valueString = valueString.substring(0, selStart) + '-' + valueString.substring(selEnd);
            }
        }
        self.set('number', valueString);
        var delta = this.value.length - length;
        this.setSelectionRange(cursor + delta, cursor + delta);
    });
    numberField.el.addEventListener('paste', function (event) {
        var selStart = this.selectionStart;
        var selEnd = this.selectionEnd;

        event.stopPropagation();
        event.preventDefault();

        var clipboardData = event.clipboardData || window.clipboardData;
        var pastedData = clipboardData.getData('Text');

        var valueString = this.value;
        valueString = valueString.substring(0, selStart) + pastedData + valueString.substring(selEnd);

        self.set('number', parseFloat(valueString) | 0);
    });

    var pipe = new MutatingPipe([this.id+'.number'], {
        component: 'numberField',
        property: 'value'
    });

    pipe.addMutator(function (n) {
        return n;
    });

    this._eventManager.registerPipe(pipe);

    this._ownComponents.push(numberField);
});