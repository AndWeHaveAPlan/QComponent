/**
 * Created by zibx on 03.08.16.
 */
var UIComponent = require('../UIComponent');
var Property = require('../../Property'),
    DOMTools = require('./DOMTools');


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
        var n  = 0;
        var move = function(e){
            var perc = ( e.pageX - info.mainOffset.left)/info.width, pos,
                step = info.step-0, from = info.from-0, to = info.to-0, delta = to-from;

            perc<0 && (perc = 0);
            perc>1 && (perc = 1);

            if(step)
                pos = (((delta+step-0.0000000001)*perc/step)|0)*step;
            else
                pos = delta*perc;

            perc = pos/delta*100;

            els.drag.style.left = perc +'%';
            els.actual.style.width = perc +'%';

            self.set('value', pos+from);
                n++;
            //if(n==20)debugger;
            },
            up = function () {
                window.removeEventListener('mouseup', up);
                window.removeEventListener('mousemove', move);
            },
            info;
        els.drag.addEventListener('mousedown', function(e){
            n=0;
            var offset = DOMTools.getOffset(els.drag);
            info  = {
                from: self.get('from'),
                to: self.get('to'),
                step: self.get('step'),
                width: el.offsetWidth,
                left: e.target.offsetLeft,
                mainOffset: DOMTools.getOffset(el),
                startOffset: offset,
                x: e.clientX,
                y: e.clientY
            };

            window.addEventListener('mousemove', move);
            window.addEventListener('mouseup', up);
            els.drag.style.background = '#000';
            e.preventDefault();
            e.stopPropagation();
        });


    },
    _prop: {
        value: new Property('Number', {}),
        from: new Property('Number', {}),
        to: new Property('Number', {}),
        step: new Property('Number', {})

    }
});