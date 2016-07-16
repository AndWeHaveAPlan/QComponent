/**
 * Created by ravenor on 13.07.16.
 */

var UIComponent = require('../UIComponent');

var exports = {};

/**
 *
 */
exports['HtmlPrimitive'] = UIComponent.extend('HtmlPrimitive', {
    _setter: {
        default: function (name, val) {
            if (val === void 0) {
                this.el.removeAttribute(name);
            } else {
                this.el.setAttribute(name, val);
            }
            this._data[name] = val;
        },
        value: function (key, val) {
            if (!this.textNode) {
                this.textNode = new exports['textNode'];
                this._children.unshift(this.textNode);
            }
            this.textNode.set('value', val);
        }
    },
    _getter: {
        default: function (key) {
            return this._data[key];
        }
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
    _setter: {
        value: function (key, val) {
            this.el.nodeValue = val;
        }
    }
});

/**
 *
 */
('a,b,big,br,button,canvas,center,div,dl,dt,em,embed,' +
'font,form,frame,h1,h2,h3,h4,h5,h6,i,iframe,img,' +
'input,label,li,ol,option,p,pre,span,sub,sup,' +
'table,tbody,td,textarea,th,thead,tr,u,ul,header')
    .split(',')
    .forEach(function (name) {
        exports[name] = exports['HtmlPrimitive'].extend(name, {
            createEl: function () {
                this.el = UIComponent.document.createElement(name);
                this.el.style.overflow = 'hidden';
                this.el.style.position = 'absolute';
            }
        });
    });

module.exports = exports;