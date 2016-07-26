/**
 * Created by ravenor on 13.07.16.
 */

var Primitive = require('./Primitives');
var UIComponent = require('../UIComponent');


module.exports = UIComponent.extend('Checkbox', {
    createEl: function () {
        var self = this;
        this.el = UIComponent.document.createElement('input');
        this.el.setAttribute('type', 'checkbox');
        this.el.addEventListener('click', function (event) {
            self.set('checked', this.checked);
        });
    },
    _setter: {
        checked: function (key, value) {
            var oldVal = this._data.checked;
            this._data.checked = !!value;

            this.el.checked = this._data.checked;

            this._onPropertyChanged(this, 'value', this._data.checked, oldVal);
            this._onPropertyChanged(this, 'checked', this._data.checked, oldVal);
        },
        value: function (key, value) {
            this.set('checked', value)
        }
    },
    _getter: {
        checked: function () {
            return this._data.checked;
        },
        value: function () {
            return this._data.checked;
        }
    }
});