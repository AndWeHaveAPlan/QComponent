/**
 * Created by ravenor on 30.06.16.
 */

var QObject = require('./../QObject'),
    EventManager = require('./../EventManager'),
    uuid = require('tiny-uuid'),
    ObservableSequence = require('observable-sequence'),
    DQIndex = require('z-lib-structure-dqIndex'),
    MulticastDelegate = require('../MulticastDelegate');

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

    /**
     * Event. Fires with any changes made with get(...)
     *
     * @type Function
     * @private
     */
    this._onPropertyChanged = new MulticastDelegate();

    if (!this._eventManager)
        this._eventManager = new EventManager();

    this._eventManager.registerComponent(this);
}

AbstractComponent.document = QObject.document;
AbstractComponent.extend = QObject.extend;
AbstractComponent.prototype = Object.create(QObject.prototype);
QObject.prototype.apply(AbstractComponent.prototype, {

    regenId: function () {
        this.id = uuid();
    },

    /** mutators */
    _setter: {
        default: function (name, value) {
            var oldValue = this._data[name];
            this._data[name] = value;
            //TODO проверки надо бы всякие
            this._onPropertyChanged(this, name, value, oldValue);
        }
    },

    /** accessors */
    _getter: {
        default: function (name) {
            return this._data[name];
        }
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
            var accessor = this._getter[name] || this._getter.default;
            return accessor.call(this, name);
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
                    getted.set(nameParts.unshift, value);
                } else {
                    getted[nameParts[nameParts.length - 1]] = value;
                    this._onPropertyChanged(nameParts.splice(0, 1), value);
                }
        } else {
            var mutator = this._setter[name] || this._setter.default;
            mutator.call(this, name, value);
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