/**
 * Created by ravenor on 13.07.16.
 */

var UIComponent = require('../UIComponent');
var Property = require('../../Property');
var RadioButton = require('./RadioButton');

var RadioButtonGroup = UIComponent.extend('RadioButtonGroup', {
    /*_setChecked: function (rb) {
        var radioButtons = this._radioButtons;
        for (var key in radioButtons) {
            if (radioButtons.hasOwnProperty(key)) {
                if (key !== rb.id)
                    radioButtons[key].set('checked', false);
            }
        }
        this.set('value', rb.get('value'));
    },*/
    addRadioButton: function (rb) {
        var self = this;
        var currentValue = this._data.value;
        var rbValue = rb.get('value');

        if (self._radioButtons[rb.id] && self._radioButtons[rb.id].value === rbValue) return;

        self._radioButtons[rb.id] = {
            radioButton: rb,
            value: rbValue
        };

        if (currentValue) {
            if (rbValue === currentValue)
                rb.set('checked', true);
            else
                rb.set('checked', false);
        } else {
            if (rb.get('checked'))
                self.set('value', rbValue);
        }

        rb.on('checked', function () {
            self.set('value', rbValue);
        });
    },
    _onChildAdd: function (child) {
        UIComponent.prototype._onChildAdd.call(this, child);

        if (child instanceof RadioButton) {
            this.addRadioButton(child);
        }
    },
    _prop: {
        value: new Property('String', { description: 'Represent value of currently selected RadioButton in this group' },
            {
                get: Property.defaultGetter,
                set: function (name, value, oldValue, e) {
                    var radioButtons = this._radioButtons;
                    for (var key in radioButtons) {
                        if (radioButtons.hasOwnProperty(key)) {
                            if (radioButtons[key].value !== value)
                                radioButtons[key].radioButton.set('checked', false);
                            else
                                radioButtons[key].radioButton.set('checked', true);
                        }
                    }
                }
            })
    }
},
    function (cfg) {
        UIComponent.apply(this, arguments);
        this._radioButtons = {};
    });

module.exports = RadioButtonGroup;