/**
 * Created by ravenor on 30.06.16.
 */

var QObject = require('./../QObject'),
    EventManager = require('./../EventManager'),
    uuid = require('tiny-uuid'),
    ObservableSequence = require('observable-sequence'),
    DQIndex = require('z-lib-structure-dqIndex'),
    MulticastDelegate = require('../MulticastDelegate'),
    Property = require('../Property'),
    observable = require('z-observable');


/**
 * Base class for all components
 * @param cfg.parent Component: Parent component
 * @param cfg.id String: Component unique id
 * @param [cfg.leaf] Boolean: True if component may have children
 * @constructor
 */
function AbstractComponent(cfg) {
    var self = this;
    observable.prototype._init.call(this);

    //Function.prototype.apply.call(QObject, this, arguments);
    cfg = cfg || {};
    this._cfg = cfg;
    this.id = cfg.id || uuid();
    delete cfg.id;
    /**
     *
     * @type {{}}
     * @private
     */
    this._data = {
        id: this.id
    };

    /**
     * Own Components
     *
     * @type Array<AbstractComponent>
     * @private
     */
    this._ownComponents = new ObservableSequence(new DQIndex('id'));

    /** instantly modify child components on append */
    this._ownComponents.on('add', function (child) {
        child.parent = self;
        self._eventManager.registerComponent(child);
        //self.set([child.id], child);
        self.el.appendChild(child.el);
    });

    /**
     * Child Components
     *
     * @type Array<AbstractComponent>
     * @private
     */
    this._children = new ObservableSequence(new DQIndex('id'));

    this._children.on('add', function (child) {
        child.parent = self;
        //insert to dom
        if (child.el) { /** UI Component */
            if (self._contentContainer) {
                self._contentContainer.el.appendChild(child.el);
            } else {
                self.el.appendChild(child.el);
            }
        }
    });

    this._children.on('remove', function (child) {
        child.parent = null;
        if (self._contentContainer && child.el) {
            self._contentContainer.el.removeChild(child.el);
        } else {
            self.el.removeChild(child.el);
        }
    });

    this._initProps(cfg);

    /**
     * Event. Fires with any changes made with get(...)
     *
     * @type Function
     * @private
     */
    this._onPropertyChanged = new MulticastDelegate();

    if (!this._eventManager)
        this._eventManager = new EventManager(this);

    this._eventManager.registerComponent(this);
}
var defaultPropertyFactory = new Property('Variant', {description: 'Someshit'});
AbstractComponent.document = QObject.document;
AbstractComponent.extend = QObject.extend;
AbstractComponent.prototype = Object.create(QObject.prototype);
QObject.prototype.apply(AbstractComponent.prototype, {
    _prop: {
        id: new Property('String', {description: 'Component ID'}, {
            set: function (key, val) {
                if (this.id && this.id !== val)
                    return false;

                this.id = key;
            },
            get: Property.defaultGetter
        })
    },
    _init: function () {
        var cfg = this._cfg;
        for (var p in cfg) {
            if (cfg.hasOwnProperty(p)) {
                this.set([p], cfg[p]);
            }
        }

        delete this._cfg;
    },
    _initProps: function (cfg) {
        var prop = this._prop, i,
            newProp = this._prop = {};

        for (i in prop) {
            if (i === 'default') {
                newProp[i] = prop[i];
            } else {
                if (i in cfg)
                    newProp[i] = new prop[i](this, i);//, cfg[i]);
                else
                    newProp[i] = new prop[i](this, i);
            }
        }

        delete cfg._prop;
    },

    _afterInit: function () {
        this._init();
        this._eventManager.releaseThePipes();
    },

    regenId: function () {
        this.id = uuid();
    },


    /**
     * Get property from component
     *
     * @param names String
     */
    get: function (names) {

        if (!Array.isArray(names)) {
            return this._get(names);
        }

        if (!names) {
            return this.get(['value']);
        }

        var ret = this;
        if (names.length > 1) {
            for (var i = 0; i < names.length; i++) {
                if (ret instanceof AbstractComponent) {
                    ret = ret.get(names[i]);
                } else {
                    ret = ret[names[i]];
                }
                if (ret == void 0)
                    return ret;
            }
            return ret;
        } else if (names.length === 1) {
            return names[0] in this._prop ? this._prop[names[0]].get() : void (0);
        } else {
            return void(0)
        }
    },

    /**
     *  Old method with string parameter
     * @param name
     * @returns {*}
     * @private
     */
    _get: function (name) {

        var nameParts = name.split('.');
        var ret = this;

        if (nameParts.length > 1) {
            for (var i = 0; i < nameParts.length; i++) {
                if (ret instanceof AbstractComponent) {
                    ret = ret.get(nameParts[i]);
                } else {
                    ret = ret[nameParts[i]];
                }

                if (ret == void 0)
                    return ret;
            }

            return ret;

        } else {
            return name in this._prop ? this._prop[name].get() : void 0;
        }
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

        //TODO тут хуйня какая-то, надо бы перепроверить

        var ret = void(0);
        var firstName = names[0];
        var lastName = names[names.length - 1];

        if (names.length > 1) {
            var getted = this.get(names.slice(0, names.length - 1).join('.'));
            if (getted)
                if (getted instanceof AbstractComponent) {
                    ret = getted.set(lastName, value);
                } else {
                    ret = getted[lastName] = value;
                    this._onPropertyChanged(this, firstName, value);
                }
        } else {
            if (!this._prop[firstName]) {
                this._prop[firstName] = new (this._prop.default || defaultPropertyFactory)(this, firstName);
            }
            ret = this._prop[firstName].set(value);
        }

        console.log(names);
        this._onPropertyChanged(this, this.id, this);
        return ret;
    },

    /**
     * @deprecated
     * @param name
     * @param value
     * @private
     */
    _set: function (name, value) {
        this.set(name, value);
    },

    /**
     * Subscribe to _onPropertyChanged event
     *
     * @param callback Function
     */
    subscribe: function (callback) {
        this._onPropertyChanged.addFunction(callback);
    },

    find: function (matcher) {
        var out = []
        this._ownComponents.forEach(function (item) {
            if (item._type === matcher)out.push(item);
            out = out.concat(item.find(matcher));
        });
        this._children.forEach(function (item) {
            if (item._type === matcher)out.push(item);
            out = out.concat(item.find(matcher));
        });
        return out;
    },
    _type: 'AbstractComponent'
});

AbstractComponent._type = AbstractComponent.prototype._type;

/** properties that need deep applying */


QObject._knownComponents['AbstractComponent'] = module.exports = AbstractComponent;