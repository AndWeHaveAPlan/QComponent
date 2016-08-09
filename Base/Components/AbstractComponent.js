/**
 * Created by ravenor on 30.06.16.
 */

var QObject = require('./../QObject'),
    EventManager = require('./../EventManager'),
    uuid = require('tiny-uuid'),
    ObservableSequence = require('observable-sequence'),
    DQIndex = require('z-lib-structure-dqIndex'),
    MulticastDelegate = require('../MulticastDelegate'),
    Property = require('../Property');

/**
 * Base class for all components
 * @param cfg.parent Component: Parent component
 * @param cfg.id String: Component unique id
 * @param [cfg.leaf] Boolean: True if component may have children
 * @constructor
 */
function AbstractComponent(cfg) {

    var self = this;
    Function.prototype.apply.call(QObject, this, arguments);

    if (!this.id)
        this.id = uuid();

    /**
     *
     * @type {{}}
     * @private
     */
    this._data = {};

    /**
     * Own Components
     *
     * @type Array<AbstractComponent>
     * @private
     */
    this._ownComponents = new ObservableSequence(new DQIndex('id'));

    if (!this.leaf) {
        /** instantly modify child components on append */
        this._ownComponents.on('add', function (child) {
            child.parent = self;
        });
    }

    this._initProps(cfg || {});

    /**
     * Event. Fires with any changes made with get(...)
     *
     * @type Function
     * @private
     */
    this._onPropertyChanged = new MulticastDelegate();

    if (!this._eventManager)
        this._eventManager = new EventManager(this.id);

    this._eventManager.registerComponent(this);
}
var defaultPropertyFactory = new Property('Variant', {description: 'Someshit'});
AbstractComponent.document = QObject.document;
AbstractComponent.extend = QObject.extend;
AbstractComponent.prototype = Object.create(QObject.prototype);
QObject.prototype.apply(AbstractComponent.prototype, {

    _init: function(){},
    _prop: {},
    _initProps: function (cfg) {

        var overrided = [];

        var prop = this._prop, i,
            newProp = this._prop = {};

        for (i in prop) {
            if (i === 'default') {
                newProp[i] = prop[i];
            } else if (prop[i].cfg && prop[i].cfg.overrideKey) {
                overrided.push({prop: prop, key: i});
            } else {
                if (i in cfg)
                    newProp[i] = new prop[i](this, i, cfg[i]);
                else
                    newProp[i] = new prop[i](this, i);
            }
        }

        for (var i = 0; i < overrided.length; i++) {
            var key = overrided[i].key;
            var prop = overrided[i].prop;
            if (prop.cfg.overrideKey in newProp) {
                newProp[key] = newProp[prop.cfg.overrideKey];
            }
        }
    },

    regenId: function () {
        this.id = uuid();
    },


    /**
     * Get property from component
     *
     * @param name String
     */
    get: function (name) {

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
     * @param name String
     * @param value Object
     */
    set: function (name, value) {
        var nameParts = name.split('.');

        if (nameParts.length > 1) {
            var getted = this.get(nameParts.slice(0, nameParts.length - 1).join('.'));
            if (getted)
                if (getted instanceof AbstractComponent) {
                    getted.set(nameParts[nameParts.length-1], value);
                } else {
                    getted[nameParts[nameParts.length - 1]] = value;
                    this._onPropertyChanged(nameParts.splice(0, 1), value);
                }
        } else {
            if (!this._prop[name]) {
                this._prop[name] = new (this._prop.default || defaultPropertyFactory)(this, name);
            }
            return this._prop[name].set(value);
        }

        return this;
    },

    /**
     * Subscribe to _onPropertyChanged event
     *
     * @param callback Function
     */
    subscribe: function (callback) {
        this._onPropertyChanged.addFunction(callback);
    },

    /**
     * Add Child component
     *
     * @param component AbstractComponent: AbstractComponent to add
     */

    _type: 'AbstractComponent'
});

AbstractComponent._type = AbstractComponent.prototype._type;

/** properties that need deep applying */


QObject._knownComponents['AbstractComponent'] = module.exports = AbstractComponent;