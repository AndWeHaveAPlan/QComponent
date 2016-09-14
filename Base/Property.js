/**
 * Created by zibx on 01.08.16.
 */
module.exports = (function () {
    'use strict';
    /**
     * Factory of factories of properties
     */
    var QObject;
    var ObservableSequence = require('observable-sequence');
    var dequeue = require('z-lib-structure-dequeue');

    var dataTypes = {
        Boolean: {
            set: function (key, value, old, e) {
                if ((value !== !!value) && (value !== 'true' && value !== 'false'))
                    e.cancel();
            },
            get: function (key, value) {
                return value;
            }
        },
        Number: {
            set: function () {

            },
            get: function (key, value) {
                return value;
            }
        },
        Variant: {
            set: function () {

            },
            get: function (key, value) {
                return value;
            }
        },
        Array: {
            set: function (key, value, old, e) {

                var val = value;
                if (!(value instanceof ObservableSequence)) {
                    value = new ObservableSequence(new dequeue());
                    val.forEach(function (v) {
                        value.push(v);
                    });
                    e.value(val);
                }
            },
            get: function (key, value) {
                return value;
            }
        }
    };

    var SetterFlags = function () { };
    SetterFlags.prototype = {
        canceled: false,
        valueSetted: false,
        _value: null,
        value: function (val) {
            this._value = val;
            this.valueSetted = true;
        },
        cancel: function () {
            this.canceled = true;
        }
    };

    /**
     * 
     * @param value
     */
    var setter = function (value) {
        var key = this.proxyFor || this.key,
            oldValue = this.parent._data[key],
            proxy = this.parent._prop.__proxy[key],
            prop = this.parent._prop[this.proxyFor] || this,
            flags;


        if (value !== oldValue) {
            flags = new SetterFlags();
            this.parent._data[key] = value;
            prop._set.call(this.parent, key, value, oldValue, flags);
            if (!flags.canceled) {
                if (flags.valueSetted)
                    value = this.parent._data[key] = flags._value;
                if (value !== oldValue) {
                    this.parent._onPropertyChanged(this.parent, [key], value, oldValue);
                    if (proxy) {
                        for (var i = 0; i < proxy.length; i++) {
                            this.parent._onPropertyChanged(this.parent, [proxy[i]], value, oldValue);
                        }

                    }
                    return true;
                }
            }
        } else {
            return false;
        }

        this.parent._data[key] = oldValue;
        return false;
    };

    /**
     * 
     */
    var getter = function () {
        var key = this.proxyFor || this.key;
        return this._get.call(this.parent, key, this.parent._data[key]);
    };

    /**
     * 
     * @param type
     * @param metadata
     * @param cfg
     * @param defaultValue
     */
    var Property = function (type, metadata, cfg, defaultValue) {
        QObject = QObject || require('./QObject');
        metadata = metadata || {};
        cfg = cfg || {};


        this.cfg = cfg;
        if ('set' in metadata || 'get' in metadata)
            throw new Error('do not put get/set to metadata');
        var dataType = dataTypes[type],
            proto = { parent: null };

        /** if type is in known classes */
        if (!dataType && QObject._knownComponents[type])
            dataType = dataTypes[type] = Property.generate.typed(type, QObject._knownComponents[type]);

        if (!dataType)
            dataType = dataTypes.Variant;

        proto.type = metadata.type = type;

        if (arguments.length > 3) {
            proto.setDefault = true;
            proto.value = metadata.defaultValue = defaultValue;
        }

        /**
         * 
         * @param parent
         * @param key
         * @param value
         */
        var cls = function (parent, key, value) {
            if (!parent._prop.__proxy)
                parent._prop.__proxy = {};

            this.parent = parent;
            this.key = key;
            this.proxyFor = cfg.proxyFor;

            if (this.proxyFor) {

                if (!parent._prop.__proxy[this.proxyFor])
                    parent._prop.__proxy[this.proxyFor] = [];

                parent._prop.__proxy[this.proxyFor].push(key);
            }
        };

        //
        if (cfg.proxyFor) cls.proxyFor = cfg.proxyFor;

        cls.prototype = proto;
        proto.metadata = metadata;
        if (!('set' in cfg) && !('get' in cfg)) {
            proto._set = dataType.set;
            proto._get = dataType.get;
        } else {
            proto._set = cfg.set;
            proto._get = cfg.get;
        }

        proto.set = setter;
        proto.get = getter;
        return cls;
    };
    Property.defineType = function (name, cfg) {
        dataTypes[name] = cfg;
    };
    Property.generate = {
        proxy: function (proxyFor) {
            return new Property('Variant', { description: 'Proxy for ' + proxyFor + ' property' }, { proxyFor: proxyFor });
        },
        typed: function (name, cls) {
            return {
                set: function (key, value, old, e) {
                    if (!(value instanceof cls || (value && value.prototype && value.prototype instanceof cls)))
                        return e.cancel();
                },
                get: function (key, value) {
                    return value;
                }
            };
        },
        cssProperty: function (text) {
            return new Property('String',
                { description: text },
                {
                    set: function (key, val) {
                        if (val) {
                            this.el.style[key] = val;
                        } else {
                            this.el.style.removeProperty(key);
                        }
                    },
                    get: function (key, value) {
                        return value;
                    }
                }
            );
        },
        attributeProperty: function (attr) {
            return new Property('String',
                { description: attr },
                {
                    set: function (key, val) {
                        if (!val) {
                            this.el.removeAttribute(attr);
                            delete this.el[attr];
                        } else {
                            this.el.setAttribute(attr, val);
                            this.el[attr] = val;
                        }

                        this.el[attr] = val;
                    },
                    get: function (key, value) {
                        return value;
                    }
                }
            );
        }
    };

    Property.defaultGetter = dataTypes.Variant.get;
    Property.defaultSetter = function (name, value) { };

    return Property;
})();