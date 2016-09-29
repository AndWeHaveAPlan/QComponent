/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// QUOKKA 2016
// By zibx on 9/26/16.

var Primitive = require('./Primitives');
var UIComponent = require('../UIComponent');

var layouts = {
    'ru': [
        'йцукенгшщзхъ|{"text":"backspace"}',
        'фывапролджэ|{"text":"delete"}',
        '{"text":"shift"}|ячсмитьбю.,|{"text":"shift"}|{"text":"&uarr;"}',
        '{"text":" ", "width": 10}|{"text":"&larr;"}|{"text":"&darr;"}|{"text":"&rarr;"}'
    ],
    'RU': [
        'ЙЦУКЕНГШЩЗХЪ|backspace',
        'ФЫВАПРОЛДЖЭ|delete',
        'shift|ЯЧСМИТЬБЮ.,|shift|&uarr;',
        '{"symbol":" ", "width": 10}|&larr;|&darr;|&rarr;'
    ]
};

module.exports = UIComponent.extend('Keyboard', {
    createEl: function () {
        var me = this;
        this.el = UIComponent.document.createElement('div');
        this.el.style.width = '200px';
        this.el.style.overflow = 'hidden';
        this.el.style.margin='12px auto';

        function createButton(n) {
            var self = this;
            var el = document.createElement('input');
            el.type = 'button';
            el.style.height = '50px';
            el.value = n;
            el.style.float = 'left';
            el.style.background='#ffa834';
            el.style.color='#fff';
            el.style.border='1px solid #fff';


            el.addEventListener('click', function (event) {
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

        var fragment = UIComponent.document.createDocumentFragment();

        layouts['ru'].forEach(function(row){
            var div = UIComponent.document.createElement('div');
            row.split('|')
            div.appendChild(createButton(7));
            fragment.appendChild(div);
        });
    }
});