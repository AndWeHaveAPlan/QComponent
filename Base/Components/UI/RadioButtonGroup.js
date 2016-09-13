/**
 * Created by ravenor on 13.07.16.
 */

var UIComponent = require('../UIComponent');
var Property = require('../../Property');
var RadioButton = require('./RadioButton');

var RadioButtonGroup = UIComponent.extend('RadioButtonGroup', {
    _radioButtons: {},
    addRadioButton: function (rb) {
        var self = this;
        self._radioButtons[rb.id] = rb;

        if (rb.get(checked)) {
            self._radioButtons.forEach(function (btn) {
                if (btn.id !== rb.id)
                    btn.set('checked', false);
            });
        }

        rb.on('checked', function () {
                self._radioButtons.forEach(function (btn) {
                    if (btn.id !== rb.id)
                        btn.set('checked', false);
                });
                self.set('value', rb.get('value'));
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
});

module.exports = RadioButtonGroup;