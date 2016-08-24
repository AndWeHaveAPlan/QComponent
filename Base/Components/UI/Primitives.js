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
        value: new Property('String', {description: 'text content'}, {
            set: function (name, val) {
                if (!this.textNode) {
                    this.textNode = new exports['textNode'];
                    this._ownComponents.push(this.textNode);
                }
                this.textNode.set('value', val);
            },
            get: Property.defaultGetter
        }),
        cls: new Property('String', {description: 'className'}, {
            set: function (name, val) {
                this.el.className = val.replace(/\./g,' ').trim();
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
        this.el = QObject.document.createElement('input');

        this.el.addEventListener('click', function (e) {
            self.fire('click', e);
        });
        this.el.addEventListener('change', function () {
            self.set('value', event.target.value);
        });
        this.el.addEventListener('mouseup', function () {
            self.set('value', event.target.value);
        });
        this.el.addEventListener('keyup', function () {
            self.set('value', event.target.value);
        });
    },
    _prop: {
        type: Property.generate.attributeProperty('type'),
        checked: Property.generate.attributeProperty('checked'),
        value: new Property('Variant', {description: 'Base HTML input'}, {
            get: function (key, value) {
                if(this._data.type === 'number'){
                    var val = parseFloat(value);
                    return isNaN(val) ? 0 : val;
                }
                return value;
            },
            set: function (attr, val) {
                if (!val) {
                    this.el.removeAttribute(attr);
                    delete this.el[attr];
                } else {
                    this.el.setAttribute(attr, val);
                    this.el[attr] = val;
                }

                this.el[attr] = val;
            }
        })
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

exports['embed'] = exports['HtmlPrimitive'].extend('embed', {
    createEl: function () {
        this.el = UIComponent.document.createElement('embed');
    },
    _prop: {
        src: new Property('String', {description: 'Source url'}, {
            set: function (name, val) {
                setTimeout(function () {

                    var parent = this.el.parentNode,
                        el = this.el.cloneNode(true);

                    if (val === void 0) {
                        el.removeAttribute(name);
                    } else {
                        el.setAttribute(name, val);
                    }
                    parent.replaceChild(el, this.el);
                    this.el = el;

                }.bind(this), 0);

            }
        }),
        default: new Property('String', {description: 'any '}, {
            set: function (name, val) {
                if (val === void 0) {
                    this.el.removeAttribute(name);
                } else {
                    this.el.setAttribute(name, val);
                }
            },
            get: Property.defaultGetter
        })
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

exports['img'] = exports['HtmlPrimitive'].extend('img', {
    createEl: function () {
        this.el = UIComponent.document.createElement('img');
    },
    _prop: {
        src: Property.generate.attributeProperty('src')
    }
});

/**
 *
 */
('b,big,br,button,canvas,center,div,dl,dt,em,' +
'font,form,frame,h1,h2,h3,h4,h5,h6,i,iframe,' +
'label,li,ol,option,p,pre,span,sub,sup,' +
'table,tbody,td,th,thead,tr,u,ul,header,marquee')
    .split(',')
    .forEach(function (name) {
        exports[name] = exports['HtmlPrimitive'].extend(name, {
            createEl: function () {
                this.el = UIComponent.document.createElement(name);
            }
        });
    });

module.exports = exports;