/**
 * Created by zibx on 01.08.16.
 */
module.exports = (function () {
    'use strict';
    /**
     * Factory of factories of properties
     */
    var QObject = require('./QObject');
    var dataTypes = {
        Boolean: {
            set: function () {

            },
            get: function (key, value) {
                return value;
            },
            validate: function (value) {
                if ((value !== !!value) && (value !== 'true' && value !== 'false'))
                    return false;
                else
                    return true;
            }
        },
        Number: {
            set: function () {

            },
            get: function (key, value) {
                return value;
            },
            validate: function (value) {
                if (typeof value !== 'number')
                    return true;
                else
                    return true;
            }
        },
        Variant: {
            set: function (value) {

            },
            get: function (key, value) {
                return value;
            }
        }
    };

    var setter = function (value) {
        var key = this.proxyFor || this.key,
            oldValue = this.parent._data[key],
            validate = this.validate,
            proxy = this.parent._prop.__proxy[key],
            prop = this.parent._prop[this.proxyFor] || this;


        if ((!validate || (validate && validate(value))) && value !== oldValue) {
            this.parent._data[key] = value;
            if (prop._set.call(this.parent, key, value, oldValue) !== false) {
                this.parent._onPropertyChanged(this.parent, key, value, oldValue);
                if (proxy) {
                    for (var i = 0; i < proxy.length; i++) {
                        this.parent._onPropertyChanged(this.parent, proxy[i], value, oldValue)
                    }
                }
            } else {
                this.parent._data[key] = oldValue;
            }

        } else
            return false;
    };
    var getter = function () {
        var key = this.proxyFor || this.key;
        return this._get.call(this.parent, key, this.parent._data[key]);
    };

    var Property = function (type, metadata, cfg, defaultValue) {
        metadata = metadata || {};
        cfg = cfg || {};
        this.cfg = cfg;
        if ('set' in metadata || 'get' in metadata)
            throw new Error('do not put get\\set to metadata');
        var dataType = dataTypes[type],
            proto = {parent: null};

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

        var cls = function (parent, key) {
            if (!parent._prop.__proxy)
                parent._prop.__proxy = {};

            this.parent = parent;
            this.key = key;
            this.proxyFor = cfg.proxyFor;

            if (this.setDefault) {
                this.parent._data[key] = this.value;
            }

            if (this.proxyFor) {

                if (!parent._prop.__proxy[this.proxyFor])
                    parent._prop.__proxy[this.proxyFor] = [];

                parent._prop.__proxy[this.proxyFor].push(key);
            }
        };
        cls.prototype = proto;
        proto.metadata = metadata;
        if (!('set' in cfg) && !('get' in cfg)) {
            proto._set = dataType.set;
            proto._get = dataType.get;
        } else {
            proto._set = cfg.set;
            proto._get = cfg.get;
        }
        if (('validate' in cfg) || (!('validate' in cfg) && ('validate' in dataType))) {
            proto.validate = cfg.validate || dataType.validate;
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
            return new Property('String', {description: 'Proxy for '+proxyFor+' property'}, {proxyFor: proxyFor});
        },
        typed: function (name, cls) {
            return {
                set: function () {

                },
                get: function (key, value) {
                    return value;
                },
                validate: function (value) {
                    return value instanceof cls || (value && value.prototype && value.prototype instanceof cls);
                }
            };
        },
        cssProperty: function (text) {
            return new Property('String',
                {description: text},
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
                {description: attr},
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
    return Property;
})();