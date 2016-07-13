/**
 * Created by ravenor on 13.07.16.
 */

var UIComponent = require('../UIComponent');
var document = require("dom-lite").document;

var exports = {};

UIComponent.extend('textNode', {
    component: true,
    _setter: {
        value: function (key, val) {
            this.el.nodeValue = val;
        }
    },
    createEl: function () {
        this.el = document.createTextNode('');
    }
});

('a,b,big,br,button,canvas,center,div,dl,dt,em,embed,' +
'font,form,frame,h1,h2,h3,h4,h5,h6,i,iframe,img,' +
'input,label,li,ol,option,p,pre,span,sub,sup,' +
'table,tbody,td,textarea,th,thead,tr,u,ul,header')
    .split(',')
    .forEach(function (name) {
        exports[name] = UIComponent.extend(name, {
            createEl: function () {
                this.el = document.createElement(name);
            },
            addToTree: function (child) {
                //console.log(child)
                child.el && (this.el || this.parent.el).appendChild(child.el);
                //(this.el || this.parent.el).appendChild(document.createTextNode('84'))
            },
            preInit: function () {

                if (this.value) {
                    this.textNode = this._factory.build('textNode', {value: this.value});
                    this._children.unshift(this.textNode);
                }

            },
            _setter: {
                value: function (key, val) {
                    console.log(val);
                    this.textNode && (this.textNode.set('value', val));
                }
            }
        });
    });

module.exports = exports;