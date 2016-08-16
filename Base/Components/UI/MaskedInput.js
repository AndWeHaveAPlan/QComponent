/**
 * Created by ravenor on 13.07.16.
 */

var Primitive = require('./Primitives');
var UIComponent = require('../UIComponent');
var Property = require('../../Property');


module.exports = UIComponent.extend('MaskedInput', {
    createEl: function () {
        this._specialChars = '*';
        var self = this;
        this.el = UIComponent.document.createElement('input');
        this.shadowInput = UIComponent.document.createElement('input');
        this.shadowInput.style.display = 'none';

        this.addChild(this.shadowInput);

        this.el.setAttribute('type', 'text');
        this.shadowInput.setAttribute('type', 'text');

        this.el.addEventListener('keydown', function (event) {
            //self.shadowInput.dispatchEvent(event);
            console.log(this.selectionStart);
            var ne = new KeyboardEvent('keydown', event);
            //ne.target=self.shadowInput;
            document.dispatchEvent(ne);
        });

        this.el.addEventListener('keyup', function (event) {

            /*var data =

             for (var i = 0, j = 0; i <)

             self.set('value', this.value);*/
        });
    },
    _prop: {
        value: Property.generate.attributeProperty('value'),
        placeholder: Property.generate.attributeProperty('placeholder'),
        mask: new Property('String', {}, {
            get: Property.defaultGetter,
            set: function () {
            }
        }, null)
    }
});