/**
 * Created by ravenor on 13.07.16.
 */

var Primitive = require('./Primitives');
var UIComponent = require('../UIComponent');
var document = require("dom-lite").document;


module.exports = UIComponent.extend('Checkbox', {
    createEl: function () {
        this.el = document.createElement('input');
        this.el.setAttribute('type', 'checkbox');
    },
    _setter: {
        checked: function (key, value) {

            var oldVal = this._data.checked;

            if (!!value) {
                this.el.setAttribute('checked', '');
            } else {
                this.el.removeAttribute('checked');
            }

            this._data.checked = !!value;
            this._onPropertyChanged(this, 'value', value, oldVal);
            this._onPropertyChanged(this, 'checked', value, oldVal);
        },
        value: function (key, value) {

            var oldVal = this._data.checked;

            if (!!value) {
                this.el.setAttribute('checked', '');
            } else {
                this.el.removeAttribute('checked');
            }

            this._data.checked = !!value;
            this._onPropertyChanged(this, 'checked', value, oldVal);
            this._onPropertyChanged(this, 'value', value, oldVal);
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