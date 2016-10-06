/**
 * Created by ravenor on 13.07.16.
 */

var Primitive = require('./Primitives');
var UIComponent = require('../UIComponent');
var Property = require('../../Property');


module.exports = UIComponent.extend('ProgressBar', {
    createEl: function () {
        var self = this;
        this.el = UIComponent.document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.el.setAttribute('viewbox', '0 0 100 100');
        //this.el.style.width = '100px';
        //this.el.style.height = '100px';
        this.el.setAttribute('width', '100');
        this.el.setAttribute('height', '100');

        var back = UIComponent.document.createElementNS('http://www.w3.org/2000/svg', 'path');
        back.setAttribute('fill', 'none');
        back.setAttribute('stroke-width', '12');
        back.setAttribute('stroke', '#eee');
        back.setAttribute('d', 'M50 10 a 40 40 0 0 1 0 80 a 40 40 0 0 1 0 -80');

        var front = UIComponent.document.createElementNS('http://www.w3.org/2000/svg', 'path');
        front.setAttribute('fill', 'none');
        front.setAttribute('stroke-linecap', 'flat');
        front.setAttribute('stroke-width', '12');
        front.setAttribute('stroke', '#ffa834');
        front.setAttribute('d', 'M50 10 a 40 40 0 0 1 0 80 a 40 40 0 0 1 0 -80');
        front.style.transition = 'all 0.3s ease-in-out';
        front.style.transformOrigin = 'center';

        var text = UIComponent.document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', '50');
        text.setAttribute('y', '50');
        text.setAttribute('dy', '7');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('font-size', '20');

        this._back = back;
        this._front = front;
        this._text = text;

        this.el.appendChild(back);
        this.el.appendChild(front);
        this.el.appendChild(text);
    },
    hide: function () {
        this.set('visibility', 'hidden');
    },
    show: function () {
        this.set('visibility', 'visible');
    },
    _prop: {
        indeterminate: new Property('Boolean', {
            set: function (name, value) {
                clearInterval(this._rotationInterval);
                if (value) {
                    var self = this;
                    this._front.style.strokeDasharray = '63, 63';
                    self._front.style.transition = 'none';
                    self._front.style.transform = 'rotate(315deg)';
                    this._text.innerHTML = '';
                    var rot = 315;
                    this._rotationInterval = setInterval(function () {
                        self._front.style.transition = 'all 1s ease-in-out';
                        self._front.style.transform = 'rotate(' + (rot += 360) + 'deg)';
                    }, 1000);
                } else {
                    this._front.style.transition = 'all 0.3s ease-in-out';
                }
            },
            defaultValue: false
        }),
        progress: new Property('Number', {
            defaultValue: 0,
            set: function (name, value) {
                if (value > 100)
                    value = 100;
                if (value < 0)
                    value = 0;
                this._front.style.strokeDasharray = (252 * (value / 100)) + ', 252';
                this._text.innerHTML = value + '%';
            }
        }),
        value: Property.generate.proxy('progress')
    }
});