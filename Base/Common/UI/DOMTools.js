/**
 * Created by zibx on 05.08.16.
 */

var DOM = module.exports = (function () {
    'use strict';

    var QObject = require('../../QObject'),
        document = QObject.document;
    var blockRegExp = new RegExp('DIV|H[0-8]|HR|MARQUEE'),
        observable = require('z-observable'),
        domLoad = function () {
            DOM.fire('DOM');
            DOM.DOM = true;
        };
    var DomWrapper = function () {
            this.init();
        },
        maxZ = 66613,
        proto = DomWrapper.prototype = {
            defaultDelay: 100, // use in hover listener
            keyCode: {
                backspace: 8,
                comma: 188,
                'delete': 46,
                'del': 46,
                down: 40,
                end: 35,
                enter: 13,
                escape: 27,
                home: 36,
                left: 37,
                numpad_add: 107,
                numpad_decimal: 110,
                numpad_divide: 111,
                numpad_enter: 108,
                numpad_multiply: 106,
                numpad_subtract: 109,
                page_down: 34,
                page_up: 33,
                period: 190,
                right: 39,
                space: 32,
                tab: 9,
                up: 38,
                any: -1
            },
            DOM: false,
            on: observable.prototype.on,
            fire: observable.prototype.fire, /*cut*/
            moveChildren: function (from, to) {
                var i, _i, children = from.childNodes, el;
                for (i = 0, _i = children.length; i < _i; i++)
                    if ((el = children[i]).nodeType !== 3 || el.textContent.trim() !== '') {
                        to.appendChild(el);
                        --i;
                        --_i;
                    }
            },
            toggleClass: function (obj, className, force) {
                var add = ( ( force === false || force === true ) ?
                        force : // if force is true or false - use force
                        !this.hasClass(obj, className) // else - do opposite to current
                );
                this[( add ? 'add' : 'remove') + 'Class'](obj, className);
                return add;
            },
            hasClass: function (obj, className) {
                return ( ' ' + obj.className + ' ' ).indexOf(' ' + className + ' ') > -1;
            },
            addClass: function (obj, className) {
                if (!this.hasClass(obj, className))
                    obj.className += (obj.className.length ? ' ' : '') + className;
                return obj;
            },
            removeClass: function removeClass(obj, className) {
                if (this.hasClass(obj, className)) {
                    className = ( ' ' + obj.className + ' ' ).replace(' ' + className + ' ', ' ');

                    obj.className = className.substr(1, className.length - 2);
                }
            }, /*end cut*/
            //fix it : wrong implementation
            clear: function (el) {
                var _i, i,
                    childNodes = el.childNodes;
                if (!childNodes)
                    return;

                i = _i = childNodes.length;
                for (; i;)
                    el.removeChild(childNodes[--i]);
                return _i;
            },
            size: function (val) {
                var text = val.toString();
                return (text.indexOf('%') > -1 ? text : (text.indexOf('px') ? text : text + 'px' ) );
            },

            elementInDocument: function (element) {
                if (element)
                    while (element = element.parentNode) {
                        if (element === document) {
                            return true;
                        }
                    }
                return false;
            },
            contain: function (container, el) {
                var parent = el, contain = false;
                while (parent !== null && parent !== document && !( contain = parent === container)) {
                    parent = parent.parentNode;
                }

                return contain;
            },
            getMaxZ: function () {
                maxZ++;
                maxZ = Math.max(maxZ, ((((($ || {}).ui || {}).dialog || {}).maxZ) || 0) + 1);
                return maxZ;
            },
            resolveMouseButton: function (e) {
                var which = e.which,
                    button = e.button;
                return which ? which : ( button !== undefined ? ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) ) : false );
            },
            callRemoveFn: function (name, obj) {
                return obj.remove();
            },
            addEvent: function (o, eventName, fn, scope) {
                var func;
                if (scope) {
                    func = fn.bind(scope);
                } else {
                    func = fn;
                }
                return this.addRemovableListener(o, eventName, func);
            },
            /*
             * Function: extractAttributes [pure]
             * attr: DOMelement
             * out: {k1: v1, k2: v2 ... }
             * */
            extractAttributes: function (el) {
                var params = {},
                    attributes = el.attributes,
                    attr;
                for (var i = 0, _i = attributes.length; i < _i; i++) {
                    attr = attributes[i];
                    params[attr.name] = attr.value;
                }
                return params;
            },
            getOffset: function (el) {
                var _x = 0;
                var _y = 0;
                while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
                    _x += el.offsetLeft - el.scrollLeft;
                    _y += el.offsetTop - el.scrollTop;
                    el = el.offsetParent;
                }
                return {top: _y, left: _x};
            },
            display: function (el, param) {
                if (param === void 0) {
                    if (el.tagName.match(blockRegExp) !== null) {
                        return this.display(el, 'block');
                    } else {
                        return this.display(el, 'inline');
                    }
                } else {
                    el.style.display = param;
                    return el;
                }
            },
            hide: function (el) {
                this.display(el, 'none');
            },
            createEls: function (count, tagName, config) {
                return JS.repeat(count, this.createEl.bind(this, tagName, config));
            },
            createEl: function (tagName, config) {
                var el = document.createElement(tagName);
                config && JS.apply(el, config);
                return el;
            },
            newEl: function () {
                return document.createElement('div');
            },
            hideEl: function (el) {
                el.style.display = 'none';
            },

            showEl: function (el) {
                el.style.display = 'block';
            },
            addOnceListener: function (el, type, fn) {
                var wrapFn = function () {
                        out.remove();
                        fn.apply(this, JS.toArray(arguments));
                    },
                    out = proto.addRemovableListener(el, type, wrapFn);

                return out;
            },
            addListener: function (el, type, fn) {
                if (type.indexOf('hover') === 0) {
                    return this._addHoverListener(el, fn, type.split(':')[1]);
                } else
                    return this._addListener(el, type, fn);
            },
            addRemovableListener: (function () {
                var removableListener = function (el, type, fn) {
                    this.data = [el, type, fn];
                };
                removableListener.prototype = {
                    remove: function () {
                        proto.removeListener.apply(this, this.data);
                        this.remove = JS.emptyFn;
                    }
                };

                return function (el, type, fn) {
                    this.addListener(el, type, fn);
                    return new removableListener(el, type, fn);
                };
            })(),
            init: function () {
                if(typeof window === 'undefined')return;
                if (typeof window.addEventListener === 'function') {
                    proto.query = function (a, b) {
                        return a.querySelector(b);
                    };

                    proto._addListener = function (el, type, fn) {
                        return el.addEventListener(type, fn, false);
                    };
                    proto.removeListener = function (el, type, fn) {
                        return el.removeEventListener(type, fn, false);
                    };
                } else if (document.attachEvent !== void 0) { // IE
                    proto.query = function (a, b) {
                        return $(a).find(b).get(0);
                    };
                    proto._addListener = function (el, type, fn) {
                        return $(el).bind(type, fn);
                    };
                    proto.removeListener = function (el, type, fn) {
                        return $(el).unbind(type, fn);
                    };
                } else { // older browsers
                    proto._addListener = function (el, type, fn) {
                        return el['on' + type] = fn;
                    };
                    proto.removeListener = function (el, type) {
                        return el['on' + type] = null;
                    };
                }

                this.addListener(window, 'load', domLoad);
                observable.prototype._init.call(this);

                delete this.init;
                return this;

            }
        };

    return new DomWrapper();
})();