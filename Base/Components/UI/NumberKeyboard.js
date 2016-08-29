/**

 * Created by ravenor on 13.07.16.
 */


var Primitive = require('./Primitives');
var UIComponent = require('../UIComponent');

module.exports = UIComponent.extend('NumberKeyboard', {
    createEl: function () {
        var me = this;
        this.el = UIComponent.document.createElement('div');
        this.el.style.width = '200px';
        this.el.style.overflow = 'hidden';
        this.el.style.margin='12px auto';

        function createButton(n) {
            var self = this;
            var el = document.createElement('input');
            el.type = 'submit';
            n == '<<' ? el.style.width = '66.66%' : el.style.width = '33.33%';
            el.style.height = '50px';
            el.value = n;
            el.style.float = 'left';
            el.style.background='#ffa834';
            el.style.color='#fff';
            el.style.border='1px solid #fff';


            el.addEventListener('mousedown', function (event) {
                var ae = UIComponent.document.activeElement;
                var val = el.value;

                if (ae.type === 'text') {

                    if (val == '<<') {
                        var oldVal = ae.value;
                        ae.value = oldVal.substr(0, oldVal.length - 1);
                    } else {
                        ae.value += val;
                    }
                    ae.dispatchEvent(new Event('change'));

                }

                me.fire('key', val);
                event.preventDefault();
                event.stopPropagation();
            });

            el.addEventListener('change', function (event) {
                el.value = n;
                event.preventDefault();
                event.stopPropagation();
            });

            return el;
        }

        this.el.appendChild(createButton(7));
        this.el.appendChild(createButton(8));
        this.el.appendChild(createButton(9));
        this.el.appendChild(createButton(4));
        this.el.appendChild(createButton(5));
        this.el.appendChild(createButton(6));
        this.el.appendChild(createButton(1));
        this.el.appendChild(createButton(2));
        this.el.appendChild(createButton(3));
        this.el.appendChild(createButton(0));
        this.el.appendChild(createButton('<<'));

    }
});