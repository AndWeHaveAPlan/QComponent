/**
 * Created by ravenor on 13.07.16.
 */

var UIComponent = require('../UIComponent');
var Property = require('../../Property');
var RadioButton = require('./RadioButton');

var RadioButtonGroup = UIComponent.extend('RadioButtonGroup', {
    _setChecked: function (rb) {
        var radioButtons = this._radioButtons;
        for (var key in radioButtons) {
            if (radioButtons.hasOwnProperty(key)) {
                if (key !== rb.id)
                    radioButtons[key].set('checked', false);
            }
        }
        this.set('value', rb.get('value'));
    },
    addRadioButton: function (rb) {
        var self = this;
        if (self._radioButtons[rb.id]) return;
        self._radioButtons[rb.id] = rb;
        if (rb.get('checked'))
            self._setChecked(rb);
        rb.on('checked', function () {
            self._setChecked(rb);
        });
    },
    _onChildAdd: function (child) {
        UIComponent.prototype._onChildAdd.call(this, child);

        if (child instanceof RadioButton) {
            this.addRadioButton(child);
        }
    },
    _prop: {
        value: new Property('String')
    }
},
    function (cfg) {
        UIComponent.apply(this, arguments);
        this._radioButtons = {};
    });

module.exports = RadioButtonGroup;