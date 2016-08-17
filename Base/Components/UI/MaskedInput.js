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
        //var mask = 'dd-dd/dd=dd';

        function unmask(str) {
            var mask = self._data.mask;
            if (!mask) return str;

            var count = 0;
            var ret = '';
            for (var i = 0; i < mask.length; i++) {
                str = str.replace(mask[i], '');
            }
            return str;
        }

        function enmask(str) {
            var mask = self._data.mask;
            if (!mask) return str;

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
        });

        this.el.addEventListener('keyup', function (event) {

            if (event.keyCode == 37 ||
                event.keyCode == 38 ||
                event.keyCode == 39 ||
                event.keyCode == 40 || //arrows
                event.keyCode == 16 || //shift
                event.keyCode == 17 || //ctrl
                event.keyCode == 18 || //alt
                event.keyCode == 19 || //pause/break
                event.keyCode == 20 || //caps
                event.keyCode == 27    //esc
            ) {
                return;
            }

            /*if(event.key){
                //self.s
            }*/

            var cursor = this.selectionStart;
            var length = this.value.length;

            console.log(event.key);

            var r = unmask(this.value);
            this.value = enmask(r);

            var delta = this.value.length - length;

            this.setSelectionRange(cursor + delta, cursor + delta);

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