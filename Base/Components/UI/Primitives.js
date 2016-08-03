/**
 * Created by ravenor on 13.07.16.
 */

var UIComponent = require('../UIComponent');
var Property = require('../../Property');
var exports = {};

/**
 *
 */
exports['HtmlPrimitive'] = UIComponent.extend('HtmlPrimitive', {
    _prop: {
        default: new Property('String', {description: 'any '}, {
            set: function (name, val) {
                if (val === void 0) {
                    this.el.removeAttribute(name);
                } else {
                    this.el.setAttribute(name, val);
                }
            },
            get: Property.defaultGetter
        }),

        value: new Property('String', {description: 'text content'}, {
            set: function (name, val) {
                if (!this.textNode) {
                    this.textNode = new exports['textNode'];
                    this._children.unshift(this.textNode);
                }
                this.textNode.set('value', val);
            },
            get: Property.defaultGetter
        })

    }
});

/**
 *
 */
exports['textNode'] = exports['HtmlPrimitive'].extend('textNode', {
    //leaf: true,
    createEl: function () {
        this.el = UIComponent.document.createTextNode('');
    },
    _prop: {
        value: new Property('String', {description: 'text content'}, {
            set: function (name, val) {
                this.el.nodeValue = val;
            },
            get: Property.defaultGetter
        })
    }
});

/**
 *
 */
exports['input'] = exports['HtmlPrimitive'].extend('input', {
    //leaf: true,
    createEl: function () {
        var self = this;
        this.el = UIComponent.document.createElement('input');

        this.el.addEventListener('click', function (e) {
            self.fire('click', e);
        });
        this.el.addEventListener('change', function () {
            self.set('value', event.target.value);
        });
    },
    _prop: {
        checked: Property.generate.attributeProperty('checked'),
        value: Property.generate.attributeProperty('value'),
        disabled: Property.generate.attributeProperty('value')
    }
});

/**
 *
 */
exports['textarea'] = exports['HtmlPrimitive'].extend('textarea', {
    //leaf: true,
    createEl: function () {
        var self = this;
        this.el = UIComponent.document.createElement('textarea');

        this.el.addEventListener('change', function () {
            self.set('value', event.target.value);
        });
    },
    _prop: {
        value: Property.generate.attributeProperty('value')
    }
});

exports['a'] = exports['HtmlPrimitive'].extend('a', {
    createEl: function () {
        this.el = UIComponent.document.createElement('a');
    },
    _prop: {
        href: Property.generate.attributeProperty('href')
    }
});

/**
 *
 */
('b,big,br,button,canvas,center,div,dl,dt,em,embed,' +
'font,form,frame,h1,h2,h3,h4,h5,h6,i,iframe,img,' +
'label,li,ol,option,p,pre,span,sub,sup,' +
'table,tbody,td,th,thead,tr,u,ul,header,embed')
    .split(',')
    .forEach(function (name) {
        exports[name] = exports['HtmlPrimitive'].extend(name, {
            createEl: function () {
                this.el = UIComponent.document.createElement(name);
            }
        });
    });

module.exports = exports;