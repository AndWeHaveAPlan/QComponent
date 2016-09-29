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
        var height = 12,
            pad = 3,
            padInner = 2;

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
        this.apply(els.actual.style, {
            width: '50%',
            height: height - padInner*2+'px',
            margin: padInner+ 'px',
            background: '#e60000',
            position: 'absolute'
        });
        this.apply(els.drag.style, {
            width: '0px',
            height: '0px',
            'margin-left': '0px',
            'margin-top': (height/2)+'px',
            background: els.actual.style.background,
            left: '50%',
            position: 'absolute',
            cursor: 'pointer',
            'border-radius': height/2+'px'
        });
        this.el.addEventListener('mouseover', function(){
            els.drag.style.width = height +'px';
            els.drag.style.height = height +'px';
            els.drag.style['margin-top']  = '0px';
            els.drag.style['margin-left']  = -(height/4)+'px';
        });
        this.el.addEventListener('mouseout', function(){
            els.drag.style.width = '0px';
            els.drag.style.height = '0px';
            els.drag.style['margin-top']  = (height/2)+'px';
            els.drag.style['margin-left']  = '0px';

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
        this.el.addEventListener('mousedown', function(e) { //here

            info = self.info || (self.info = self._getInfo());
            if(info.width === 0)
                info = self.info = self._getInfo();

            var step = info.step-0, from = info.from, to = info.to-0, delta = to-from;

            /*val<from && (val = from);
             val>to && (val = to);

             if(step)
             val = Math.round(val/step)*step;

             perc = (val-from)/delta*100;

             els.drag.style.left = perc +'%';
             els.actual.style.width = perc +'%';*/

            console.log("ololo", e.offsetX, info.width, info.to, e.offsetX / (info.width / info.to), info);
            //this.setVal(e.offsetX);
            var val = e.offsetX / (info.width / info.to);
            self.setVal(val);

            //self.setVal(val);
            window.addEventListener('mousemove', move);
            window.addEventListener('mouseup', up);
            els.drag.style.background = els.actual.style.background;
            e.preventDefault();
            e.stopPropagation();
        });
        els.drag.addEventListener('mousedown', function(e){
            n=0;

            info = self._getInfo(e);

            window.addEventListener('mousemove', move);
            window.addEventListener('mouseup', up);
            els.drag.style.background = els.actual.style.background;
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

        if(this._data.value !== val)
            if(!(isNaN(this._data.value) && isNaN(val)))
                this.set('value', val);

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
                this.els.drag.style.background = val;
            },
            get: Property.defaultGetter
        })

    }
});