/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// QUOKKA 2016
// By zibx on 9/26/16.


module.exports = (function(){
    'use strict';
    var Primitive = require('./Primitives');
    var UIComponent = require('../UIComponent'),
        tools = require('../../Common/UI/DOMTools'),
        KB = require('../../Common/UI/Keyboard');

    var layouts = {
        'ru': [
            '{"text":"Prev", "value": "shift+tab"}|йцукенгшщзхъ|{"text":"backspace"}',
            '{"text":"Next", "value": "tab"}|фывапролджэ|{"text":"delete"}',
            '{"text":"shift"}|ячсмитьбю.,|{"text":"shift"}',
            '{"text":"&nbsp;", "value": " ", "width": 14}|{"text":"&larr;", "value": "left"}|{"text":"&rarr;", "value": "right"}'
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
    var comboMapper = {
        ctrl: 'ctrlKey',
        shift: 'shiftKey'
    };
    return UIComponent.extend('Keyboard', {
        mixin: 'simulator',
        createEl: function () {
            var me = this;
            this.el = UIComponent.document.createElement('div');
            this.el.style.width = '900px';
            this.el.style.overflow = 'hidden';
            this.el.style.margin='12px auto';

            var hash = {},
                btnCls = '_Q_KB_Button';

            function createButton(cfg) {
                var self = this;
                var el = document.createElement('span');
                cfg.value = cfg.value || cfg.text;

                hash[cfg.value] = cfg;
                cfg.el = el;
                el.setAttribute('data-val', cfg.value);
                el.className = btnCls;
                el.innerHTML = cfg.text;
                if(el.innerText.length>2)
                    el.style.fontSize = '1.5em';

                el.style.padding = '10px '+0.5*cfg.width+'em';
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
                        btnInfo = deJSON(piece);
                        btnInfo.width = btnInfo.width ||1;
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

            var lastEl;
            var upFn = function (e) {
                lastEl && tools.removeClass(lastEl, 'down');
                if(lastEl === e.target) {
                    var val = lastEl.getAttribute('data-val');
                    var cfg = hash[val];
                    me.simulate(cfg);

                }
                e.preventDefault();
                e.stopPropagation();
            };
            this.el.addEventListener('mousedown', function (e) {
                var el = e.target;
                if(tools.hasClass(el,btnCls)){
                    tools.addClass(el, 'down');
                    me.el.addEventListener('mouseup', upFn);
                }
                lastEl = el;
                /**/
                e.preventDefault();
                e.stopPropagation();
            });



        },
        simulate: function(cfg){
            var e = {
                preventDefault: function () {},
                stopPropagation: function () {}
            }, val = cfg.value, i, tokens, token;

            /** simulation of combo */
            if(val.length>1){
                if(val.indexOf('+')){
                    tokens = val.split('+');
                    for(i = tokens.length;i;) {
                        token = tokens[--i];
                        if(comboMapper[token])
                            e[comboMapper[token]] = true;
                        else
                            val = token;
                    }
                }
            }
            var code = KB.keys[val];


            if(code !== void 0)
                this.apply(e, {
                    type: 'keydown',
                    keyCode: code,
                    key: ''
                });
            else
                this.apply(e, {
                    type: 'keypress',
                    keyCode: val.charCodeAt(0),
                    key: val.substr(0, 1)
                });

            this._simulate(e.type, e);
        }
    });
})();