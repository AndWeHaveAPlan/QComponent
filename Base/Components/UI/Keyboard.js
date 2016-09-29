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
var deJSON = function(text){
    var is = true, out;
    try{
        out = JSON.parse(text);
    }catch(e){
        is = false;
    }
    return is && out;
};
module.exports = UIComponent.extend('Keyboard', {
    mixin: 'simulator',
    createEl: function () {
        var me = this;
        this.el = UIComponent.document.createElement('div');
        this.el.style.width = '900px';
        this.el.style.overflow = 'hidden';
        this.el.style.margin='12px auto';

        function createButton(cfg) {
            var self = this;
            var el = document.createElement('span');
            el.type = 'button';
            el.innerHTML = cfg.text;
            el.style.background='#ffa834';
            el.style.color='#fff';
            el.style.border='1px solid #fff';
            el.style.padding = '0.1em '+0.5*cfg.width+'em';
            el.style.lineHeight = '1.2em';
            el.style.fontSize = '2em';
            el.style.height = '1em';
            el.style.cursor = 'pointer';


            el.addEventListener('click', function (event) {
                event.preventDefault();
                me._simulate('keypress', {
                    keyCode: cfg.text.charCodeAt(0),
                    key: cfg.text.substr(0),
                    preventDefault: function(){},
                    stopPropagation: function(){}
                });
            });

            return el;
        }

        var fragment = UIComponent.document.createDocumentFragment();

        layouts['ru'].forEach(function(row){
            var div = UIComponent.document.createElement('center'),
                buttons = [],
                splitted = row.split('|'), i, _i = splitted.length, piece,
                btnInfo;
            for(i = 0;i < _i; i++){
                btnInfo = false;
                piece = splitted[i];
                if(piece.indexOf('{') === 0 && piece.indexOf('}') === piece.length-1){
                    // MayBe JSON
                    btnInfo = deJSON(piece)
                }
                if(btnInfo !== false){
                    buttons.push(btnInfo);
                }else{
                    buttons = buttons.concat(piece.split('').map(function(item){
                        return {text: item, width: 1};
                    }));
                }
            }

            buttons.map(createButton).forEach(function(el){
                div.appendChild(el);
            });
            var clearBoth = UIComponent.document.createElement('div');
            clearBoth.style = 'clear:both;';
            div.appendChild(clearBoth);
            fragment.appendChild(div);
        });
        this.el.appendChild(fragment);
    }
});