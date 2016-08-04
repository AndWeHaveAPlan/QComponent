/**
 * Created by zibx on 03.08.16.
 */
var UIComponent = require('../UIComponent');
var Property = require('../../Property');


module.exports = UIComponent.extend('Slider', {
    createEl: function () {
        var self = this,
            doc = UIComponent.document,
            el = this.el = doc.createElement('div'),
            els = this.els = {
                main: this.el
            };

        ('back, actual, drag').split(', ').forEach(function (name) {
            el.appendChild(els[name] = doc.createElement('div'));
        });
        this.apply(el.style, {
           position: 'relative'
        });
        this.apply(els.back.style, {
            margin: '3px',
            background: '#ddd',
            height: '9px',
            width: '100%',
            position: 'absolute'
        });
        this.apply(els.drag.style, {
            width: '15px',
            height: '15px',
            background: '#777',
            left: '50%',
            'margin-left': '-8px',
            position: 'absolute',
            cursor: 'pointer'
        });
        this.apply(els.actual.style, {
            width: '50%',
            height: '11px',
            margin: '2px',
            background: '#a91815',
            position: 'absolute'
        });
        els.drag.addEventListener('mouseover', function(){
            els.drag.style.background = '#000';
        });
        els.drag.addEventListener('mouseout', function(){
            els.drag.style.background = '#777';
        });
        var move = function(e){
                console.log(e)
            },
            up = function () {
                window.removeEventListener('mouseup', up);
                window.removeEventListener('mousemove', move);
            };
        els.drag.addEventListener('mousedown', function(e){
            window.addEventListener('mousemove', move);
            window.addEventListener('mouseup', up);
            els.drag.style.background = '#000';
        });


    },
    _prop: {
        value: new Property('Number', {}),
        from: new Property('Number', {}),
        to: new Property('Number', {}),
        step: new Property('Number', {})

    }
});