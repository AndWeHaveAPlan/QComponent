/**
 * @returns {QObject}
 */
module.exports = (function () {
    'use strict';
    var observable = require('z-observable'),
        MulticastDelegate = require('./MulticastDelegate'),
        Property = require('./Property'),
        uuid = require('tiny-uuid'),
        loggingNS = {};

    var components = {},
        mixins = {},
        toString = Object.prototype.toString,
        getType = function (obj) {
            return toString.call(obj);
        },
        deepApply = ['_prop'];

    /**
     * Top level class
     *
     * @class
     */
    function QObject(cfg) {
        this._propReady = false;
        cfg && this.applyBut(this, cfg, ['_init']);
        this._cfg = cfg || {};
        observable.prototype._init.call(this);

        this._data = {};

        cfg = cfg || {};
        this.id = cfg.id || uuid();
        delete cfg.id;

        this._onPropertyChanged = new MulticastDelegate();

        this._initProps(cfg);
    }

    var prototype = {

        on: observable.prototype.on,
        fire: observable.prototype.fire,
        removableOn: observable.prototype.removableOn,
        un: observable.prototype.un,

        /**
         * Get property from component
         *
         * @param names String
         */
        get: function (names) {

            if (!Array.isArray(names)) {
                names = names.split('.');
            }

            if (!names) {
                return this.get(['value']);
            }

            var ret = this;
            if (names.length > 1) {
                for (var i = 0; i < names.length; i++) {
                    if (ret instanceof QObject) {
                        ret = ret.get(names[i]);
                    } else {
                        ret = ret[names[i]];
                    }
                    if (ret === void 0)
                        return ret;
                }
                return ret;
            } else if (names.length === 1) {
                return names[0] in this._prop ? this._prop[names[0]].get(this, names[0]) : void (0);
            } else {
                return void (0);
            }
        },

        /**
         *  Old method with string parameter
         * @param name
         * @returns {*}
         * @private
         */
        _get: function (name) {
            return this._get(name);
        },

        /**
         * Set property to component
         *
         * @param names String
         * @param value Object
         */
        set: function (names, value) {
            if (!Array.isArray(names)) {
                names = names.split('.');
            }
            var ret = void (0);
            var firstName = names[0];
            var lastName = names[names.length - 1];

            if (names.length > 1) {
                var getted = this.get(names.slice(0, -1).join('.'));
                if (getted)
                    if (getted instanceof QObject) {
                        getted.set(lastName, value);
                        ret = value;
                    } else {
                        ret = getted[lastName] = value;
                        this._onPropertyChanged(this, names.slice(0, -1), value);
                    }
            } else {

                // create default
                if (!this._prop[firstName]) {
                    //if (this.dynamic) {
                    this._prop[firstName] = new Property('Variant', { description: 'Someshit' });
                    /*} else {
                        debugger;
                        throw new Error('`' +
                            this._type +
                            '` does not contain definition for `' +
                            firstName +
                            '` and not declared as dynamic');
                    }*/
                }


                this._prop[firstName].set(this, firstName, value);
                ret = value;
            }

            //this._onPropertyChanged(this, this.id, this);
            return ret;
        },

        /**
         * @deprecated
         * @param name
         * @param value
         * @private
         */
        _set: function (name, value) {
            return this.set(name, value);
        },

        /**
         * Copy all properties of object2 to object1, or object1 to self if object2 not set
         *
         * @returns {*} Changed object
         * @param object1 Object
         * @param object2 Object
         */
        apply: function (object1, object2) {
            var i,
                source = object2 || object1,
                target = object2 ? object1 : this;

            for (i in source) {
                target[i] = source[i];
            }
            return target;
        },

        /**
         * Copy all properties of one object to another
         * Does not copy existed properties
         *
         * @returns {*} Changed object
         * @param object1 Object
         * @param object2 Object
         */
        applyIfNot: function (object1, object2) {
            var i,
                source = object2 || object1,
                target = object2 ? object1 : this;

            for (i in source)
                target[i] === void 0 && (target[i] = source[i]);

            return target;
        },

        applyBut: function (el1, el2, but) {
            but = QObject.arrayToObject(but);
            var i;

            for (i in el2)
                !but[i] && (el1[i] = el2[i]);

            return el1;
        },
        /**
         * Copy all properties of one object to another and make them not enumerable and not overwritable
         *
         * @param object1
         * @param object2
         * @returns {*} Changed object
         */
        applyPrivate: function (object1, object2) {
            var i,
                source = object2 || object1,
                target = object2 ? object1 : this;

            for (i in source)
                Object.defineProperty(target, i, {
                    enumerable: false,
                    configurable: false,
                    writable: false,
                    value: source[i]
                });

            return target;
        },

        /**
         * Convert Array to hash Object
         *
         * @param arr Array: Array to convert
         * @param [val=true] Any: value that would be setted to each member
         * @returns {{hash}}
         */
        arrayToObject: function (arr, val) {
            var i = 0,
                newVal = val || true,
                out = {};
            if (arr === null || arr === void 0) return out;

            var _i = arr.length;

            for (; i < _i; i++) {
                out[arr[i]] = newVal;
            }
            return out;
        },

        Error: function (msg, data) {
            var e = new Error(msg);
            data && QObject.apply(e, data);
            throw e;
        },
        mixin: function (name, cfg) {
            mixins[name] = cfg;
            cfg._type = name;
            return cfg;
        },

        /**
         * 
         * @param {} cfg 
         * @param {} mixin 
         * @returns {} 
         */
        _mixing: function (cfg, mixin, mixinInit/* base */) {
            mixinInit = mixinInit || [];

            if (prototype.isArray(mixin)) {
                mixin.push(cfg);
                return mixin.reduce(function (base, mixin) {
                    var name = mixin;
                    if (typeof mixin === 'string') {
                        if (mixins[mixin]) {
                            if (mixins[mixin]._mixinsInit && mixins[mixin]._mixinsInit.length)
                                mixinInit = mixinInit.concat(mixins[mixin]._mixinsInit);

                            if (mixins[mixin]._init) {
                                mixinInit.push(mixins[mixin]._init);
                            }
                        }
                        mixin = components[mixin] || mixins[mixin];
                    } else {
                        if (mixin._mixinsInit && mixin._mixinsInit.length)
                            mixinInit = mixinInit.concat(mixin._mixinsInit);
                    }

                    if (!mixin)
                        throw new Error('Unknows mixin `' + name + '`');

                    return prototype._mixing(mixin, base, mixinInit);
                });
            }
            var base = mixin;

            /** remove deep applied */
            var overlays = deepApply.reduce(function (storage, deepName) {
                if (deepName in cfg) {
                    storage[deepName] = cfg[deepName];
                    delete cfg[deepName];
                }
                return storage;
            }, {}), i;

            var proto = prototype.applyBut(Object.create(base), cfg, ['_init']);

            for (i in overlays) {
                proto[i] = QObject.apply(Object.create(proto[i]), overlays[i]);
            }

            return proto;
        },

        makeArray: function (obj) {
            return obj !== void 0 ? (this.isArray(obj) ? obj : [obj]) : [];
        },
        isArray: function (obj) {
            return getType(obj) === '[object Array]';
        },

        //QObject.prototype = prototype;//.apply.call({}, prototype);
        _prop: {},
        __proxy: {},

        /**
         * 
         * @returns {} 
         */
        _afterInit: function () {
            this._init();
            if (this._mixinsInit) {
                for (var i = 0, mixins = this._mixinsInit, _i = mixins.length; i < _i; i++) {
                    mixins[i].call(this);
                }
            }
        },

        /**
         * 
         * @returns {} 
         */
        _init: function () {
            var cfg = this._cfg || {};

            var prop = this._prop;
            for (var i in prop) {
                if (!(i in cfg) && i !== 'default' && prop[i].setDefault) {
                    if (this._data[i] && prop[i].metadata.defaultValue !== this._data[i])
                        this.set([i], this._data[i]);
                    else
                        this.set([i], prop[i].metadata.defaultValue);
                }
            }

            for (var p in cfg) {
                if (cfg.hasOwnProperty(p)) {
                    this._data[p] = cfg[p];
                }
            }

            for (var p in cfg) {
                if (cfg.hasOwnProperty(p)) {
                    this.set([p], cfg[p]);
                }
            }

            this._propReady = true;

            delete this._cfg;
        },

        /**
         * 
         * @param {} cfg 
         * @returns {} 
         */
        _initProps: function (cfg) {
            var proxy = this.__proxy;

            for (var p in this._prop) {
                var property = this._prop[p];
                if (property.proxyFor) {
                    proxy[property.proxyFor]
                        ? proxy[property.proxyFor].push(p)
                        : proxy[property.proxyFor] = [p];
                }
                /*if (property.type == 'Function' && !(p in this)) {
                    this.prototype[p] = function () { this.get(p).apply(this.arguments) };
                }*/
            }

            delete cfg._prop;
        },

        each: function (el, callback) {
            var i, _i, out;

            if (el === null || el === void 0)
                return false;

            if (QObject.isArray(el)) {
                for (i = 0, _i = el.length; i < _i; i++) {
                    out = callback.call(el[i], el[i], i);
                    if (out !== void 0) // breakable
                        return out;
                }
            } else {
                for (i in el)
                    if (el.hasOwnProperty(i)) {
                        out = callback.call(el[i], i, el[i]);
                        if (out !== void 0) // breakable
                            return out;
                    }

            }
        },
        emptyFn: function () { },
        getProperty: function (prop) {
            return function (a) {
                return a[prop];
            };
        },
        logging: function (ns, val) {
            loggingNS[ns] = val === void 0 ? true : val;
        },
        console: function (ns) {
            var out = {};
            for (var i in console)
                out[i] = (function (fnName) {
                    return function () {
                        if (loggingNS[ns])
                            return console[fnName].apply(console, arguments);
                        return void 0;
                    };
                })(i);
            return out;
        },
        sort: {
            number: function (a, b) {
                return b - a;
            },
            /**
             * Sort with guaranteed order. javascript sort shuffle elements order if value is the same
             * @param arr
             * @param propName {String or Function}
             * @param fn
             * @returns {Array.<T>}
             */
            guaranteed: function (arr, propName, fn) {
                var hash = {},
                    sortedHash = [],
                    i, _i, item,
                    prop,
                    sortFn = fn || QObject.sort.number;

                if (typeof propName === 'string')
                    propName = QObject.getProperty(propName);

                for (i = 0, _i = arr.length; i < _i; i++) {
                    item = arr[i];
                    prop = propName(item);
                    (hash[prop] || (hash[prop] = [])).push(item);
                }

                for (i in hash)
                    hash.hasOwnProperty(i) && sortedHash.push(i);

                sortedHash.sort(sortFn);

                return Array.prototype.concat.apply([], sortedHash.map(function (key) {
                    return hash[key];
                }));
            }
        }
    };

    QObject.prototype = prototype;

    // makes prototype properties not enumerable
    prototype.apply(QObject, prototype);

    /**
    * @returns {Function}
    * @memberOf QObject
    * @static
    */
    QObject.extend = function (name, cfg, init) {
        var mixins,
            constructor,
            original = components[this._type], //what is extending
            Cmp;

        if (init)
            constructor = function (cfg) {
                init.call(this, cfg);
                if (this.constructor === Cmp)
                    this._afterInit();
            };


        var props = cfg._prop = cfg._prop || {};
        for (var key in cfg) {
            if (cfg.hasOwnProperty(key)) {
                if (cfg[key] instanceof Function && key[0] !== '_' && !(key in props)) {
                    props[key] = new Property('Function');
                }
            }
        }

        /** constructor of new component */
        Cmp = constructor ||
            function (cfg) {
                original.call(this, cfg);
                if (this.constructor === Cmp)
                    this._afterInit();
            };

        /** Mixing */
        mixins = cfg.mixin;
        if (mixins) {
            delete cfg.mixin;
            mixins = prototype.makeArray(mixins);
        } else {
            mixins = [];
        }
        mixins.unshift(original.prototype);

        cfg._type = name;

        var _mixinsInit = [];
        Cmp.prototype = prototype._mixing(cfg, mixins, _mixinsInit);
        if (_mixinsInit.length) {
            Cmp.prototype._mixinsInit = _mixinsInit;
        }


        Cmp.prototype.constructor = Cmp;

        Cmp._type = Cmp.prototype._type = name;
        Cmp._prototype = Cmp.prototype._prototype = this._type;
        Cmp.extend = QObject.extend;
        Cmp.document = QObject.document;

        /** register to components */
        components[name] = Cmp;

        return Cmp;
    };

    QObject._knownComponents = components;

    QObject._type = QObject.prototype._type = "QObject";
    QObject._knownComponents['QObject'] = QObject;
    QObject.mixins = mixins;

    if (typeof document === 'undefined') {
        //QObject.document = require("dom-lite").document;
    } else {
        QObject.document = document;
    }

    return QObject;
})();