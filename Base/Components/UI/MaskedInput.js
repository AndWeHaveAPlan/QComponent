/**
 * Created by ravenor on 13.07.16.
 */

var Primitive = require('./Primitives');
var UIComponent = require('../UIComponent');
var Property = require('../../Property');


module.exports = UIComponent.extend('MaskedInput', {
    createEl: function () {
        var self = this;
        this.el = UIComponent.document.createElement('input');

        var sChars = 'd';
        var mask = 'dd-dd/dd=dd';

        function unmask(str) {
            var count = 0;
            var ret = '';
            for (var i = 0; i < mask.length; i++) {
                str=str.replace(mask[i],'');
            }
            return str;
        }

        function enmask(str) {
            var count = 0;
            var ret = '';
            for (var i = 0; i < mask.length; i++) {
                if (!str[i - count]) break;

                if (sChars.indexOf(mask[i]) === -1) {
                    ret += mask[i];
                    count++;
                } else {
                    ret += str[i - count]
                }

            }
            return ret;
        }

        this.el.addEventListener('keypress', function (event) {
            console.log(this.value);
        });

        this.el.addEventListener('keyup', function (event) {

            var r = unmask(this.value);
            this.value = enmask(r);


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