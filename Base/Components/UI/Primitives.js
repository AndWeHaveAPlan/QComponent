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
            var oldValue = this._data['value'];
            this.el.nodeValue = val;
            this._data['value'] = val;
            this._onPropertyChanged(this, 'value', val, oldValue);
        }
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

        this.el.addEventListener('click', function () {
            self._onPropertyChanged(self, 'click', true, null);
            self._onPropertyChanged(self, 'click', false, null);
        });
        this.el.addEventListener('change', function () {
            self.set('value', event.target.value);
        });
    },
    _setter: {
        value: function (key, val) {
            var oldVal=this._data['value'];

            if (val === void 0) {
                this.el.value='';
            } else {
                this.el.value=val;
            }
            this._data['value'] = val;

            this._onPropertyChanged(this, 'value', val, oldVal);
        },
        type: function (key, val) {
            if (val === void 0) {
                this.el.removeAttribute('type');
            } else {
                this.el.setAttribute('type', val);
            }
            this._data['type'] = val;
        },
        checked: function (key, val) {
            if (val === void 0) {
                this.el.removeAttribute('checked');
            } else {
                this.el.setAttribute('checked', val);
            }
            this._data['checked'] = val;
        }
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
    _setter: {
        value: function (key, val) {
            var oldVal=this._data['value'];

            if (val === void 0) {
                this.el.value='';
            } else {
                this.el.value=val;
            }
            this._data['value'] = val;

            this._onPropertyChanged(this, 'value', val, oldVal);
        }
    }
});

exports['a'] = exports['HtmlPrimitive'].extend('a', {
    createEl: function () {
        this.el = UIComponent.document.createElement('a');
    },
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
        },
        href: function (name, val) {
            if (val === void 0) {
                this.el.removeAttribute('href');
            } else {
                this.el.setAttribute('href', val);
            }
            this._data['href'] = val;
        }
    },
    _getter: {
        default: function (key) {
            return this._data[key];
        },
        href: function () {
            return this._data['href'];
        }
    }
});

/**
 *
 */
('b,big,br,button,canvas,center,div,dl,dt,em,embed,' +
'font,form,frame,h1,h2,h3,h4,h5,h6,i,iframe,img,' +
'label,li,ol,option,p,pre,span,sub,sup,' +
'table,tbody,td,th,thead,tr,u,ul,header')
    .split(',')
    .forEach(function (name) {
        exports[name] = exports['HtmlPrimitive'].extend(name, {
            createEl: function () {
                this.el = UIComponent.document.createElement(name);
                //this.el.style.overflow = 'hidden';
                //this.el.style.position = 'absolute';
            }
        });
    });

module.exports = exports;