/**
 * Created by zibx on 03.08.16.
 */
var UIComponent = require('../UIComponent');
var Property = require('../../Property'),
    DOMTools = require('./../../Common/UI/DOMTools');


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
        var height = 24,
            pad = 6,
            padInner = 4;

        this.apply(el.style, {
            position: 'relative',
            height: height+'px'
        });
        this.apply(els.back.style, {

            background: '#ddd',
            height: height - pad*2 +'px',
            left: pad+'px',
            right: pad+'px',
            top: pad+'px',
            position: 'absolute'
        });
        this.apply(els.drag.style, {
            width: height +'px',
            height: height +'px',
            background: '#777',
            left: '50%',
            'margin-left': ((-height/2)|0)+'px',
            position: 'absolute',
            cursor: 'pointer'
        });
        this.apply(els.actual.style, {
            width: '50%',
            height: height - padInner*2+'px',
            margin: padInner+ 'px',
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
                pos = Math.round(delta*perc/step)*step;
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

            info = self._getInfo(e);

            window.addEventListener('mousemove', move);
            window.addEventListener('mouseup', up);
            els.drag.style.background = '#000';
            e.preventDefault();
            e.stopPropagation();
        });


    },
    _getInfo: function (e) {
        var self = this,
            el = this.el, els = this.els;
        var offset = DOMTools.getOffset(els.drag);
        return this.info = {
            from: self.get('from'),
            to: self.get('to'),
            step: self.get('step'),
            width: el.offsetWidth,
            left: e && e.target.offsetLeft,
            mainOffset: DOMTools.getOffset(el),
            startOffset: offset,
            x: e && e.clientX,
            y: e && e.clientY
        };
    },
    setVal: function(val){
        var info = this.info || this._getInfo();
        var perc, pos, els = this.els,
            step = info.step-0, from = info.from-0, to = info.to-0, delta = to-from;

        val<from && (val = from);
        val>to && (val = to);

        if(step)
            val = Math.round(val/step)*step;

        perc = (val-from)/delta*100;

        els.drag.style.left = perc +'%';
        els.actual.style.width = perc +'%';
    },
    _prop: {
        value: new Property('Number', {}, {
            set: function(key, val){
                this.setVal(val);
            },
            get: Property.defaultGetter
        }),
        from: new Property('Number', {}, {
            set: function(key, val){
                this._getInfo();
                this.setVal(this.get('value'));
            },
            get: Property.defaultGetter
        }),
        to: new Property('Number', {}, {
            set: function(key, val){
                this._getInfo();
                this.setVal(this.get('value'));
            },
            get: Property.defaultGetter
        }),
        step: new Property('Number', {}, {
            set: function(key, val){
                this._getInfo();
                this.setVal(this.get('value'));
            },
            get: Property.defaultGetter
        }),
        fillColor: new Property('String', {}, {
            set: function(key, val){
                this.els.actual.style.background = val;
            },
            get: Property.defaultGetter
        })

    }
});