/**
 * Created by ravenor on 13.07.16.
 */

var UIComponent = require('../UIComponent');
var document = require("dom-lite").document;

var exports = {};

/**
 *
 */
exports['HtmlPrimitive'] = UIComponent.extend('HtmlPrimitive', {
    _setter: {
        value: function (key, val) {
            if (!this.textNode) {
                this.textNode = this._factory.build('textNode');
                this._children.unshift(this.textNode);
            }
            this.textNode.set('value', val);
        }
    }
});

/**
 *
 */
exports['textNode'] = exports['HtmlPrimitive'].extend('textNode', {
    leaf: true,
    createEl: function () {
        this.el = document.createTextNode('');
    },
    _setter: {
        value: function (key, val) {
            this.el.nodeValue = val;
        }
    }
});

/**
 *
 */
('b,big,br,button,canvas,center,div,dl,dt,em,embed,' +
'font,form,frame,h1,h2,h3,h4,h5,h6,i,iframe,img,' +
'input,label,li,ol,option,p,pre,span,sub,sup,' +
'table,tbody,td,textarea,th,thead,tr,u,ul,header')
    .split(',')
    .forEach(function (name) {
        exports[name] = exports['HtmlPrimitive'].extend(name, {
            createEl: function () {
                this.el = document.createElement(name);
            }
        });
    });

/**
 *
 */
exports['a'] = exports['HtmlPrimitive'].extend('a', {
    createEl: function () {
        this.el = document.createElement('a');
    },
    _setter: {
        href: function (key, value) {
            this.el.href = value;
        }
    },
    _getter: {
        href: function () {
            return this.el.href;
        }
    }
});

module.exports = exports;