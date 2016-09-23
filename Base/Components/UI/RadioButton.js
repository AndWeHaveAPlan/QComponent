/**
 * Created by ravenor on 13.07.16.
 */

var UIComponent = require('../UIComponent');
var Property = require('../../Property');


var RadioButton = UIComponent.extend('RadioButton', {
    input: void 0,
    label: void 0,
    createEl: function () {
        var self = this;
        this.el = UIComponent.document.createElement('span');
        var labelEl = UIComponent.document.createElement('label');
        var inputEl = UIComponent.document.createElement('input');
        inputEl.setAttribute('type', 'radio');

        this.el.appendChild(inputEl);
        this.el.appendChild(labelEl);

        this.label = labelEl;
        this.input = inputEl;

        this.el.addEventListener('click',
            function (event) {
                //  event.preventDefault();
                //   event.stopPropagation();
                //setTimeout(function () {
                self.set('checked', true);
                //},
                //    100
                //);

                return false;
            });
    },
    _prop: {
        caption: new Property('String', { description: 'Text near the radio button' },
            {
                get: Property.defaultGetter,
                set: function (name, value, oldValue, e) {
                    this.label.innerHTML = value;
                }
            }, ''),
        checked: new Property('Boolean', {},
            {
                get: Property.defaultGetter,
                set: function (name, value, oldValue, e) {
                    if (value) {
                        if (!oldValue)
                            this.fire('checked', this);
                        this.input.checked = true;
                    } else {
                        this.input.checked = void 0;
                    }
                }
            }, false),
        group: new Property('RadioButtonGroup', {},
            {
                get: Property.defaultGetter,
                set: function (name, value, oldValue, e) {
                    if (value) {
                        value.addRadioButton(this);
                    }
                }
            }),
        value: new Property('String')
    }
});

module.exports = RadioButton;